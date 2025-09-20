import useGetAllUserProfile from "@/hooks/useGetAllUserProfile";
import store from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = ()=>{
    const params = useParams();
    const [activeTab,setActiveTab] = useState('posts')
    const userId = params.id;
    // console.log(userId)
    useGetAllUserProfile(userId)
    
    const isFollowing = false;

    const handleTabChange = (posts)=>{
         setActiveTab(posts)
    }

    const {userProfile,user} = useSelector(store=>store.auth)
    const isLoggedInUserProfile = user?.id===userProfile?._id
    const displayedPost= activeTab === 'posts' ? userProfile?.posts || [] : userProfile?.saved || []
    return(
       <div className="flex max-w-5xl justify-center mx-auto pl-10">
          <div className="flex flex-col gap-20 p-8">
              <div className="grid grid-cols-2">
                       <section className="flex items-center justify-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                       </section>
                       <section>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{userProfile?.username}</span>
                                {
                                    isLoggedInUserProfile ? ( <div>
                                        <Link to="/account/edit">
                                        <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit Profile</Button>
                                        </Link>
                                        <Button variant="secondary" className="hover:bg-gray-200 h-8">View Profile</Button>
                                        <Button variant="secondary" className="hover:bg-gray-200 h-8">Add tools</Button>
                                    </div> ):
                                    (
                                        isFollowing ? (
                                            <>
                                    <Button variant="secondary" className="hover:cursor-pointer  h-8 ">Unfollow</Button>
                                    <Button variant="secondary"  className="hover:cursor-pointer h-8 ">Message</Button>
                                    </>
                                        ) :
                                        (
                                    <Button className="hover:cursor-pointer bg-[#0095F6] hover:bg-[#3192d2] h-8 ">Follow</Button>
                                        )
                                    )
    
                                }
                               
                            </div>
                            <div className="flex items-center gap-4 my-2">
                                <p><span className="font-semibold">{userProfile?.posts.length}</span> posts</p>
                                <p><span className="font-semibold">{userProfile?.followers.length}</span> followers</p>
                                <p><span className="font-semibold">{userProfile?.following.length}</span> following</p>

                            </div>
                            <div className="flex flex-col gap-1">
                            <span className="font-semibold">{userProfile?.bio || ""}</span>
                            <Badge className="w-fit" variant='secondary'><AtSign/><span className="pl-1">{userProfile?.username}</span></Badge>
                            </div>
                        </div>
                       
                       </section>
              </div>
              <div className="border-t border-t-gray-200">
                <div className="flex items-center justify-center gap-10 text-sm">
                    <span className={`py-3 cursor-pointer ${activeTab==='posts' ? 'font-bold' : "" }`} onClick={()=>handleTabChange("posts")} >
                        POSTS
                    </span>
                    <span className={`py-3 cursor-pointer ${activeTab==='saved' ? 'font-bold' : "" }`} onClick={()=>handleTabChange("saved")} >
                        SAVED
                    </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 pl-8">
              {
                displayedPost.map((post)=>{
                    return (
                        <div key={post?._id} className="relative group cursor-pointer">
                           <img src={post.image} alt="post" className=" absolute  w-full aspect-square object-cover" />
                           {/* <div className="absolute-inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-50 opacity-0"></div>
                           <div className="flex items-center text-white space-x-4 ">
                                 <Button className="flex items-center gap-2 hover:text-gray-300">
                                    <Heart/>
                                    <span>{post?.likes.length}</span>
                                 </Button>
                                 <Button className="flex items-center gap-2 hover:text-gray-300">
                                    <MessageCircle/>
                                    <span>{post?.comments.length}</span>
                                 </Button>
                                
                           </div> */}
                        </div>
                    )
                })
              }
              </div>
             

          </div>
       </div>
      
    )
} 

export default Profile;