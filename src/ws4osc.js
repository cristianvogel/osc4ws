import WebSocket, {WebSocketServer} from 'ws';
import Colors from 'colors/safe.js';


const ws4osc = {

    wss: {},
    latestIncomingWSMessage: '',
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

    initialise: function( ) {

        if ( this.wss === undefined ) return;
        const { wss } = this;
        const handleIncoming = ( event ) => {
            console.log(Colors.dim('Websocket client ▶︎' + event))
            this.latestIncomingWSMessage = event.toString();
            this.updateWebSocketClients();
        };
        // Connection opened, handshake with new client
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
        this.wss.close(1013, 'Closed by osc2ws');
    },

    updateWebSocketClients: function () {
        if ( this.connectedWSClients!==this.wss.clients ) {
            this.connectedWSClients = { ...this.wss.clients};
        }
        return this.connectedWSClients;
    }
};
let updatedClientSet = ws4osc.updateWebSocketClients.bind(ws4osc);
export const sendOSCtoSocket = ws4osc.sendJSONToWSClient.bind(ws4osc);
export default ws4osc;
