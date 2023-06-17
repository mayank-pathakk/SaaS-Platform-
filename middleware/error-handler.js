//This middleware process the errors encountered during the execution of API call
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  //Initialising the deafult values of status code and message
  (err.message = err.message || `Internal Server Error ...`),
    (err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);

    //Handling mongoose errors
  if (err.name && err.name === "CastError") {
    (err.message = `Invalid syntax for ${err.path}`),
      (err.statusCode = StatusCodes.BAD_REQUEST);
  }

  //Handling mongoose error
  if (err.name === "MongoError" && err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err.statusCode = StatusCodes.BAD_REQUEST;
  }

  //Responding the call with error
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandlerMiddleware;
