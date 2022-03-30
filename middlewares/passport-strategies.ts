const UserModel = require("../models/UserModel")
const argon2 = require("argon2")

passport.use(new LocalStrategy({usernameField: "email"}, async function verify(email:any, password:any, done:any) {
    await UserModel.findOne({ email }, (err:any, user:any)=>{
        if(err) return done(err)
        if(!user) return done(null,false)
        argon2.verify(user.password, password)
    })
}))