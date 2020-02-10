const express = require("express");
const router = express.Router();

//@route    GET /onlineusers
//@desc     Get logged in user
//@access   Private
router.get("/", (req, res) => {
  // res.send("online users route");
  console.log("online users route accessed");

  //we can access the io object here as follows:
  //req.app.io.emit('tx', {key:"value"});
});

module.exports = router;
