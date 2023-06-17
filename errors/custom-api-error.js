//This is the custom api error class which will made be instance of aur custom errors
class CustomAPIError extends Error {
    constructor(message) {
      super(message);
    }
}
  
module.exports = CustomAPIError;
  