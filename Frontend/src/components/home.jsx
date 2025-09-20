import React from "react";
import Feed from "./feed";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useAllPost";
import Rightsidebar from "./rightsidebar";
import useGetAllSuggestedUsers from "@/hooks/useGetAllSuggestedUsers";

const Homepage = ()=>{
    useGetAllPost();

    
    useGetAllSuggestedUsers();
    return(
        <div className="flex">
            <div className="flex-grow">
                <Feed/>
                <Outlet/>
            </div>
            <Rightsidebar/>
        </div>
    )
}
export default Homepage