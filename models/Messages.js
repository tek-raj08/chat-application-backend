import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(

    {
        sender: {
            type: String,
            required: true
        },

        receiver: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        }
    },

    {
        timestamps: true
    }

)
const Messages = mongoose.model("Messages", messageSchema)
export default Messages