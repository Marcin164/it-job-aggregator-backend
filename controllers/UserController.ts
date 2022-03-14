const User = require("../models/UserModel")

module.exports.register_post = async (req:any, res:any) => {
    try {
        let data = req.body
        const register = await User.register(data)
        res.status(200).send(register)
    } catch (err:any) {
        res.status(400).send(err)
    }
}