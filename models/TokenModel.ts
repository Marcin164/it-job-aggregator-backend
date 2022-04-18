import { Schema, model } from "mongoose";

const TokenSchema: Schema = new Schema({
    token:{
        type:String
    }
}, {timestamps:true})

TokenSchema.statics.saveToDataBase = async function (refreshToken:any) {
    const token = new this({
        token: refreshToken
    })

    await token
    .save()
    .catch((err: any) => {throw err})
}

TokenSchema.statics.checkIfTokenIsInDataBase = async function (refreshToken:any){
    const token = await this.findOne({ token: refreshToken })

    if(!token) throw "No valid token!"
    return true
}

const TokenModel = model(
    "tokens",
    TokenSchema
)

module.exports = TokenModel