import { Schema, model } from "mongoose";
const validator = require("validator")
const argon2 = require("argon2")
const uniqueValidator = require('mongoose-unique-validator');

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
    },
    password: {
        type: String,
        required: [true, "Type in a password"],
        minlength:[3, "Minimum password length is 6 characters!"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isRemote: {
        type: String,
        enum: ["Yes", "No", "Doesn't matter"],
    },
    placeOfWork: {
        type: [String],
    },
    favouriteCompany: {
        type: [String],
    },
    levelOfExperience: {
        type: [String],
    },
    typeOfEmployment: {
        type: [String],
    },
    fieldOfProgramming: {
        type: [String],
    },
    skills: {
        type: [String],
    },
    maxSalary: {
        type: Number,
    },
    minSalary: {
        type: Number,
    },
}, { timestamps: true });

UserSchema.statics.login = function () {

}

UserSchema.statics.register = async function (data) {
    if (!data) throw "Invalid or no data!"

    const user = new this({
        name: data.name,
        surname: data.surname,
        email: data.email.toLowerCase(),
        password: await argon2.hash(data.password)
    })

    await user
    .save()
    .catch((err: any) => {
        throw err
    })

    return "Saved!"
}

UserSchema.plugin(uniqueValidator, { message: "Email already in use" })

const UserModel = model(
    "users",
    UserSchema
)

module.exports = UserModel