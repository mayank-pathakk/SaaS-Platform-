
//This function is used to add member to commuinites with proper access 
const addMember = async(req, res) => {
    res.json({msg : "Add member setup"});
}

//This function is used to delete member to commuinites with proper access 
const deleteMember = async(req,res) => {
    res.json({msg : "Delete member endpoint"});
}

module.exports = {
    addMember,
    deleteMember
}