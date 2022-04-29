const User = require("../models/UserModel")
const Token = require("../models/TokenModel")

module.exports.login_post = async (req: any, res: any) => {
    try {
        let data = req.body
        const login = await User.login(data)
        await Token.saveToDataBase(login.refreshToken)
        res.status(200).send({tokens: login, message:"Logged in succesfully"})
    } catch (error: any) {
        res.status(404).send(error)
    }
}

module.exports.register_post = async (req: any, res: any) => {
    try {

        let data = req.body
        const register = await User.register(data)
        res.status(200).send(register)
    } catch (error: any) {
        res.status(400).send(error)
    }
}

module.exports.verifyAccount_post = async (req: any, res: any) => {
    try {
        let data = req.body
        const verifyAccount = await User.verifyAccount(data)
        res.status(200).send(verifyAccount)
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports.setWorkPreferences_post = async(req:any, res:any) => {
    try{
        let data = req.body
        let user = req.user
        const setWorkPreferences = await User.setWorkPreferences(user.userId, data)
        res.status(200).send(setWorkPreferences)
    }catch(error){
        res.status(400).send(error)
    }
}

module.exports.setSkillsPreferences_post = async(req:any, res:any) => {
    try{
        let data = req.body
        let user = req.user
        const setWorkPreferences = await User.setSkillsPreferences(user.userId, data)
        res.status(200).send(setWorkPreferences)
    }catch(error){
        res.status(400).send(error)
    }
}
