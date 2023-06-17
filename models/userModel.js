//This file contains the model for the user
const mongoose = require('mongoose');
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Name should be less than 30 characters"],
        minlength: [4, "Name should have more than 4 characters"],
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
        minlength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
