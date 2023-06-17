const { StatusCodes } = require('http-status-codes');
const Role = require('../models/roleModel');

//Function to create new Role
const createRole = async(req, res) => {
    const {name} = req.body;
    const role = await Role.create({
        name,
    });
    res.status(StatusCodes.CREATED).json({
        status: true,
        content: {
          data: role
        } 
      });
}


//Function to show all Roles
const showRole = async(req, res) => {
    const roles = await Role.find({});
    res.status(StatusCodes.OK).json({
        status: true,
        content: {
          data: roles
        } 
      });
}

module.exports = {
    showRole,
    createRole
};