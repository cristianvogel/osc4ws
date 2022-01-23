"use strict"
import ws4osc from './ws4osc.js';
import Colors from 'colors/safe.js';
import prompt from 'prompt-sync';
import osc4ws from './osc4ws.js';


function userSetWebSocketPort() {
    const wsPortChoice = prompt()(
         Colors.bgGreen(`🎛 Enter WEBSOCKET port (7000-12000) or press return for default port 8005:`), '8005');
    return Number(wsPortChoice);
}

function userSetOSCPort(){
    const oscPortChoice = prompt()(
        Colors.bgBlue(`🎛 Enter OSC port (7000-12000) or press return for default port 9005:`), '9005');
    return Number(oscPortChoice);
}

ws4osc.start(userSetWebSocketPort());
ws4osc.initialise();
osc4ws.start(userSetOSCPort());

// --------------------------------------


