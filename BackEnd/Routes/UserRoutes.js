// Routes for UserProfile
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const {
  registerUser,
   verifyOTP,
   getAllUser,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  loginUser,
  requestPasswordReset,
  resetPassword
} = require("../Controllers/UserController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/resetrequest", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.get("/", getAllUser);
router.get("/:id", getUserProfileById);
router.post("/create", createUserProfile);
router.put("/:id", updateUserProfile);
router.delete("/:id", deleteUserProfile);

module.exports = router;
