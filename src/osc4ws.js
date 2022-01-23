import osc from "osc"
import {internalIpV4Sync} from "internal-ip";
import Colors from "colors/safe.js";
import os from "os";
import {sendOSCtoSocket} from './ws4osc.js'


/****************
 * OSC Over UDP *
 ****************/

const osc4ws = {

    _oscSendPort: 9005,
    _UDPPort: {},
    _latestIncomingUDP: '',

    getIPAddresses: function () {

        const  interfaces = os.networkInterfaces();
        let  ipAddresses = [];

        for (let deviceName in interfaces) {

            const addresses = interfaces[deviceName];
            for (let i = 0; i < addresses.length; i++) {
                const addressInfo = addresses[i];
                if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                    ipAddresses.push(addressInfo.address);
                }
            }
        }
        return ipAddresses;
    },

    start: function ( port ) {
        this._UDPPort = new osc.UDPPort({
            localAddress: internalIpV4Sync(),
            localPort: port
        });
        try {this._UDPPort.open()} catch (e) { console.log(Colors.zebra('Cannot open UDP...'+e))};
        this.initialise()
    },

    initialise: function ( _UDPPort = this._UDPPort ) {
        _UDPPort.on("ready",  () => {
            let ipAddresses = this.getIPAddresses();
            console.log( Colors.bgCyan("Listening for OSC over UDP."));
            ipAddresses.forEach(function (address) {
                console.log(Colors.bgCyan(" Host:" + address + ", Port:" + _UDPPort.options.localPort));
            });
        });

        // Listen for incoming OSC messages.
        _UDPPort.on("message",  (oscMsg, timeTag, info) => {
            this._latestIncomingUDP = oscMsg;
            console.log("UDP OSC in: ", Colors.dim(oscMsg));
            sendOSCtoSocket( this._latestIncomingUDP );
        });

        // Listen for oops
        _UDPPort.on("error", function (err) {
            console.log( Colors.red(err.toString()));
        });
    }
}

export default osc4ws;
