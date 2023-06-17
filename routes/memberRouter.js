const express = require('express');
const router = express.Router();

const {
    addMember,
    deleteMember
} = require('../controllers/memberController');
const { 
    authMiddleware, 
    authorizeRole 
} = require('../middleware/authentication');

router.route('/').post(authMiddleware,authorizeRole(["Community Admin"]),addMember);
router.route('/:id').delete(authMiddleware,authorizeRole(["Community Admin", "Community Moderator"]),deleteMember);

module.exports = router;