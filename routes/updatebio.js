const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const auth = require("../middleware/auth");

router.put("/", auth, async (req, res) => {
  let { name, bio } = req.body;

  // console.log(req.body);

  name = name.toString();
  bio = bio.toString();

  try {
    let user = await User.findOneAndUpdate(
      { name: name },
      {
        bio: bio
      }
    );

    // console.log("INSIDE PUT REQUESTS");

    if (!user) {
      return res.status(400).send("Cannot update");
    }

    res.json("Success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
  // res.send("login route");
});

module.exports = router;
