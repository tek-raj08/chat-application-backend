import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

UserSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", UserSchema)
export default User