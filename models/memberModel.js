//This file contains the model for the member

const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    community: {
        type: mongoose.Schema.ObjectId,
        ref: "Community",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: mongoose.Schema.ObjectId,
        ref: "Role",
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Member", MemberSchema);