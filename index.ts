require("dotenv").config()
import express from "express"
import cors from "cors";
const mongoose = require("mongoose");
import userRoutes from "./routes/UserRoutes"
import tokenRoutes from "./routes/TokenRoutes"

const app = express()

const PORT = 4000;
const CONN_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uotdr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json());

const connection = mongoose.connect(CONN_URL)

if (connection) app.listen(PORT, () => console.log("Running on port " + PORT))
else console.log("Cannot connect to database!")

app.use(userRoutes)
app.use(tokenRoutes)