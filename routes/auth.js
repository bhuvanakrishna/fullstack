const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//any time if we want to protect a route, we need middleware
const auth = require("../middleware/auth");

//@route    GET /auth
//@desc     Get logged in user
//@access   Private
router.get("/", auth, async (req, res) => {
  //here auth parameter ensures that this route is protected

  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
  // res.send("get token route");
});

//@route    POST /auth
//@desc     Authenticate User/ Login
//@access   Public
router.post(
  "/",
  [
    check("email", "Enter A Valid Email").isEmail(),
    check("password", "Enter A Password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    email = email.toString();
    password = password.toString();

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send("Invalid Credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
    // res.send("login route");
  }
);

module.exports = router;
