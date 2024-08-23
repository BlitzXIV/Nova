
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import mongoConnect from "./db/mongoConnect.js"

const app= express()
const PORT = process.env.PORT || 5000

dotenv.config()

app.use(express.json()) // parse incoming req's w JSON payloads (from req.body)
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)




app.listen(PORT,() =>{  
    mongoConnect()
    console.log(`Server is running on port ${PORT}`)
})