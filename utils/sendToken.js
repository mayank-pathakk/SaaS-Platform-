const sendToken = (data, statusCode, res) => {
    const token = data.createJWT();
  
    //options for cookies
    const options = {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_LIFETIME * 24 * 60 * 60 * 1000
      ),
    };
  
    //creates a cookie
    res.status(statusCode).cookie("token", token, options).json({
      status: true,
      content: data,
      meta: {
        access_token: token
      }
    });
  };
  
  module.exports = sendToken;
  