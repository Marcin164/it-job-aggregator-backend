const User = require("../models/UserModel")

module.exports.login_post = async (req:any, res:any) => {
    
}

module.exports.register_post = async (req:any, res:any) => {
    try {
        let data = req.body
        const register = await User.register(data)
        res.status(200).send(register)
    } catch (error:any) {
        res.status(400).send(error)
    }
}

module.exports.verifyAccount_post = async (req:any, res:any) => {
    try {
        let data = req.body
        const verifyAccount = await User.verifyAccount(data)
        res.status(200).send(verifyAccount)
    } catch (error) {
        res.status(400).send(error)
    }
}