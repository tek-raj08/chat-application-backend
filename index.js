import express, { json } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import http from "http"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import { Server } from 'socket.io'
import Messages from './models/Messages.js'

dotenv.config()

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

app.use(cors())
app.use(express.json())


app.use("/auth", authRoutes);

// socket io logic
io.on("connection", (socket) => {
    console.log("User connected", socket.id)

    socket.on("send_message", async(data) => {
        const {sender, receiver, message} = data;
        const newMessage = new Messages({sender, receiver, message});
        await newMessage.save()
    })
});



const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Mongodb connected.")
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

}).catch((error) => console.error(error))