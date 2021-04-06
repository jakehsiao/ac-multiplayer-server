const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
  },
});

const PORT = 3050;

io.on("connection", (socket) => {
  // On connect, this socket join that room
  // EH: one room can only have two guys
  // EH: add database stuffs
  const { room_id } = socket.handshake.query;
  console.log(`Socket ${socket.id} joined ${room_id}`);
  socket.join(room_id);

  // On new diff, because it is socket.to, so only send to another guy
  socket.on("diff", (data) => {
    socket.to(room_id).emit("diff", data);
    console.log(`Send diff from ${socket.id} at ${room_id} which is ${data}`);
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