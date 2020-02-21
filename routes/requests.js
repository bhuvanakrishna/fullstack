const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

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
router.put(
  "/",
  auth,

  async (req, res) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    let { from, to, reqMsg } = req.body;

    from = from.toString();
    to = to.toString();
    reqMsg = reqMsg.toString();

    try {
      let user = await User.findOneAndUpdate(
        { name: to },
        {
          $push: {
            receivedRequests: {
              from: from,
              reqMsg: reqMsg
            }
          }
        }
      );

      if (!user) {
        return res.status(400).send("Cannot update");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
    // res.send("login route");
  }
);

module.exports = router;
