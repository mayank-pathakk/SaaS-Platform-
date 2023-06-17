const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const sendToken = require("../utils/sendToken");
const {
    BadRequest,
    Unauthorized,
    NotFound,
    CustomAPIError,
  } = require("../errors");

//SignInUser helps add a new user
const signInUser = async(req,res) => {
    res.status(200).json({
        status: true,
        content: "Connected to signIn"
    })
}

//SignUpUser helps an existing user to signup
const signUpUser = async(req,res) => {
    //Takes email, name and password from the request body
    const { email, name, password } = req.body;

    //Makes a user in the database
    const user = await User.create({
      email,
      name,
      password,
    });
    
    //Generates token for the created user
    sendToken(user, StatusCodes.CREATED, res);
}

//Shows the details of existing user to that user only
const showUser = async(req,res) => {
    res.status(200).json({
        status: true,
        content: "Connected to show user"
    })
}

//exports
module.exports = {
    signInUser,
    signUpUser,
    showUser
}