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

//This function is used to create new Communities
const createCommunity = async (req, res) => {
    const {name} = req.body;
    const community = await Community.create({
        name,
        owner: req.user._id,
    });
    //creating admin at same time
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

//Function which is used to get all the communiities
const getAllCommunity = async (req,res) => {
    const communitiesPerPage = 10;
    const apifeatures = new ApiFeatures(Community.find(), req.query)
        .pagination(communitiesPerPage);
    let communities = await apifeatures.query.lean();

    //Formatting the response according to use-case
    for(let community of communities) {
        const associatedOwner = await User.findById(community.owner);
        community.owner = {
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

//This function is used to get all the members of a particular community
const getAllCommunityMembers = async (req,res) => {
    const communityID = req.params.id;
    const membersPerPage = 10;
    const apifeatures = new ApiFeatures(Member.find({community : communityID}), req.query)
        .pagination(membersPerPage);
    let members = await apifeatures.query.lean();

    //Formatting the response according to use-case
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

    const total = await Community.countDocuments({});
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

//function which shows communities where the person signed in is admin
const getOwnedCommunity = async (req, res) => {
    const communitiesPerPage = 10;
    const apifeatures = new ApiFeatures(Community.find({owner: req.user._id}), req.query)
        .pagination(communitiesPerPage);
    const ownedCommunities = await apifeatures.query;

    res.status(StatusCodes.OK).json({
        status: true,
        content: {
            meta : {
                total: ownedCommunities.length,
                pages: Math.ceil(Number(ownedCommunities.length / communitiesPerPage)),
                page: Number(req.query.page) || 1,
            },
            data: ownedCommunities
        } 
  });
}


//function which shows communities where the person signed in is joined
const getJoinedCommunity = async (req,res) => {
    const communitiesPerPage = 10; 
    const apifeatures = new ApiFeatures(Member.find({user : req.user._id}), req.query)
        .pagination(communitiesPerPage);
    let joinedCommunity = await apifeatures.query.lean();

    //Formatting the response according to use-case
    
    const responseData = [];
    for(let community of joinedCommunity) {
        let tempComm = (await Community.find({_id : community.community}).lean())[0];
        const associatedOwner = await User.findById(tempComm.owner);
        tempComm.owner = {
            name: associatedOwner.name,
            _id: associatedOwner._id,
        };
        responseData.push(tempComm);
    } 
    res.status(StatusCodes.OK).json({
        status: true,
        content: {
            meta : {
                total: joinedCommunity.length,
                pages: Math.ceil(Number(joinedCommunity.length / communitiesPerPage)),
                page: Number(req.query.page) || 1,
            },
            data: responseData
        } 
  });   
}

module.exports = {
    createCommunity,
    getAllCommunity,
    getAllCommunityMembers,
    getJoinedCommunity,
    getOwnedCommunity
}