const { Unauthorized } = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    throw new Unauthorized(
      `No token to access this route , please sign in to access`
    );
  }
  const decodedData = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodedData.id);
  next();
};


module.exports = {
  authMiddleware,
};
