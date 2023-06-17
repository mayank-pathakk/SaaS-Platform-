const express = require('express');
const router = express.Router();

const {
    createCommunity,
    getAllCommunity,
    getAllCommunityMembers,
    getJoinedCommunity,
    getOwnedCommunity
} = require('../controllers/communityController');
const {
    authMiddleware
} = require('../middleware/authentication');

router.route('/').post(authMiddleware, createCommunity);
router.route('/').get(getAllCommunity);
router.route('/:id/members').get(getAllCommunityMembers);
router.route('/me/owner').get(getOwnedCommunity);
router.route('/me/member').get(getJoinedCommunity);

module.exports = router;