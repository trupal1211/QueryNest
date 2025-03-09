// Routes for UserDetails
const express = require("express");
const router = express.Router();
const {
  getAllUserDetails,
  getUserDetailById,
  createUserDetail,
  updateUserDetail,
  deleteUserDetail,
} = require("../Controllers/UserProfileController");

router.get("/", getAllUserDetails);
router.get("/:id", getUserDetailById);
router.post("/create", createUserDetail);
router.put("/:id", updateUserDetail);
router.delete("/:id", deleteUserDetail);

module.exports = router;
