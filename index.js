import express, { json } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())


app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Mongodb connected.")
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

}).catch((error) => console.error(error))