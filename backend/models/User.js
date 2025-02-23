const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  profilePicture: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: ""
  },
  sentMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: []
    },
  ],
  receivedMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: []
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
