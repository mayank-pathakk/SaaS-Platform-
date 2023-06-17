const createRole = async(req, res) => {
    res.json({ msg : "Create role endpoint"});
}

const showRole = async(req, res) => {
    res.json({msg : "show role endpoint"});
}

module.exports = {
    showRole,
    createRole
};