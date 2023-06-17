//Error file for generating not authorized error message and status code
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api-error");

class Unauthorized extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
