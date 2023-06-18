//This file contains the model for the user
const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "Name should be less than 30 characters"],
    minlength: [2, "Name should have more than 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password should be greater than 6 characters"],
  },
  role:{
    type: mongoose.Schema.ObjectId,
    ref: "Role",
    select: false
  }
}, {
  timestamps: true,
});

//hash password before storing them
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Generate JWT token for the user
UserSchema.methods.createJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

UserSchema.methods.isPasswordCorrect = async function (inputPassword) {
  const isPasswordMatch = await bcrypt.compare(inputPassword, this.password);
  return isPasswordMatch;
};


module.exports = mongoose.model("User", UserSchema);
