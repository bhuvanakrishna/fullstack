const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//@route    POST /register
//@desc     Register a user
//@access   Public
router.post(
  "/",
  // [
  //   check("name", "Name Is Required")
  //     .not()
  //     .isEmpty(),
  //   check("email", "Enter Valid Email").isEmail(),
  //   check("password", "Password Should Be At Least 5 Characters").isLength({
  //     min: 5
  //   })
  // ],
  async (req, res) => {
    // console.log("inside register route");

    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // console.log(req.body);

    let { registerEmail, registerName, registerPassword1 } = req.body;

    // console.log(
    //   `registeremail: ${registerEmail}, registername: ${registerName}, registerpassword: ${registerPassword1}`
    // );

    registerEmail = registerEmail.toString();
    registerName = registerName.toString();
    registerPassword1 = registerPassword1.toString();
    // console.log("registeremail type: " + typeof registerEmail);

    try {
      let emailexists = await User.findOne({ email: registerEmail });

      // console.log("checked if mail existed..: " + emailexists);

      if (emailexists) {
        return res.status(400).json({ msg: "Mail Already Registered" });
      }

      let nameexists = await User.findOne({ name: registerName });

      if (nameexists) {
        return res.status(400).json({ msg: "Username Already Taken" });
      }

      // console.log("checked if name existed..");

      user = new User({
        name: registerName,
        email: registerEmail,
        password: registerPassword1
      });

      // console.log("user object created..");

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(registerPassword1, salt);

      await user.save();

      // res.send("User Saved");

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

    // res.send("Registration Successful");
  }
);

module.exports = router;
