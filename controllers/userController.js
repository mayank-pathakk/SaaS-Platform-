//SignInUser helps add a new user
const signInUser = async(req,res) => {
    res.status(200).json({
        status: true,
        content: "Connected to signIn"
    })
}

//SignUpUser helps an existing user to signup
const signUpUser = async(req,res) => {
    res.status(200).json({
        status: true,
        content: "Connected t signUp"
    })
}

//Shows the details of existing user to that user only
const showUser = async(req,res) => {
    res.status(200).json({
        status: true,
        content: "Connected to show user"
    })
}

//exports
module.exports = {
    signInUser,
    signUpUser,
    showUser
}