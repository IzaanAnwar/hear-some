const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("createRoom", (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  socket.on("offer", (data) => {
    io.to(data.room).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    io.to(data.room).emit("answer", data.answer);
  });

  socket.on("iceCandidate", (data) => {
    io.to(data.room).emit("iceCandidate", data.candidate);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
