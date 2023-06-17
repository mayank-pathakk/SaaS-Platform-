const _ = require('lodash');
const sendToken = (user, statusCode, res) => {
    const access_token = user.createJWT();
  
    //options for cookies
    const options = {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_LIFETIME * 24 * 60 * 60 * 1000
      ),
    };
    const data = _.omit(user.toObject(), 'password');
  
    //creates a cookie
    res.status(statusCode).cookie("access_token", access_token, options).json({
      status: true,
      content: {
        data: data,
        meta: {
          access_token: access_token
        }
      }
    });
  };
  
  module.exports = sendToken;
  