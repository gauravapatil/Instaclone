import React, { useState } from "react";
import {FaRegHeart,FaHeart} from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./commentDialog";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store.js";
import axios from "axios";
import { setPosts, setSelectedPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

const Post = ({post}) => {
    // console.log("from post",post)
    const {user} = useSelector(store=>store.auth)
    const [text,setText] = useState("");
    const [open,setOpen] = useState(false)
    const {posts} = useSelector(store=> store.post)
    const [liked,setLiked] = useState(post.likes.includes(user?.id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const [comment,setComment] = useState(post.comments)
    const dispatch = useDispatch();
    const changeHandler= (e)=>{
        if(e.target.value.trim()){
            setText(e.target.value)
        }
        else{
            setText("")
        }
    }

    const savedPostHandler = async()=>{
      try{
        const res= await axios.get(`http://localhost:8000/api/v1/posts/${post._id}/bookmark`,{withCredentials:true});
        if(res.data.success){
          // console.log(res.data)
          toast.success(res.data.message);
        } 
      }
      catch(error){
        console.log(error)
      }
    }

    const commentHandler = async()=>{
try {
  const res= await axios.post(`http://localhost:8000/api/v1/posts/${post._id}/comment`, {text},{withCredentials:true})

      if(res.data.success){
        // console.log(res.data)
        const updatedCommentData= [...comment, res.data.comment];
        setComment(updatedCommentData)
        console.log(comment)
        const updatedPostData = posts.map(p=>
          p._id === post._id ? {...p, comments:updatedCommentData} : p
        )
        dispatch(setPosts(updatedPostData))

        toast.success(res.data.message)
        setText("")
      }
} 
      
      catch (error) {
       console.log(error)
      }
    }
    const likeORDislikeHandler = async() => {
      try {
        const action = liked ? 'dislike' : 'like'
          const res= await axios.get(`http://localhost:8000/api/v1/posts/${post?._id}/${action}`,{withCredentials:true})
          // console.log(res)
          if(res.data.success){
            
            console.log(postLike)
            const updatedLikes = liked ? postLike -1 : postLike +1
            setPostLike(updatedLikes)
            setLiked(!liked)

            const updatedPostData = posts.map(p=>
              p._id === post._id ? {
                ...p,
                likes : liked ? p.likes.filter(id => id !== user.id) : [...p.likes,user.id]
              } : p
            );
            dispatch(setPosts(updatedPostData))
            toast.success(res.data.message)
            
          }

      } catch (error) {
          console.log(error)
      }
  }

    const deletePostHandler = async() =>{
        try {
        const res=await axios.delete(`http://localhost:8000/api/v1/posts/delete/${post._id}`,{withCredentials:true});
        // console.log("Delete",res.data)
        if(res.data.success){
            const updatedPostData = posts.filter((postItem)=>postItem?._id !== post?._id);
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message)
        }

    } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
    }

    }
  return (
    
    <div className="w-full max-w-md bg-white shadow-sm rounded-md p-4 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image"></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
          <h1>{post.author.username}</h1>
          {user?.id == post?.author._id && <Badge variant="secondary">Author</Badge>}
         
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#E04956] font-bold"
            >
              Unfollow
            </Button>

            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favourites
            </Button>
            {
                user && user?.id == post?.author._id &&  <Button
                variant="ghost"
                className="cursor-pointer w-fit text font-bold"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
              }
                
            
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      ></img>
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {
            liked ? 
            <FaHeart onClick={likeORDislikeHandler} size={'24px'} className='cursor-pointer text-red-600'/>
            : 
         <FaRegHeart  onClick={likeORDislikeHandler}  size={'22px'} className='cursor-pointer'/>

          }
<MessageCircle onClick={()=>{
        dispatch(setSelectedPosts(post))
        setOpen(true)}
       } className="cursor-pointer hover:text-gray-600"/>
<Send className="cursor-pointer hover:text-gray-600"/>
        </div>
        <Bookmark onClick={savedPostHandler} className="cursor-pointer hover:text-gray-600"/>
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
       {post.caption}
      </p>
      {
        comment.length > 0 && 
        <span onClick={()=>{
          dispatch(setSelectedPosts(post))
          setOpen(true)}} className="cursor-pointer text-sm text-gray-400">View all {comment.length} comments</span>
      }
      
      <CommentDialog open={open} setOpen={setOpen}/>
      <div className="flex items-center justify-between">
        <input type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={changeHandler}
        className="outline-none text-sm w-full"
        
        />
        {
            text &&
        <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>
        
        }
      </div>
    </div>
    
  );
};
export default Post
