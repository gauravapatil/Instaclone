import mongoose from "mongoose";


const convoSchema= new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
        }]
        });

export const Conversation=mongoose.model("Convo",convoSchema);  //export the model to use it in other