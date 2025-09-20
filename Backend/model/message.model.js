import mongoose from "mongoose";

const message=new mongoose.Schema({
    SenderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    ReceiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        },
        message:{
            type:String,
            required:true
        }
    })

    export const Message= mongoose.model("Message",message)  //exporting the model to use it in other files.