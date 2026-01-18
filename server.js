const express = require("express");
const WebSocket = require("ws");

const PASSWORD = process.env.PASSWORD || "1234";

const app = express();
app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000);
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  ws.on("message", msg => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.password !== PASSWORD) return;
      wss.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(JSON.stringify(data));
        }
      });
    } catch {}
  });
});