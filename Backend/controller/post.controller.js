import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Comment } from "../model/comment.model.js";
import cloudinary from "../utils/cloudinary.js"
import sharp from "sharp";
import { getReceiverSocketId } from "../sockets/socket.js";
export const addNewPost= async(req,res)=>{
    try {
        const {caption}=req.body;
        const image=req.file;
        const userId=req.id;

        console.log("req.file:",req.file)
        if(!image) return res.status(400).json({message:"Please upload an image"});
         const optmizedImageBuffer= await sharp(image.buffer)
         .resize({width:800,height:800,fit:'inside'})
         .toFormat('jpg', {quality:80})
         .toBuffer();

         const fileUri=`data:image/jpeg;base64,${optmizedImageBuffer.toString('base64')}`;
         const cloudResponse=await cloudinary.uploader.upload(fileUri);
         const post=await Post.create({
            image:cloudResponse.secure_url,
            caption,
            author:userId

         })
         const user=await User.findById(userId);
         if(user){
            user.posts.push(post._id);
            await user.save()
            console.log(user)
         }
         
         await post.populate({path:'author',select:'-password'})
         res.status(201).json({
            message:"Post created successfully",
            success:true,
            post
         })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
export const getAllPosts= async(req,res)=>{
try {
    const posts=await Post.find().sort({createAt:-1}).populate({path:'author',select:"username profilePicture"})
    .populate({path:'comments',sort:{createdAt:-1},
    populate:({path:'author',select:'username profilePicture'})
})
return res.status(200).json({
    message:"Fetched all posts successfully",
    success:true,
    posts
})
} catch (error) {
    res.status(400).json({error:error.message})
}}

export const getUserPosts=async(req,res)=>{
    try {
        const userId=req.id;
        const userPosts=await Post.find({author:userId}).sort({createdAt:-1})
        .populate({path:'author',select:"username,profilePicture"})
        .populate({path:'comments',sort:{createdAt:-1},
            populate:({path:'author',select:'username,profilePicture'})
        })
        res.status(200).json({
            message:"Fetched all posts successfully",
            success:true,
            userPosts
        })

    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

export const likePost= async(req,res)=>{
    try {
        const postId=req.params.id;
        const userId=req.id;
        const post=await Post.findById(postId);
        if(!post) return res.status(400).json({message:"no posts found"});
        await post.updateOne({$addToSet:{likes:userId}})
        await post.save();


        const user= await User.findById(userId).select('username profilePicture');
        const postOwnwerId = post.author.toString();
        // if(postOwnwerId!==userId){
        //     const notification = {
        //         type:'like',
        //         userId: userId,
        //         userDetails:user,
        //         postId,
        //         message:'Your post was liked'
        //     }
        //     const postOwnwerSocketId = getReceiverSocketId(postOwnwerId);
        //     io.to(postOwnwerSocketId).emit('notification', notification)
        // }

        res.status(200).json({message:'Post liked',success:true})


        

    } catch (error) {
        res.status(400).json({error:error.message})
    }
    
}
export const UnlikePost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const userId=req.id;
        const post=await Post.findById(postId);
        if(!post) return res.status(400).json({message:"no posts found"});
        await post.updateOne({$pull:{likes:userId}})
        await post.save();
        const user= await User.findById(userId).select('username profilePicture');

        // if(postOwnwerId!==userId){
        //     const notification = {
        //         type:'dislike',
        //         userId: userId,
        //         userDetails:user,
        //         postId,
        //         message:'Your post was liked'
        //     }
        //     const postOwnwerSocketId = getReceiverSocketId(postOwnwerId);
        //     io.to(postOwnwerSocketId).emit('notification', notification)
        // }



        res.status(200).json({message:'Post unliked',success:true})

        

    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
export const createComment=async(req,res)=>{
    const postId=req.params.id;
    const authorId=req.id;
    const {text}=req.body;
    const post=await Post.findById(postId);
    if(!post) return res.status(400).json({message:"no posts found"});
    if(!text) return res.status(400).json({message:"No text added",success:false})

    const comment=await Comment.create({
        text,
        author:authorId,
        post:postId
    })

    await comment.populate({path:'author',select:"username profilePicture"})
    
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({message:"Comment added successfully",success:true,
        comment
    })
    res.status(400).json({error:error.message})

}

export const getAllComments=async(req,res)=>{
    try {
        const postId=req.params.id;
    const comments=await Comment.find({post:postId}).populate({path:'author',select:'username profilePicture'})
    if(!comments) return res.status(404).json({message:"no comments found",success:true})
    res.status(200).json({comments,success:true})
    } catch (error) {
    res.status(400).json({error:error.message})
    }   
}

export const deletePost= async(req,res)=>{
    try {
        const authorId=req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post) return res.status(400).json({message:"no posts found"});
        if(post.author.toString() !== authorId){
            return res.status(403).json({message:"You are not authorized to delete this post",success:false})
        }
        await Post.findByIdAndDelete(postId);
    
        const user=await User.findById(authorId);
        user.posts=user.posts.filter(id=>id.toString()!==postId)
        await user.save();
        await Comment.deleteMany({post:postId})
    return res.status(200).json({message:'Post Deleted',success:true})

    } catch (error) {
    res.status(400).json({error:error.message})
        
    }
}

export const saved=async(req,res)=>{

    try {
    const authorId=req.id;
    const postId=req.params.id;
    const post=await Post.findById(postId);
    if(!post) return res.status(400).json({message:"no posts found"});
    const user=await User.findById(authorId);
    if(user.saved.includes(post._id)){
        user.updateOne({$pull:{saved:post._id}})
        await user.save();
        return res.status(200).json({type:"unsaved",message:"Post unsaved",success:true})
    }
    else{
        user.updateOne({$addToSet:{saved:post._id}})
        await user.save();
        return res.status(200).json({type:"saved",message:"Post saved",success:true})
    }
    } catch (error) {
    res.status(400).json({error:error.message})
    }
}