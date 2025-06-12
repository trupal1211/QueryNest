// Routes for UserProfile
const express = require("express");

const router = express.Router();
const {
  registerUser,
  verifyPasscode,
  verifyOTP,
  resendOTP,
  getAllUser,
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile,
  loginUser,
  requestPasswordReset,
  resetPassword,

  getUserById
} = require("../Controllers/UserController");

const {authenticateUser}=require("../Controllers/AuthController")

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login",loginUser);

router.post("/reset-request", requestPasswordReset);

router.post("/verifyPasscode", verifyPasscode);
router.post("/reset-password", resetPassword);



router.get("/", getAllUser);
router.get("/me",authenticateUser, getUserById);


module.exports = router;
