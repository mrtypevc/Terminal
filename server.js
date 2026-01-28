const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const pty = require("node-pty");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    const term = pty.spawn("bash", [], { cols: 80, rows: 24, cwd: "/", env: process.env });

    term.on("data", data => ws.send(data));
    ws.on("message", msg => term.write(msg));
    ws.on("close", () => term.kill());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Terminal server running on port ${PORT}`));
