import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import dotenv from "dotenv"
const router = express.Router()
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

router.post("/register", async(req, res) => {
    const {username, password} = req.body;

    try{

        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({message: "User already exists, Please Login."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const user = new User({username: username, password: hashPassword})
        await user.save()

        const token = jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: "4h"})
        res.status(201).json({message: "User registered successfully.", token, username})

    }catch(err){
        res.status(500).json({message: "Server Error", err})
    }
})

router.post("/login", async(req, res) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({message: "User not found."})

        const isPasswordMatch = await user.comparePassword(password)
        if(!isPasswordMatch) return res.status(400).json({message: "Invalid Credentials"})
        
        res.status(200).json({message: "Login successfull", username: user.username})

    }catch(error){
        res.status(500).json({message: "Server error while login.", error})
    }
})

export default router