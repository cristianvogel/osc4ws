"use strict"
import ws4osc from './ws4osc.js';
import Colors from 'colors/safe.js';
import prompt from 'prompt-sync';
import osc4ws from './osc4ws.js';
import {internalIpV4Sync} from "internal-ip";
import  dnssd from 'dnssd';

function userSetWebSocketPort( text = '' ) {
    const wsPortChoice = prompt()(
         Colors.bgGreen('👾 '+text+' ▶︎ Enter WEBSOCKET port (7000-12000) or press return for default port:'), '8005');
    return Number(wsPortChoice);
}

function userSetLocalOSCPort( text = ''){
    const oscPortChoice = prompt()(
        Colors.bgBlue('🎛 '+text+' ▶︎ Enter local OSC port (7000-12000) or press return for default port:'), '9005');
    return Number(oscPortChoice);
}

function userSetRemoteOSCTarget( text = ''){
    let target = prompt()(
        Colors.bgCyan('🎛 '+text+' ▶︎ Enter remote OSC IP address and port (eg. localhost:9090) or press return:'), undefined );
    if (target!=='') {
        const sep = target.split(':');
        target = { address: sep[0], port: sep[1] }
    } else { target = { address: '192.155.0.53', port: '13755' } };
    return target;
}

ws4osc.start(userSetWebSocketPort());
ws4osc.initialise();
const userDefinedListenerPort = userSetLocalOSCPort( 'Hello: ');
const userDefinedRemoteTarget = userSetRemoteOSCTarget( 'Thankyou: ');
const options = {
        remoteAddress: userDefinedRemoteTarget.address,
        remotePort: userDefinedRemoteTarget.port,
        localAddress: internalIpV4Sync(),  // localhost IP address
        localPort: userDefinedListenerPort
    };

const oscOverUDP = osc4ws.start( options );


if ( oscOverUDP === undefined) process.exit(0);

/**
 advertise the osc service for zero-conf compatible dnssd setup
 ws4osc will become a nearby service which can be easily connected to in one click
 for example TouchOSC or OSCulator see the service on the local network as 'ws4osc'
 **/

const advertiseService = dnssd.Advertisement (
    '_osc._udp',
    options.localPort,
    {
        name: 'osc4ws' ,
        host: options.localAddress,
    }).start();


// --------------------------------------


