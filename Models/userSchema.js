const mongoose = require("mongoose");
const validator = require("validator");
const usersSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
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
    // mobile: {
    //   type: Number,
    //   required: false,
    //   // unique: false,
    //   minlength: 0,
    //   maxlength: 10,
    // },
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

    // team: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Team",
    // },

    domain: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
  }
  // {
  //   _id: false,
  //   id: false,
  //   timestamps: false,
  //   toJSON: {
  //     virtuals: true,
  //     transform: (obj, ret) => {
  //       delete ret._id;
  //       return ret;
  //     },
  //   },
  // }
);

//model

const users = new mongoose.model("users", usersSchema);
module.exports = users;
