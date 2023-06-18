const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const sendToken = require("../utils/sendToken");
const {
    BadRequest,
    Unauthorized,
    NotFound,
    CustomAPIError,
  } = require("../errors");

//SignInUser helps an existing user to signin
const signInUser = async(req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest(`Please enter the email and password`);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized(`Invalid email or password`);
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      throw new Unauthorized(`Invalid email or passwords`);
    }
    
    sendToken(user, StatusCodes.OK, res);
}

//SignUpUser helps add a new user
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
    const user = await User.findById(req.user._id);
    res.status(StatusCodes.OK).json({
      status: true,
      content: {
        data: user
      } 
    });
}

//exports
module.exports = {
    signInUser,
    signUpUser,
    showUser
}