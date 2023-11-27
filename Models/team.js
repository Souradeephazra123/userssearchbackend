const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: String,
  members: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      first_name: String,
      last_name: String,
      email: String,
      // mobile: Number,
      status: String,
      gender: String,
      domain: String,
      location: String,
      Profile: String,
      // Add more fields as needed
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
