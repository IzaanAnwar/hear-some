import express from "express";
import { createServer } from "http";
import socketIO from "socket.io";

const app = express();
const server = createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (message) => {
    console.log("message:", message);
    io.emit("message", message); // Broadcast the message to all clients
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
