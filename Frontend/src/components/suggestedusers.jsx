import React from "react";
import store from "@/redux/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";


const SuggestedUsers = ()=>{
    const {suggestedUsers} = useSelector(store=>store.auth)
    return(
        <div className="my-10">
            <div className="flex items-center justify-between text-sm my-2">
                <h1 className="font-semibold text-gray-600 mx-2">Suggested for you</h1>
                <span className="font-medium cursor-pointer">See All</span>
            </div>

            {
                suggestedUsers?.map((user)=>{
                    return(
                        <div key={user._id} className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                <Link to={`/profile/${user?._id}`} >
                <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                            <AvatarImage src={user?.profilePicture} alt="post_image" className="w-8 h-8 object-cover rounded-full"></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                </Link>
            <div>
            <h1 className="font-semibold text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
            <span className="text-gray-600 text-sm">{user?.bio || "Bio here..."}</span>
        </div>
        </div>
        <span  className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">Follow</span>
                        </div>
                    )
                })
            }
        </div>
      
    )
}
export default SuggestedUsers