import store from "@/redux/store";
import { Avatar } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import SuggestedUsers from "./suggestedusers";

const Rightsidebar = ()=>{
    const {user} = useSelector(store=>store.auth)
    return(
        <div className="w-fit my-10 pr-32">
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
        <SuggestedUsers/>
        </div>
    )
}
export default Rightsidebar