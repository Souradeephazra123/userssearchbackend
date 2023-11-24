const Team = require("../Models/team");
const users = require("../Models/userSchema");

exports.createTeam = async (req, res) => {
  const { members } = req.body;

  try {
    // Check if all selected users exist
    const existingUsers = await users.find({ _id: { $in: members } });

    if (existingUsers.length !== members.length) {
      return res
        .status(401)
        .json({ error: "One or more selected users do not exist." });
    }

    // Create an array to store member details
    const membersDetails = existingUsers.map((user) => ({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      status: user.status,
      profile: user.profile,
      domain: user.domain,
      location: user.location,
      // Add more fields as needed
    }));

    // Create a new team with member details
    const team = new Team({ members: membersDetails });
    await team.save();

    res.status(200).json({ message: "Team created successfully", team });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


exports.viewTeam = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Example in teamcontroller.js
exports.viewTeamById = async (req, res) => {
  try {
    console.log("Received request for team details. Team ID:", req.params.id);

    const team = await Team.findById(req.params.id).populate({
      path: 'members',
      select: 'fname lname', // Specify the fields you want to select
    });

    if (!team) {
      console.log("Team not found");
      return res.status(404).json({ error: "Team not found" });
    }

    console.log("Team details:", team);
    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(401).json({ error: error.message });
  }
};


// exports.viewTeamById = async (req, res) => {
//   try {
//     const team = await Team.findById(req.params.id).populate({
//       path: "members",
//       select: "fname lname", // Specify the fields you want to select
//     });
//     if (!team) {
//       return res.status(404).json({ error: "Team not found" });
//     }
//     res.status(200).json(team);
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// };

//create team

// Example user controller method to add a user to a team
// exports.createteam = async (req, res) => {
//   const { userId, teamId } = req.body;

//   try {
//     const user = await users.findById(userId);
//     const team = await Team.findById(teamId);

//     if (!user || !team) {
//       return res.status(404).json({ message: "User or Team not found" });
//     }

//     // Check if the user's domain is unique in the team
//     const isDomainUnique = team.members.every(
//       (member) => member.domain !== user.domain
//     );

//     if (!isDomainUnique) {
//       return res
//         .status(400)
//         .json({ message: "User domain must be unique in the team" });
//     }

//     // Check if the user's availability is unique in the team
//     const isAvailabilityUnique = team.members.every(
//       (member) => member.availability !== user.availability
//     );

//     if (!isAvailabilityUnique) {
//       return res
//         .status(400)
//         .json({ message: "User availability must be unique in the team" });
//     }

//     // Add the user to the team
//     team.members.push(user);
//     await team.save();

//     // Update the user's team field
//     user.team = team;
//     await user.save();

//     res.status(200).json({ message: "User added to the team successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
