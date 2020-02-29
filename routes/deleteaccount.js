const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const auth = require("../middleware/auth");

router.delete("/", auth, async (req, res) => {
  let { name } = req.body;

  name = name.toString();

  try {
    let user = await User.deleteOne({ name: name });

    // console.log("inside delete user request. found user", user);

    // console.log("INSIDE PUT REQUESTS");

    if (!user) {
      return res.status(400).send("Cannot update");
    }

    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
  // res.send("login route");
});

module.exports = router;
