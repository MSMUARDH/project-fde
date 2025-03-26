

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid mobile number with country code",
    ],
  },
  address: {
    type: String,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date,
  invitationToken: String,
  invitationExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);




// !old one
// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   isVerified: { type: Boolean, default: false },
//   otp: String,
//   otpExpires: Date,
// });

// module.exports = mongoose.model("User", UserSchema);
