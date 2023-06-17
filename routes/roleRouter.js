const express = require('express');
const router = express.Router();

const {
    showRole,
    createRole
} = require('../controllers/roleController');

router.route('/').get(showRole).post(createRole);

module.exports = router;