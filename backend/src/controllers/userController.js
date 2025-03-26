const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const sendInvitaion = require("../utils/mail");
const { decode } = require("punycode");

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      isEnabled,
      role,
    } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
    return res
      .status(400)
      .json({
        success: false,
        message: "This email address has already been taken",
      });
    }

    // Create a user object but don't save the password yet
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      isEnabled,
      role,
      otp: crypto.randomBytes(3).toString("hex"), // Generate OTP for invitation
      otpExpires: Date.now() + 3600000, // OTP expires in 1 hour
      invitationToken: crypto.randomBytes(32).toString("hex"),
      invitationExpires: Date.now() + 86400000, // Invitation link valid for 24 hours
    });

    const savedUser = await newUser.save();

    const jwtToken = jwt.sign(
      { id: newUser._id }, // Removed the extra period
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const invitationLink = `${process.env.BASE_FRONT_END_URL}/user/verification/${jwtToken}`;

    sendInvitaion(
      newUser.email,
      newUser.otp,
      newUser.firstName,
      invitationLink
    );

  return  res
      .status(200)
      .json({
        message: "User created and invitation sent",
        users: [savedUser],
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// !check for the invitation link validation
exports.getInvitationPage = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user by decoded ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        success: true,
        message: "User already verified",
      });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching invitation",
      error: err.message,
    });
  }
};

// !user password change
exports.changePassword = async (req, res) => {
  try {
    const { password, confirmPassword, userId } = req.body;

    console.log(
      "password, confirmPassword, userId",
      password,
      confirmPassword,
      userId
    );

    const user = await User.findById(userId);

    if (user.password) {
      return res.status(404).json({
        success: false,
        message: "You have already added a password",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "User is not verified",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    user.password = hashedPassword;
    user.invitationToken = null;
    user.invitationExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully. Redirecting to login.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error changing password", error: err.message });
  }
};

// ! User Login

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "You didn't set a password yet" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first" });
    }

    if (!user.isEnabled) {
      return res.status(400).json({
        success: false,
        message: "You are not enable to login",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        success: true,
        message: "Login successful...",
        userId: user._id,
        role: user.role,
        token: token,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

//! get all users

exports.getAllUsers = async (req, res) => {
  try {
    const { userId, userRole } = req.body;

    // if (userRole != "admin") {
    //   return res.status(404).json({
    //     success: false,
    //     message: "You are not autorized",
    //   });
    // }
    const users = await User.find({}, "-password").sort({ createdAt: -1 }); // Exclude passwords from response

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

//! get single user

exports.getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // if (userRole != "admin") {
    //   return res.status(404).json({
    //     success: false,
    //     message: "You are not autorized",
    //   });
    // }
    const user = await User.findById(userId); // Exclude passwords from response

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

//! get single user with token

exports.getUsetDetailsWithToken = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("userId getUsetDetailsWithToken", userId);

    // if (userRole != "admin") {
    //   return res.status(404).json({
    //     success: false,
    //     message: "You are not autorized",
    //   });
    // }
    const user = await User.findById(userId); // Exclude passwords from response

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

// !update user details
exports.updateUser = async (req, res) => {
  try {
    // const { userRole } = req.body;
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      isEnabled,
      role,
    } = req.body;

    // if (userRole != "admin") {
    //   return res.status(404).json({
    //     success: false,
    //     message: "You are not autorized",
    //   });
    // }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, mobileNumber, address, role, isEnabled },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
};

// !update password
exports.updatePassword = async (req, res) => {
  try {
    const { userRole } = req.body;
    const { userId } = req.params;
    const { firstName, lastName, email, mobileNumber, address, isEnabled } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, mobileNumber, address, role, isEnabled },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
};

// !delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userRole } = req.body;
    const { userId } = req.params;

    // if (userRole != "admin") {
    //   return res.status(404).json({
    //     success: false,
    //     message: "You are not autorized",
    //   });
    // }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      users: deletedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};
