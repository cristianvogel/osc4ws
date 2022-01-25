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

`node main.js`

After starting up, it should prompt you to define a port number for the WebSocket server and then a port number for the OSC connection. Then hopefully something like this will display

```
👾  ▶︎ Enter WEBSOCKET port (7000-12000) or press return for default port:
🎛 Hello:  ▶︎ Enter listen OSC port (7000-12000) or press return for default port:
🎛 Thankyou:  ▶︎ Enter remote OSC IP address and port (eg. 192.155.0.53:9090) or press return:172.20.10.4:9005
Ready for OSC over UDP.
Send to remote: 172.20.10.4:9005
Listen on: 172.20.10.2:9005
Websocket connected on port 8005
Got OSC data from: 172.20.10.4 on port 9004

```

Now connect your websocket to `ws://localhost:8005`<br>
Send OSC data to your local IP address and use port 9005<br>
eg : `192.168.1.169:9005`

This [video tutorial](https://www.youtube.com/watch?v=1cIhDfrHM74&feature=youtu.be) shows the whole process for the original [osc2ws](https://github.com/pandrr/osc2ws) version sending OSC into [Cables.gl](https://dev.cables.gl) <br>
