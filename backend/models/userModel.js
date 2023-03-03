const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please Enter your Email"],
    validate: [validator.isEmail, "PLease enter a valid form of email"],
    unique: true,
  },

  password: {
    type: String,
    trim: true,
    required: [true, "Please Enter your password"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  userRole: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  return (this.password = await bcrypt.hash(this.password, 10));
});

//compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//jwt generating
userSchema.methods.generatingJWT = async function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//forgot password fields
userSchema.methods.resetPasswordTokenGenerating = async function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return token;
};

module.exports = new mongoose.model("User", userSchema);
