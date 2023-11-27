const { response, query } = require("express");
const users = require("../Models/userSchema");
const Team = require("../Models/team");

const moment = require("moment");

//register user
exports.userpost = async (req, res) => {
  // console.log(req.file);
  // console.log(req.body);

  const file = req.file.filename;
  // const file = req.file ? req.file.filename : req.body.imageURL;
  const {
    first_name,
    last_name,
    email,
    // mobile,
    gender,
    location,
    domain,
    status,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    // !mobile ||
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
        first_name,
        last_name,
        email,
        // mobile,
        gender,
        location,
        domain,
        status,
        profile: file,

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
  const ITEM_PER_PAGE = 50;
  const query = {
    first_name: { $regex: search, $options: "i" },
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
    first_name,
    last_name,
    email,
    // mobile,
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
        first_name,
        last_name,
        email,
        // mobile,
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

// Register user from backend using raw data
// exports.registerUserFromRawData = async (req, res) => {
//   // const profile=req.body.imageURL;
//   try {
//     const {
//       first_name,
//       last_name,
//       email,
//       mobile,
//       gender,
//       location,
//       domain,
//       status,
//       imageURL,
//     } = req.body;

//     const preuser = await users.findOne({ email: email });

//     if (preuser) {
//       return res
//         .status(400)
//         .json({ message: "This user already exists in our database" });
//     }

//     const datecreated = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
//     const userData = new users([{
//       first_name,
//       last_name,
//       email,
//       mobile,
//       gender,
//       location,
//       domain,
//       status,
//       profile: imageURL,
//       datecreated,
//     }]);

//     await userData.save();

//     res.status(200).json(userData);
//   } catch (error) {
//     console.log(error);
//     if (error.name === "ValidationError") {
//       // Handle validation error, e.g., return a 400 Bad Request response
//       const errorMessage = Object.values(error.errors)
//         .map((err) => err.message)
//         .join(", ");
//       return res.status(400).json({ message: errorMessage });
//     }
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

//function to to accept user information as array

exports.registerUserFromRawData = async (req, res) => {
  try {
    const usersData = req.body;

    if (!Array.isArray(usersData)) {
      return res
        .status(400)
        .json({ message: "Input should be an array of users" });
    }

    const createdUsers = [];

    for (const userData of usersData) {
      const {
        first_name,
        last_name,
        email,
        gender,
        // mobile,
        domain,
        status,
        imageURL,
      } = userData;

      const preuser = await users.findOne({ email: email });

      if (preuser) {
        continue; // Skip if user already exists
      }
      // Skip mobile check
      // if (mobile !== undefined) {
      //   continue;
      //   // Check for other validations or simply omit this condition
      //   // const userWithMobile = await users.findOne({ mobile });
      //   // if (userWithMobile) {
      //   //   continue; // Skip if a user with the same mobile number already exists
      //   // }rs

      // }

      const datecreated = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
      const newUser = new users({
        first_name,
        last_name,
        email,
        gender,
        // mobile,
        domain,
        status,
        profile: imageURL || "", // Use imageURL or fallback to empty string
        datecreated,
      });

      await newUser.save();
      createdUsers.push(newUser);
    }

    res.status(200).json({ message: "Users processed", createdUsers });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ message: errorMessage });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
