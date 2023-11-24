const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/userControllers");
const upload = require("../multerConfig/storageConfig");
const teamController = require("../Controllers/teamControllers");

//routes
router.post(
  "/user/register",
  upload.single("user_profile"),
  controllers.userpost
);

router.get("/user/details", controllers.userget);

router.get("/user/:id", controllers.singleuserget);

router.put(
  "/user/edit/:id",
  upload.single("user_profile"),
  controllers.useredit
);

router.delete("/user/delete/:id", controllers.userdelete);

router.put("/user/status/:id", controllers.userstatus);

// Create a new team
router.post("/team", teamController.createTeam);

// View all teams
router.get("/team/:id", teamController.viewTeamById);
router.get("/team", teamController.viewTeam);

module.exports = router;
