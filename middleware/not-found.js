//This middleware is responsive when the url is not found in api routes
const { StatusCodes } = require("http-status-codes");

const NotFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send(`Route does not exist`);
};

module.exports = NotFound;
