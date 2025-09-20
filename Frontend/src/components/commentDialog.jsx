import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link, Links } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import Comment from "./Comment";

const CommentDialog = ({open,setOpen})=>{
    const [text,setText]= useState("");
    const {selectedPost} = useSelector(store=>store.post)
    const changeHandler=(e)=>{
        if(e.target.value.trim()){
            setText(e.target.value)
        }
        else{
            setText("")
        }
    }
    return(
        <Dialog open={open}>
            <DialogContent onInteractOutside={()=>setOpen(false)} className="max-w-[51rem]  min-h-[17rem] p-0 flex flex-col">
                <div className="flex flex-1">
                    <div className="w-1/2">
                <img
                src={selectedPost?.image}
                alt="post_img"
                className="w-full h-full object-cover rounded-l-lg"
                />
                </div>
                <div className="w-1/2 flex flex-col justify-between">
                <div className="flex items-center justify-between p-4">
                    <div className="flex gap-3 items-center">
                        <Link>
                        <Avatar>
                            <AvatarImage src={selectedPost?.author?.profilePicture}/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        </Link>
                        <div>
                            <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                           <MoreHorizontal className="cursor-pointer"/>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col items-center text-sm text-center">
                            <div className="cursor-pointer w-full text-[#E04956] font-bold">Unfollow</div>
                            <div className="cursor-pointer w-full">Add to favourites</div>
                        </DialogContent>
                    </Dialog>

                </div>
                <hr />
                <div className="flex-1 overflow-y-auto max-h-96 p-4">
                    {
                    selectedPost?.comments.map((comment)=><Comment key={comment._id} comment={comment}/>)
                    }
                    {/* Comments here... */}
                </div>
                <div className="p-4">
                    {/* <div className="flex items-center gap-2">
                        <input type="text" value={text} onChange={changeHandler}   placeholder="Add a comment..." className="w-full outline-none border-gray-300 p-2 rounded"/>
                        <Button variant="outline" disabled={!text.trim()}>Post</Button>
                        </div> */}
                    </div>

                
                </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default CommentDialog