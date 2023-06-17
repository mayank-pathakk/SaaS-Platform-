//This file contains the model for the community
const mongoose = require('mongoose');
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

const communityModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter community name"],
        maxlength: [30, "Name should be less than 30 characters"],
        minlength: [2, "Name should have more than 2 characters"],
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

communityModelSchema.pre("save", async function (next) {
    this.slug = this.name.split(" ").join("-");
    next();
});

module.exports = mongoose.model("Community", communityModelSchema);