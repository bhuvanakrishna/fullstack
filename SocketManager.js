const io = require("./server").io;
let onlineUsers = [];
module.exports = function(socket) {
  // console.log("Socket id: " + socket.id);

  socket.on("userconnected", function(user) {
    let userObject = { ...user, socketid: socket.id };
    onlineUsers.push(userObject);
    // console.log(onlineUsers);

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
      // console.log("from res availability");
      // console.log(data);

      io.sockets.in(data.to).emit("availabilityStatus", {
        status: data.isAvailable,
        from: data.from,
        to: data.to
      });
    });

    socket.on("reqChangeToDiscussionPage", data => {
      io.sockets
        .in(data.to)
        .emit("changeToDiscussionPage", { otherUser: data.from });
    });

    socket.on("drawing", data => {
      io.sockets.in(data.to).emit("receiveDrawing", {
        xCoord: data.xCoord,
        yCoord: data.yCoord,
        dragArray: data.dragArray,
        strokeColor: data.strokeColor,
        strokeThick: data.strokeThick
        // clear: data.clear
      });
    });

    socket.on("clearBoard", data => {
      io.sockets.in(data.to).emit("clearBoardFromServer");
    });

    //related to video chat
    //************************************* */

    socket.on("video-offer", data => {
      // console.log("inside offer");
      // console.log(data);
      io.sockets.in(data.to).emit("gotOffer", {
        from: data.from,
        offer: data.offer,
        sdp: data.sdp
      });
    });

    socket.on("video-answer", data => {
      // console.log("inside answer");
      io.sockets.in(data.to).emit("gotAnswer", {
        sdp: data.sdp,
        from: data.from,
        to: data.to
      });
    });

    socket.on("candidate", data => {
      // console.log("candidate is");
      // console.log(data.candidate);
      io.sockets.in(data.to).emit("gotCandidate", {
        pc: data.pc,
        candidate: data.candidate,
        to: data.to,
        from: data.from
      });
    });

    //***************************************** */

    socket.on("disconnect", function() {
      // console.log("Disconnected socket: " + socket.id);
      onlineUsers = onlineUsers.filter(user => {
        return user.socketid !== socket.id;
      });
      // console.log(onlineUsers);

      io.sockets.emit("listofonline", onlineUsers);
    });
  });
};
