require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const userRoutes = require("./routes/UserRoutes.ts")

const app = express()

app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(express.json());

const PORT = 4000;
const CONN_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uotdr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connection = mongoose.connect(CONN_URL)

if(connection) app.listen(PORT, () => console.log("Running on port " + PORT))
else console.log("Cannot connect to database!")

app.use(userRoutes)