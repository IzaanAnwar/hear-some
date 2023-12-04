const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: true });

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("join-room", (data) => {
    const { email, roomId } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user-joined", { email: email, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("join-room", data);
    console.log(`[${email}] joined room: ${roomId}`);
  });

  socket.on("call-user", (data) => {
    const { to, offer } = data;
    io.to(to).emit("incoming-call", { from: socket.id, offer });
  });
  socket.on("call-accepted", (data) => {
    const { to, ans } = data;
    io.to(to).emit("call-accepted", { from: socket.id, ans });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
