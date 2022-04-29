import { Schema, model } from "mongoose";
import validator from "validator";
import argon2 from "argon2";
import uniqueValidator from 'mongoose-unique-validator';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"
const codeGenerator = require('node-code-generator');

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Type in a name"],
    },
    surname: {
        type: String,
        required: [true, "Type in a surname"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Type in an email"],
        validate: [validator.isEmail, "Invalid email!"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Type in a password"],
        minlength: [8, "Minimum password length is 6 characters!"],
        validate: [validator.isStrongPassword, "Invalid password!"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isPreferences: {
        type: Boolean,
        required:true,
        default: false
    },
    code: {
        type: String,
    },
    isRemote: {
        type: String,
        required: [true, "Type in a password"],
        enum: ["Yes", "No", "Doesn't matter"],
        default: "No"
    },
    placeOfWork: {
        type: [String],
        required: [true, "Select place of work"],
    },
    favouriteCompany: {
        type: [String],
        required: [true, "Select favourite companies"],
        default: []
    },
    levelOfExperience: {
        type: [String],
        required: [true, "Select experience"],
        default: []
    },
    typeOfEmployment: {
        type: [String],
        required: [true, "Select type of employment"],
        default: []
    },
    fieldOfProgramming: {
        type: [String],
        required: [true, "Select field of programming"],
        default: []
    },
    skills: {
        type: [String],
        required: [true, "Select skills"],
        default: []
    },
    maxSalary: {
        type: Number,
        required: [true, "Select maximal salary"],
        default: 0
    },
    minSalary: {
        type: Number,
        required: [true, "Select minimal salary"],
        default: 0
    },
}, { timestamps: true });

UserSchema.statics.login = async function(data:any) {
    const user = await this.findOne({email: data.email.toLowerCase()})

    if(!user) throw "Wrong email or password"

    let isMatch = await argon2.verify(user.password, data.password)

    if(!isMatch) throw "Wrong email or password"

    const accessToken = jwt.sign({userId:user.id}, "secretOne", {expiresIn: "15s"})
    const refreshToken = jwt.sign({userId:user.id}, "secretTwo")

    const isActive = user.isActive
    const isPreferences = user.isPreferences

    return {accessToken, refreshToken, isActive, isPreferences}
}

UserSchema.statics.register = async function (data:any) {
    if (!data) throw "Invalid or no data!"

    let generator = new codeGenerator();
    let codes = generator.generateCodes('######', 100);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    if(validator.isStrongPassword(data.password)) throw "Password is not strong enough!"

    const user = new this({
        name: data.name,
        surname: data.surname,
        email: data.email.toLowerCase(),
        password: await argon2.hash(data.password),
        code: codes[0]
    })

    await user
        .save()
        .catch((err: any) => {
            throw err
        })

    let options = {
        from: process.env.EMAIL_USER,
        to: data.email.toLowerCase(),
        subject: 'Verify your account',
        html: `<h1>Welcome ${data.name}, to our Job Aggregator!</h1><p>We are so happy, that you've signed up in our site. WE hope that u will find your dream job here</p><p>Here is your code:<b>${codes[0]}</b></p><p>Type it <a>here</a></p><p>Do not share it with anyone</p><p><h3>Marcin Nowakowski</h3></p>`
    };

    transporter.sendMail(options, function (err: any, info: any) {
        if (err) console.log(err)
        console.log("Sended!")
    })

    return "Saved!"
}

UserSchema.statics.verifyAccount = async function (data:any) {
    if (!data) throw "Invalid or no data!"
    console.log(data)
    const query = { $and: [{ email: data.email }, { code: data.code }] }
    const update = { isActive: true }
    await this.findOneAndUpdate(query, update)
    .then((result: any) => {
        if(result === null) throw "Wrong code!"
        return true
    })
    .catch((err: any) => {throw err})
}

UserSchema.statics.setWorkPreferences = async function (id:any, data:any) {
    if(!data) throw "Invalid or no data!"

    let arrays = {
        placeOfWork: data.placeOfWork,
        favouriteCompany: data.favouriteCompany,
        levelOfExperience: data.levelOfExperience,
        typeOfEmployment: data.typeOfEmployment,
        fieldOfProgramming: data.fieldOfProgramming
    }

    for (const [key, value] of Object.entries(arrays)) {
        let title = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
        if(value.length === 0) throw `${title} must have at least one choice!`
    }

    if(data.maxSalary !== undefined || data.minSalary !== undefined){
        if(data.minSalary > data.maxSalary) throw "Maximal salary must be greater, than minimal"
    }else throw "Type in salary!"

    if(data.isRemote === undefined) throw "There is something wrong with rmeote option"

    const update = {
        isRemote: data.isRemote,
        placeOfWork: data.placeOfWork,
        favouriteCompany: data.favouriteCompany,
        levelOfExperience: data.levelOfExperience,
        typeOfEmployment: data.typeOfEmployment,
        fieldOfProgramming: data.fieldOfProgramming,
        maxSalary: data.maxSalary,
        minSalary: data.minSalary
    }

    this.findByIdAndUpdate(id, update)
    .then(() => {
        return "Saved!"
    })
    .catch((err: any) => {throw err})
}

UserSchema.statics.setSkillsPreferences = async function (id:any, data:any){
    if(!data) throw "Invalid or no data!"

    if(data.skills === 0) throw "Set some skills!"

    const update = {
        skills: data.skills,
        isPreferences:true
    }

    this.findByIdAndUpdate(id, update)
    .then(() => {
        return "Saved!"
    })
    .catch((err: any) => {throw err})
}

UserSchema.plugin(uniqueValidator, { message: "Email already in use" })

const UserModel = model(
    "users",
    UserSchema
)

module.exports = UserModel