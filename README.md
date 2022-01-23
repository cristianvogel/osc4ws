# osc4ws
OSC to WebSocket bidirectional peer to peer proxy based on [osc2ws](https://github.com/pandrr/osc2ws)

Sadly, browsers can not receive OSC data. This little tool receives OSC messages and serves them via WebSocket technology using the reliable [websockets/ws](https://github.com/websockets/ws) library.
You can then use a browser's websocket client to connect to it and receive the data. Use the same socket to send data back to the OSC client. 


## installation

Install node.js for your operating system. <br>
Download or clone the repo into a folder. <br>
Open a terminal in the osc4ws directory and type:

`npm i`

## start

`node src/main.js`

After starting up, it should prompt you to define a port number for the WebSocket server and then a port number for the OSC connection. Then hopefully something like this will display

```
Local IP: 192.168.1.169
Starting websocket server on port 8005
Starting OSC receiver on port 9005
```

Now connect your websocket to `ws://localhost:8005`<br>
Send OSC data to your local IP address and use port 9005<br>
eg : `192.168.1.169:9005`

This [video tutorial](https://www.youtube.com/watch?v=1cIhDfrHM74&feature=youtu.be) shows the whole process for the original [osc2ws](https://github.com/pandrr/osc2ws) version sending OSC into [Cables.gl](https://dev.cables.gl) <br>
