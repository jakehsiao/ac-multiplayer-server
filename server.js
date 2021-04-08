// const express = require('express');
// const cors = require('cors');
// const app = express();
// app.use(cors());
// const server = require("http").createServer(app);
const fs = require('fs');
const server = require("https").createServer({
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
});
const io = require("socket.io")(server, {
  cors: {
    // origin: "*",
    // origin: "http://localhost:3000|https://dadiaogames.gitee.io",
    // origin: "http://localhost:3000",
    origin: "https://dadiaogames.gitee.io",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true, // Why have this?
  },
  allowEIO3: true,  // Have this is important
});
// const io = require("socket.io")(server);

const PORT = 3050;

io.on("connection", (socket) => {
  // On connect, this socket join that room
  // EH: one room can only have two guys
  // EH: add database stuffs
  const { room_id } = socket.handshake.query;
  let date = new Date();
  console.log(`Socket ${socket.id} joined ${room_id} ${date.getMonth()}.${date.getDay()} ${date.getHours()}:${date.getMinutes()}`);
  socket.join(room_id);

  // On new diff, because it is socket.to, so only send to another guy
  socket.on("diff", (data) => {
    socket.to(room_id).emit("diff", data);
    console.log(`Send diff from ${socket.id} at ${room_id} which is ${data}`);
  })

  // On turn ends
  socket.on("turn end", (data) => {
    socket.to(room_id).emit("turn end", data);
    console.log(`Send turn end from ${socket.id} at ${room_id}`);
  })

  // Leave the room if disconnected
  socket.on("disconnect", () => {
    socket.leave(room_id);
    console.log(`Disconnect from ${socket.id}`);
  })
});

server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
})