const express = require('express');
const router = express.Router();

const {
    addMember,
    deleteMember
} = require('../controllers/memberController');

router.route('/').post(addMember);
router.route('/:id').delete(deleteMember);

module.exports = router;