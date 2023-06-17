//This file contains the model for the community
const mongoose = require('mongoose');
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

const communityModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Name should be less than 30 characters"],
        minlength: [3, "Name should have more than 3 characters"],
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    slug: {
        type: String,
        slug: "name",
    }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Community", communityModelSchema);