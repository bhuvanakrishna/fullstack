const express = require("express");

//socket io needs raw http server. actually we dont need this with express. Express though does all this behind automatically. we are doing explicitly.
const http = require("http");
const socketio = require("socket.io");

const app = express();

//creating http server for socketio
const server = http.createServer(app);
const io = socketio(server);

//attaching io object to app so that we can access the io object in routes
//link -- https://stackoverflow.com/questions/37559610/socket-io-emit-on-express-route
app.io = io;

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

//connect to db
connectDB();

//in order to use req.body we need a middleware. earlier it used to be an external module called body parser. but now its included in express.
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "welcome to server" });
});

//define routes
app.use("/auth", require("./routes/auth"));
// app.use("/discuss", require("./routes/discuss"));
app.use("/onlineusers", require("./routes/onlineusers"));
app.use("/register", require("./routes/register"));

app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);

  // console.log("server variable: " + server);

  // let io = require("socket.io")(server);
  // app.set("io", io);
});

// let server = app.listen(PORT);

// let io = require("socket.io")(server);

// app.use("/onlineusers", require("./routes/onlineusers")(io));
