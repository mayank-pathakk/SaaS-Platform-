//module imports
const express = require('express');
const router = express.Router();

//controller imports
const {
    signInUser,
    signUpUser,
    showUser,
} = require('../controllers/userController');
const {
    authMiddleware,
} = require("../middleware/authentication");

//routing the paths to controllers
router.route('/signin').post(signInUser);
router.route('/signup').post(signUpUser);
router.route('/me').get(authMiddleware, showUser);

//exports
module.exports = router;