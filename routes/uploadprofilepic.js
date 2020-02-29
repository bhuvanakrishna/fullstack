const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const multer = require("multer");

//any time if we want to protect a route, we need middleware
const auth = require("../middleware/auth");

const upload = multer({
  //   dest: "profilepics",
  limits: {
    fileSize: 500000
    //1000000 is 1mb
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.endsWith(".jpg") &&
      !file.originalname.endsWith(".jpeg") &&
      !file.originalname.endsWith(".png")
    ) {
      console.log(file.originalname);

      // req.fileValidationError = "Forbidden extension";

      // return cb(null, false, req.fileValidationError);
      return cb(new Error("Only .jpg and .png files are supported"), false);
    }

    console.log(file.originalname);

    cb(undefined, true);
  }
});

//@route    POST /uploadprofilepic
//@desc     upload profile pic
//@access   Private
router.post(
  "/",
  auth,
  upload.single("upload"),
  async (req, res) => {
    // console.log(req.body);

    // console.log(req.file);

    let name = req.body.user;
    name = name.toString();
    let avatar = req.file.buffer;

    try {
      let user = await User.findOneAndUpdate(
        { name: name },
        {
          avatar: avatar
        }
      );

      // console.log("INSIDE PUT REQUESTS");

      if (!user) {
        return res.status(400).send("Cannot update");
      }

      return res.json("Updated Successfully!");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }

    //here auth parameter ensures that this route is protected
    // var user = new User(req.body);

    // req.user.avatar = req.file.buffer;
    // await req.user.save();

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/:name/avatar", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
