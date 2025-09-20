import React from "react";
import Post from "./post.jsx";
import { useSelector } from "react-redux";

const Posts = ()=>{
    const {posts} = useSelector(store=>store.post)
    // console.log("from posts",posts);
    
    return(
        <div>
            {
                posts.map((post)=><Post key={post._id} post={post}/>)
                
            }
            
        </div>
    )
}
export default Posts;