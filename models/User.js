const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: "My Bio"
  },
  receivedRequests: {
    type: Array
  },
  avatar: {
    type: Buffer
  }
});

module.exports = mongoose.model("user", UserSchema);
