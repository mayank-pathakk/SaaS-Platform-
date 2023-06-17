//module imports
const express = require('express');
const router = express.Router();

//controller imports
const {
    signInUser,
    signUpUser,
    showUser,
} = require('../controllers/userController');

//routing the paths to controllers
router.route('/signin').post(signInUser);
router.route('/signup').post(signUpUser);
router.route('/me').get(showUser);

//exports
module.exports = router;