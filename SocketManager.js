const io = require("./server").io;
let onlineUsers = [];
module.exports = function(socket) {
  console.log("Socket id: " + socket.id);

  socket.on("userconnected", function(user) {
    let userObject = { ...user, socketid: socket.id };
    onlineUsers.push(userObject);
    console.log(onlineUsers);

    io.sockets.emit("listofonline", onlineUsers);

    socket.on("join", function(data) {
      socket.join(data.name); // We are using room of socket io
    });

    socket.on("requestTo", function(data) {
      io.sockets
        .in(data.room)
        .emit("requestFrom", { from: data.from, msg: data.msg });
    });

    socket.on("reqIsAvailableForDiscussion", data => {
      io.sockets
        .in(data.to)
        .emit("isAvailableForDiscussion", { from: data.from, to: data.to });
    });

    socket.on("resAvailability", data => {
      io.sockets.in(data.to).emit("availabilityStatus", {
        status: data.isAvailalble,
        from: data.from,
        to: data.to
      });
    });

    socket.on("reqChangeToDiscussionPage", data => {
      io.sockets
        .in(data.to)
        .emit("changeToDiscussionPage", { otherUser: data.from });
    });

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
