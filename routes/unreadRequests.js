const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//any time if we want to protect a route, we need middleware
const auth = require("../middleware/auth");

//@route    GET /unreadRequests
//@desc     Get unread requests of a user
//@access   Private
router.get("/", auth, async (req, res) => {
  //here auth parameter ensures that this route is protected

  let { name } = req.query;

  // console.log(req.query);

  //   console.log("req query is");
  //   console.log(req.query);

  //   console.log("req body is");
  //   console.log(req.body);
  // console.log("from requests get api");
  // console.log(req.query);

  if (name) {
    name = name.toString();

    try {
      let requestsOfuser = await User.find({ name: name }).select(
        "unreadRequests"
      );
      // console.log("inside get unread requests");
      // console.log(requestsOfuser);
      res.send(requestsOfuser);
    } catch (error) {}
  }

  // await User.find({name:})
});

//@route    PUT /unreadRequests
//@desc     enter unread requests in database
//@access   private
router.put(
  "/",
  auth,

  async (req, res) => {
    let { name, number } = req.body;

    // console.log(req.body);

    try {
      let user = await User.findOneAndUpdate(
        { name: name },
        {
          unreadRequests: number
        }
      );

      // console.log("inside put unread requests");

      if (!user) {
        return res.status(400).send("Cannot update");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
