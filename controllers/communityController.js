const createCommunity = async (req, res) => {
    res.json({msg: "create community endpoint"});
}

const getAllCommunity = async (req,res) => {
    res.json({msg : "Get all community"});
}

const getAllCommunityMembers = async (req,res) => {
    res.json({msg : "Show all member of one comm"});
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