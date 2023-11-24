const mongoose = require("mongoose");
const validator = require("validator");
const usersSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("not valid email");
      }
    },
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  gender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  // imageURL: {
  //   type: String,
  //   required: true,
  // },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },

  domain: { 
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
});



//model



const users = new mongoose.model("users", usersSchema);
module.exports = users;
