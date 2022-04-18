import jwt from "jsonwebtoken"
const Token = require("../models/TokenModel")

module.exports.refreshToken_post = async (req:any, res:any) => {
    try {
        const {token} = req.body
        if(!token) return res.status(401)
        const isToken = await Token.checkIfTokenIsInDataBase()
        if(isToken) {
            const payload:any = jwt.decode(token)
            jwt.verify(token, "secretTwo")
            const accessToken = jwt.sign({userId:payload.userId}, "secretOne", {expiresIn: "15m"})
            res.send({accessToken})
        }
    } catch (err:any) {
        res.status(401).send(err)
    }
}