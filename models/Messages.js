import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(

    {
        sender: {
            type: String,
            require: true
        },

        sender: {
            type: String,
            require: true
        },

        sender: {
            type: String,
            require: true
        }
    },

    {
        timestamps: true
    }

)

export default mongoose.model("Messages", messageSchema)