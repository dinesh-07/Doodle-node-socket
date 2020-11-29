const express = require("express");
const app = express();
const socket = require("socket.io");

const PORT = 7001;

app.use("/", express.static(__dirname + "/public"));

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Socket setup
const io = socket(server);

io.on("connection", (socket) => {
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });
});
