const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("offer", (offer) => {
    console.log("Received offer");
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("Received answer");
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    console.log("Received ICE candidate");
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("message", (message) => {
    console.log("message:", message);
    io.emit("message", message); // Broadcast the message to all clients
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
