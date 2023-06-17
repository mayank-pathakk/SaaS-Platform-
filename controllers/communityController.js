const Community = require("../models/communityModel");
const User = require("../models/userModel");
const Member = require('../models/memberModel');
const Role = require('../models/roleModel');
const {StatusCodes} = require('http-status-codes');
const {
    BadRequest,
    Unauthorized,
    NotFound,
    CustomAPIError,
  } = require("../errors");
  const ApiFeatures = require("../utils/api-features");

const createCommunity = async (req, res) => {
    const {name} = req.body;
    const community = await Community.create({
        name,
        owner: req.user._id,
    });
    await Member.create({
        community: community._id,
        user: req.user,
        role: await Role.create({name : 'Community Admin'})
    })
    res.status(StatusCodes.CREATED).json({
        status: true,
        content: {
          data: community
        } 
    });
}

const getAllCommunity = async (req,res) => {
    const communitiesPerPage = 10;
    const apifeatures = new ApiFeatures(Community.find(), req.query)
        .pagination(communitiesPerPage);
    let communities = await apifeatures.query.lean();

    for(let commuity of communities) {
        const associatedOwner = await User.findById(commuity.owner);
        commuity.owner = {
            name: associatedOwner.name,
            _id: associatedOwner._id,
        };
    }

    const total = await Community.countDocuments({});
    res.status(StatusCodes.OK).json({
        status: true,
        content: {
            meta : {
                total: total,
                pages: Math.ceil(Number(total / communitiesPerPage)),
                page: Number(req.query.page) || 1,
            },
            data: communities
        } 
  });
}

const getAllCommunityMembers = async (req,res) => {
    const communityID = req.params.id;
    const membersPerPage = 10;
    const apifeatures = new ApiFeatures(Member.find({community : communityID}), req.query)
        .pagination(membersPerPage);
    let members = await apifeatures.query.lean();

    const total = await Community.countDocuments({});

    for(let member of members) {
        const associatedUser = await User.findById(member.user);
        const associatedRole = await Role.findById(member.role);
        member.user = {
            name: associatedUser.name,
            _id: associatedUser._id,
        };
        member.role = {
            name: associatedRole.name,
            _id: associatedRole._id,
        };
    }

    res.status(StatusCodes.OK).json({
        status: true,
        content: {
            meta : {
                total: total,
                pages: Math.ceil(Number(total / membersPerPage)),
                page: Number(req.query.page) || 1,
            },
            data: members
        } 
  });
}

const getOwnedCommunity = async (req, res) => {
    res.json({ msg : "Get owned commun"});
}

const getJoinedCommunity = async (req,res) => {
    res.json({msg : "Get all joined comms"});
}

module.exports = {
    createCommunity,
    getAllCommunity,
    getAllCommunityMembers,
    getJoinedCommunity,
    getOwnedCommunity
}