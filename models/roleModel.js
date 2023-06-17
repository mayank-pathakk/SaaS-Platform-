//This file contains the model for the role
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Role', RoleSchema);