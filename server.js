var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = (module.exports.io = require("socket.io")(server));
var config = require("config");
var SocketManager = require("./SocketManager");

let onlineUsersArray = [];

io.on("connection", SocketManager);

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// console.log(config.jwtSecret);

//with Authentication
// io.sockets
//   .on(
//     "connection",

//     socketioJwt.authorize({
//       secret: config.jwtSecret,
//       timeout: 15000 // 15 seconds to send the authentication message
//     })
//   )
//   .on("authenticated", socket => {
//     //this socket is authenticated, we are good to handle more events from it.

//     console.log("active sockets: " + socket.activeSockets);

//     usersIdArray.push(socket.decoded_token.user.id);

//     socket.on("disconnect", () => {
//       usersIdArray = usersIdArray.filter(user => {
//         return user != socket.decoded_token.user.id;
//       });
//       console.log("user disconnected");
//     });

//     console.log(usersIdArray);
//   });

// io.on("connection", socket => {
//   console.log("socket connected. Id: " + socket.id);

//   socket.on("user", user => {
//     if (user) {
//       console.log("user recieved: " + user.name);
//       usersObjectArray.push(user);
//     }
//   });

//   socket.emit("all connected users", usersObjectArray);
// });

//connect to db
connectDB();

//in order to use req.body we need a middleware. earlier it used to be an external module called body parser. but now its included in express.
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "welcome to server" });
  // console.log(req);
});

//define routes
app.use("/auth", require("./routes/auth"));
// app.use("/discuss", require("./routes/discuss"));
app.use("/onlineusers", require("./routes/onlineusers"));
app.use("/register", require("./routes/register"));
app.use("/requests", require("./routes/requests"));
app.use("/userinfo", require("./routes/userinfo"));
app.use("/unreadRequests", require("./routes/unreadRequests"));
app.use("/uploadprofilepic", require("./routes/uploadprofilepic"));
app.use("/updatebio", require("./routes/updatebio"));
app.use("/deleteaccount", require("./routes/deleteaccount"));

server.listen(PORT, () => {
  console.log("Server started on port: " + PORT);

  // console.log("server variable: " + server);

  // let io = require("socket.io")(server);
  // app.set("io", io);
});

// let server = app.listen(PORT);

// let io = require("socket.io")(server);

// app.use("/onlineusers", require("./routes/onlineusers")(io));
