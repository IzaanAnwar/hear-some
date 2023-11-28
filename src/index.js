const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

// Store room information
const rooms = {};

io.on("connection", (socket) => {
  console.log("User Joined", socket.id);

  // Handle room creation and joining
  socket.on("join-room", (roomName) => {
    console.log("room =>", roomName);

    if (!rooms[roomName]) {
      rooms[roomName] = {
        id: uuidv4(),
        clients: [],
      };
    }

    socket.join(roomName);
    rooms[roomName].clients.push(socket.id);

    io.to(roomName).emit("user-connected", socket.id, rooms[roomName].clients);

    socket.on("offer", (offer, targetSocketId) => {
      console.log("offer =>", offer, targetSocketId);
      socket.to(targetSocketId).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, targetSocketId) => {
      console.log("answer =>", answer, targetSocketId);
      socket.to(targetSocketId).emit("answer", answer, socket.id);
    });

    socket.on("ice-candidate", (candidate, targetSocketId) => {
      console.log("ice-candidate =>", candidate, targetSocketId);
      socket.to(targetSocketId).emit("ice-candidate", candidate, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
      const index = rooms[roomName].clients.indexOf(socket.id);
      if (index !== -1) {
        rooms[roomName].clients.splice(index, 1);
        io.to(roomName).emit(
          "user-disconnected",
          socket.id,
          rooms[roomName].clients
        );
      }
      if (rooms[roomName].clients.length === 0) {
        delete rooms[roomName];
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
