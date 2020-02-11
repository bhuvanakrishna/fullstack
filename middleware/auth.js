const jwt = require("jsonwebtoken");
const config = require("config");

//all this code only for routes we choose to protect

module.exports = function(req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");

  //check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //now we can have access to user inside route
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
