const {StatusCodes} = require('http-status-codes');
const Member = require('../models/memberModel');
const {
    BadRequest
} = require('../errors');
//This function is used to add member to commuinites with proper access 
const addMember = async(req, res) => {
    const {community, user, role} = req.body;
    if(!community || !user || !role) {
        throw new BadRequest('Please name sure to enter all required fields');
    }
    const member = await Member.create({
        community,
        user,
        role
    });
    res.status(StatusCodes.CREATED).json({
        status: true,
        content: {
            data: member
        } 
  });   
}

//This function is used to delete member to commuinites with proper access 
const deleteMember = async(req,res) => {
    await Member.findOneAndDelete({_id : req.params.id});
    res.status(StatusCodes.OK).json({
        success : true
    });
}

module.exports = {
    addMember,
    deleteMember
}