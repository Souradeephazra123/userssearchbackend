const { response, query } = require("express");
const users = require("../Models/userSchema");
const Team = require("../Models/team");

const moment = require("moment");

//register user
exports.userpost = async (req, res) => {
  // console.log(req.file);
  // console.log(req.body);

  const file = req.file.filename;
  const { fname, lname, email, mobile, gender, location, domain, status } =
    req.body;

  if (
    !fname ||
    !lname ||
    !email ||
    !mobile ||
    !gender ||
    !location ||
    !domain ||
    !status ||
    !file
  ) {
    res.status(401).json("All inputs are required");
  }

  try {
    const preuser = await users.findOne({ email: email });
    if (preuser) {
      res.status(401).json("This user already exists in our database");
    } else {
      const datecreated = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
      const userData = new users({
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        domain,
        status,
        profile: file,
        // imageURL,
        datecreated,
      });
      await userData.save();
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(401).json(error);
    console.log("catch block error");
  }
};

//user get

exports.userget = async (req, res) => {
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const status = req.query.status || "";
  const domain = req.query.domain || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 4;
  const query = {
    fname: { $regex: search, $options: "i" },
  };

  if (gender !== "All") {
    query.gender = gender;
  }

  if (status !== "All") {
    query.status = status;
  }
  if (domain !== "All") {
    query.domain = domain;
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE; //0

    const count = await users.countDocuments(query);
    // console.log(count);
    const usersdata = await users.find(query).limit(ITEM_PER_PAGE).skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      Pagination: {
        count,
        pageCount,
      },

      usersdata,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
//single user get
exports.singleuserget = async (req, res) => {
  const { id } = req.params;
  try {
    const userdata = await users.findOne({ _id: id });
    res.status(200).json(userdata);
  } catch (error) {
    res.status(401).json(error);
  }
};

//user edit

exports.useredit = async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    email,
    mobile,
    gender,
    location,
    domain,
    status,
    user_profile,
  } = req.body;
  const file = req.file ? req.file.filename : user_profile;
  const dateupdated = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");

  try {
    const updateUser = await users.findByIdAndUpdate(
      { _id: id },
      {
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        domain,
        status,
        profile: file,
        // imageURL,
        dateupdated,
      },
      {
        new: true,
      }
    );
    await updateUser.save();
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(401).json(error);
  }
};

//userdelete

exports.userdelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteuser = await users.findByIdAndDelete({ _id: id });
    res.status(200).json(deleteuser);
  } catch (error) {
    res.status(401).json(error);
  }
};

//change status

exports.userstatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const userstatusupdate = await users.findByIdAndUpdate(
      { _id: id },
      { status: data },
      { new: true }
    );

    res.status(200).json(userstatusupdate);
  } catch (error) {
    res.status(401).json(error);
  }
};


