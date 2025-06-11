import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import http from "http"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import { Server } from 'socket.io'
import Messages from './models/Messages.js'
import User from './models/User.js'

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
        socket.broadcast.emit("receive_message", data);
    });


    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
});

app.get("/messages", async(req, res) => {
    const {sender, receiver} = req.query;

    try{

        const message = await Messages.find({
            $or: [
                {sender, receiver},
                {sender: receiver, receiver:sender}
            ]
        }).sort({createdAt: 1})
        res.json(message)

    }catch(err){
        res.status(500).json({message: "Error fetching messages."})
    }
})

app.get("/users", async(req, res) => {
    const {currentUser} = req.query;

    try{
        const users = await User.find({username: {ne: currentUser}})
        res.json(users)
    }catch(err){
        res.status(500).json({message: "Error fetching users."})
    }
})

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Mongodb connected.")
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

}).catch((error) => console.error(error))