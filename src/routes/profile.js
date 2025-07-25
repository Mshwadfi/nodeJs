const express = require("express");
const User = require("../models/user");
const { authMiddleWare } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

const profileRouter = express.Router();

const allowedFields = ["firstName", "lastName", "age", "gender"];
//get loggedin user profile api
profileRouter.get("/profile", authMiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        error: "User not found",
      });
    }

    res.send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, error: "internal server error" });
  }
});

// get other users Profile

profileRouter.get("/profile/:id", authMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        error: "Invalid user ID",
      });
    }
    const user = await User.findById(id).select(allowedFields);
    if (!user) {
      return res.status(404).send({
        success: false,
        error: "User not found",
      });
    }
    res.send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "internal server error" });
  }
});

// update profile
profileRouter.patch("/profile", authMiddleWare, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const updatedDate = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      updatedDate,
      { new: true, runValidators: true }
    ).select(allowedFields);
    res.send({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "internal server error" });
  }
});

module.exports = profileRouter;
