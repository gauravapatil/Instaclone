// const express=require("express");
import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import messageRoutes from "./routes/message.route.js"
import {app, server} from './sockets/socket.js'
import path from "path"

dotenv.config({})

const PORT=process.env.PORT || 3000;

const __dirname = path.resolve();
console.log(__dirname)

app.use(express.json())

app.use(cookieParser());
const corsOptions={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions))

app.use("/api/v1/users",userRoutes)
app.use("/api/v1/posts",postRoutes)
app.use("/api/v1/messages",messageRoutes)
const route = path.join(__dirname,"..")
console.log("Route",route)
// const relPath=path.resolve(__dirname,'..',"Frontend","dist","index.html")
app.use(express.static(path.join(__dirname,"/Frontend/dist")))
app.get(/.*/, (req,res)=>{
    res.sendFile(path.resolve(route,"Frontend","dist","index.html"))
})



server.listen(PORT, ()=> {
    connectDB();
    console.log(`Server listening at ${PORT}`)
});

// const startServer = async() =>{
//     try{
//         await connectDB();
//         app.listen(PORT,()=>{
//             connectDB();
//             console.log(`Server is up and running at port ${PORT}`)})
        
//     }
//     catch(error){
//         console.error("Failed to connect DB:", error)
//     }
// }



// startServer();
