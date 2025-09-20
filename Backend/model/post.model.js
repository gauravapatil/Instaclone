import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    caption:{type:String,default:""},
    image:{type:String,default:""},
    likes:[{type:mongoose.Schema.Types.ObjectId,default:0,ref:"User"}],
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    comments:[{type:mongoose.Schema.Types.ObjectId,default:0,ref:"Comment"}]
    },{timestamps:true});
   export const Post=mongoose.model("Post",postSchema);
    