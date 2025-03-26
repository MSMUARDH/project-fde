const express = require("express");
const {
  createUser,
  changePassword,
  getInvitationPage,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getSingleUser,
  getUsetDetailsWithToken,
} = require("../controllers/userController");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-user", createUser);

router.get("/verify-email",authMiddleware, getInvitationPage);
router.put("/change-password",authMiddleware, changePassword);

router.post("/login", loginUser);

router.get("/get-all-users", getAllUsers);
router.get("/get-user-details/:userId", getSingleUser);

router.get("/get-user-details/",authMiddleware, getUsetDetailsWithToken);



router.put("/update-user/:userId", updateUser);
router.delete("/delete-user/:userId", deleteUser); // Delete user


module.exports = router;
