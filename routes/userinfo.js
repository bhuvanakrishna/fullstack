const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//any time if we want to protect a route, we need middleware
const auth = require("../middleware/auth");

//@route    GET /userinfo
//@desc     Get user info except password
//@access   Private
router.get("/", auth, async (req, res) => {
  //here auth parameter ensures that this route is protected

  let { name } = req.query;

  // console.log("from requests get api");
  // console.log(req.query);

  // name = name.toString();

  try {
    let user = await User.find({ name: name }).select("-password");
    // console.log(requestsOfuser);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
