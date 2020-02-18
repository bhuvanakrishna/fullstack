const io = require("./server").io;
let onlineUsers = [];
module.exports = function(socket) {
  console.log("Socket id: " + socket.id);

  socket.on("userconnected", function(user) {
    let userObject = { ...user, socketid: socket.id };
    onlineUsers.push(userObject);
    console.log(onlineUsers);

    io.sockets.emit("listofonline", onlineUsers);

    socket.on("disconnect", function() {
      console.log("Disconnected socket: " + socket.id);
      onlineUsers = onlineUsers.filter(user => {
        return user.socketid !== socket.id;
      });
      console.log(onlineUsers);

      io.sockets.emit("listofonline", onlineUsers);
    });
  });
};
