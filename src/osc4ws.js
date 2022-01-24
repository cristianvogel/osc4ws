import osc from "osc"
import {internalIpV4Sync} from "internal-ip";
import Colors from "colors/safe.js";
import os from "os";
import {sendOSCtoSocket} from './ws4osc.js';
import Message from "./message.js";



/****************
 * OSC Over UDP *
 ****************/

const osc4ws = {

    _UDPTransport: {},
    latestIncomingUDP: {},

    sendOSCtoUDP: function ( msg ) {

         //   console.log(Colors.dim(`sending ${msg.address}`));
            this._UDPTransport.send(msg);
    },

    start: function ( options ) {

            options = { ...options, metadata: true};
            this._UDPTransport = new osc.UDPPort( options );
            try {
                this._UDPTransport.open()
            } catch (e) {
                console.log(Colors.zebra('Cannot open UDP transport for OSC communication...' + e))
                return undefined
            }

            this.initialise(this._UDPTransport);
            return this._UDPTransport
    },

    initialise:  function ( _UDPPort ) {

         if (_UDPPort === undefined ) return;
         const p = _UDPPort.options;
        _UDPPort.on("ready",  () => {
            console.log ( Colors.green( 'Ready for OSC over UDP.'));
            console.log ( 'Send to remote: '+ p.remoteAddress + ':'+ p.remotePort  );
            console.log ( 'Listen on: '+ p.localAddress + ':'+ p.localPort  )
            });


        /**
         * Listen for incoming OSC messages if transport is a receiver
         * Plug OSC into a simple Message container
         * for forwarding to the Websocket.
         *
         * ignore incoming timeTag: timeTag for now
         *
         * Also grab some info about the sender stored in this
         * instance of osc4ws, create an additional getter for a loopback
         * which is a different port same IP
         * by convention the sender port number offset by -1
         * idea is to help mitigate OSC feedback loops
         **/


            _UDPPort.on("message", (oscMsg, timeTag, info) => {
                /**
                 * only update stored client info if it has changed
                 * **/

                if (!(this.latestIncomingUDP.fromIP === info.address ||
                    this.latestIncomingUDP.fromPort === info.port)) {

                    const clientInfoObj = {
                        fromIP: info.address,
                        fromPort: info.port,
                        loopBackOffset: -1,
                        loopBackPort: this.fromPort - this.loopBackOffset
                    };

                    this.latestIncomingUDP = {...clientInfoObj};
                    console.log(Colors.italic('Got OSC data from: ' + this.latestIncomingUDP.fromIP + ' on port ' + this.latestIncomingUDP.fromPort));

                }
                /**
                 Parse OSC { address, [args] }
                 Args might be a bundle, so iterate through the list
                 OSC can be 'f' float 'i' int 's' string or 'b' blob
                 **/
                const {address, args} = oscMsg;
                //console.log( address , args );
                let data = [];
                for (const arg of args) {
                    const {type, value} = arg;

                    switch (type) {
                        case 'f':
                            data.push(Number(value));
                            break;
                        case 'i':
                            data.push(Math.round(Number(value)));
                            break;
                        case 's':
                            data.push(value.toString());
                            break;
                        case 'b':
                            value.arrayBuffer().then(buffer => data = buffer); // should this be an array of arrays?
                            break;
                        default:
                            data.push(value)
                    }
                }
                //send parsed OSC to WebSocket
                sendOSCtoSocket(new Message('' + address, data));
            });

        // Listen for oops
        _UDPPort.on("error", function (err) {
            console.log( Colors.red(err.toString()));
        });
    }
}

export const sendOSCtoUDP = osc4ws.sendOSCtoUDP.bind(osc4ws);
export default osc4ws;
