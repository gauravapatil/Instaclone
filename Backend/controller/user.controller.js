import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js"
import { Post } from "../model/post.model.js";



export  const register= async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"Please fill in all fields", success:false});
            }
        
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use", success:false});
            }
        const hashedpass=await bcrypt.hash(password,10);
        const user=new User({username,email,password:hashedpass});
        await user.save();
        res.status(201).json({message:"User created successfully", success:true});
        }

        
        catch(error){
            res.status(400).json({error:error.message})
        }
}


export const login= async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please fill in all fields", success:false});
            }
            const user=await User.findOne({email});
            if(!user){
                return res.status(400).json({message:"Invalid credentials", success:false});
                }
                const isMatch=await bcrypt.compare(password,user.password);
                if(!isMatch){
                    return res.status(400).json({message:"Invalid credentials", success:false});
                    }
                const token= await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"})
                const populatedPosts= await Promise.all(
                    user.posts.map(async(postId)=>{
                        const post = await Post.findById(postId);
                        if(post.author.equals(user._id)){
                            return post;
                        }
                        return null;
                    })
                )
            
                const ActiveUser={
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    profilePicture:user.profilePicture,
                    bio:user.bio,
                    gender:user.gender,
                    followers:user.followers,
                    following:user.following,
                    posts:populatedPosts,
                }


                
                res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
                    message:`Welcome back ${user.username}!`,
                    success:true,
                    ActiveUser

                })

}
  catch(error){

    res.status(400).json({error:error.message})
    }
}

export const logout= async(req,res)=>{
    try {
        res.cookie("token", "",{httpOnly:true,
            expires:new Date(0),
            sameSite:"None",
            secure:true
        }).json({
            message:"Logged out successfully",
            success:true
        })
    }
    catch(error){
        res.status(400).json({error:error.message})
        }
}

export const getProfile= async(req,res)=>{
    try {
        const id=req.params.id;
        const user=await User.findById(id).populate({path:'posts',createdAt:-1}).populate('saved');
        
        return res.status(200).json({
            user,
            success:true
        })
        }
        catch(error){
            res.status(400).json({error:error.message})
            console.log(error.stack)
            }
            }
  
export const editProfile= async(req,res)=>{
    try {
        const id=req.id;
        const {bio,gender}= req.body;
        console.log("Req",req.file)
        const profilePicture=req.file;
        let cloudResponse;
        if(profilePicture){
            const fileUri=getDataUri(profilePicture);
            cloudResponse=await cloudinary.uploader.upload(fileUri);
        }

        const user= await User.findById(id).select("-password");
        if(!user){
            return res.json({
                message:"User not found",
                success:false
            })
        }
        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        if(profilePicture) user.profilePicture=cloudResponse.secure_url;
        await user.save();
        console.log(profilePicture)

        res.status(200).json({
            message:"Profile edited successfully",
            success:true,
            user
        })
        

}
catch(error){
    res.status(400).json({error:error.message})
}
}

export const suggestedUser= async(req,res)=>{
    try {
        const suggUser=await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggUser){
            return res.status(400).json({
                message:"No any user added",
                success:false
            })
        }
        res.status(200).json({
            message:"Found suggested users",
            success:true,
            users:suggUser
        })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

export const followOrUnfollow= async(req,res)=>{
    try {
    const userId=req.id;
    const TargetUserId=req.params.id;
    if(userId===TargetUserId){
        return res.status(400).json({
            message:"You can't follow/unfollow yourself",
            success:false
        })
    }
    const user=await User.findById(userId);
    const TargetUser=await User.findById(TargetUserId);
    if(!user || !TargetUser){
        return res.status(400).json({
            message:"No such user",
            success:false
        })
    }
    const isFollowing= user.following.includes(TargetUser);
    if(isFollowing){
        await  Promise.all([
             User.updateOne({_id:userId},{$pull:{following:TargetUserId}}),
             User.updateOne({_id:TargetUserId},{$pull:{followers:userId}})
    
           ])
           return res.status(200).json({message:"Unfollowed successfully",
            success:true
        })
    }
    else{
       await  Promise.all([
         User.updateOne({_id:userId},{$push:{following:TargetUserId}}),
         User.updateOne({_id:TargetUserId},{$push:{followers:userId}})

       ])
    }
    return res.status(200).json({message:"Followed successfully",
        success:true,
        userId,
        TargetUserId,
        user,
        TargetUser
    })

    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
    