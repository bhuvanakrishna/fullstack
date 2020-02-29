const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

//any time if we want to protect a route, we need middleware
const auth = require("../middleware/auth");

//@route    GET /requests
//@desc     Get all requests of a user
//@access   Private
router.get("/", auth, async (req, res) => {
  //here auth parameter ensures that this route is protected

  let { name } = req.query;

  // console.log("from requests get api");
  // console.log(req.query);

  // name = name.toString();

  try {
    let requestsOfuser = await User.find({ name: name }).select(
      "receivedRequests"
    );
    // console.log(requestsOfuser);
    res.send(requestsOfuser);
  } catch (error) {}

  // await User.find({name:})
});

//@route    PUT /requests
//@desc     enter requests in database
//@access   private
router.put("/", auth, async (req, res) => {
  // console.log(req.body);

  let { from, to, reqMsg } = req.body;

  from = from.toString();
  to = to.toString();
  reqMsg = reqMsg.toString();

  const id = uuid.v4();

  try {
    let user = await User.findOneAndUpdate(
      { name: to },
      {
        $push: {
          receivedRequests: {
            id: id,
            from: from,
            reqMsg: reqMsg
          }
        }
      }
    );

    // console.log("INSIDE PUT REQUESTS");

    if (!user) {
      return res.status(400).send("Cannot update");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
  // res.send("login route");
});

//@route    DELETE /requests
//@desc     delete a particular request from the db
//@access   private
router.delete("/", auth, async (req, res) => {
  // console.log("inside requests delete route");
  // console.log(req.body);

  let { name, id } = req.body;

  name = name.toString();

  try {
    let user = await User.findOneAndUpdate(
      { name: name },
      {
        $pull: {
          receivedRequests: {
            id: id
          }
        }
      }
    );

    // console.log("INSIDE PUT REQUESTS");

    if (!user) {
      return res.status(400).send("Cannot update");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
  // res.send("login route");
});

module.exports = router;
