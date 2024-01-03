import WebSocket, {WebSocketServer} from 'ws';
import Colors from 'colors/safe.js';
import {sendOSCtoUDP} from "./osc4ws.js";


const ws4osc = {

    wss: {},
    latestIncomingWS: null,
    connectedWSClients: [],

    start: function ( _port ) {

        try {
            let server = new WebSocketServer({
                    port: _port,
                    perMessageDeflate: false,
                    host: 'localhost',
                    clientTracking: true
                }, () => console.log(Colors.rainbow('Websocket connected on port ' + _port))
            );
            this.wss = server;
        } catch (e) {
            console.log(Colors.blue(' ⚠️ Cannot start websocket: ' + e));
        }
    },

    sendJSONToWSClient:  function ( data )  {

        this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    },

    parseIncomingOSC: function ( data ){
        const incomingOSC = JSON.parse(data.toString());
        console.log(Colors.dim(`handling ${data}`));
        sendOSCtoUDP( incomingOSC );
    },

    initialise: function( ) {

        if ( this.wss === undefined ) return;
        const { wss } = this;

        const handleIncoming = ( event ) => {
            const {  latestIncomingWS: curr } = this;
            if( Date.now() % 10000 < 100) this.updateWebSocketClients(); // todo: replace this check with WS ping/pong
            if ( curr !== event ) {
                this.latestIncomingWS = event;
                this.parseIncomingOSC ( event );
            }
        };

        /**
         * Connection opened, touch elbows with new client
         * because handshaking is not advised during pandemic
         */
        wss.on('connection', function connection(ws) {
                ws.on('message', handleIncoming);
                ws.send(JSON.stringify({ message: 'Elbows!'}));
         });

        wss.on('close', function (event) {
            this.close();
        });

        wss.on('error', function (event) {
            console.log('WebSocket closed with error: ', event);
            wss.close(1002, 'Protocol error');
        });
        return wss.clients;
    },

    close: () => {
        this.wss.close(1013, 'Closed by osc4ws');
    },

    updateWebSocketClients: function () {
        if ( this.connectedWSClients!==this.wss.clients ) {
            this.connectedWSClients = { ...this.wss.clients};
        }
        return this.connectedWSClients;
    }
};

export const sendOSCtoSocket = ws4osc.sendJSONToWSClient.bind(ws4osc);
export default ws4osc;
