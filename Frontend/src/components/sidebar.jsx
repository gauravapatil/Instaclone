import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Heart, HeartIcon, Home, LogOut, MessageCircle, MessagesSquare, PlusSquare, Search, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./createPost";
import { setPosts, setSelectedPosts } from "@/redux/postSlice";




const Sidebar = ()=>{
    const navigate=useNavigate()
    const dispatch= useDispatch();
    const {user} = useSelector(store=>store.auth)
    const [open,setOpen] = useState(false)

    
    const logoutHandler=async()=>{
        try {
            const res= await axios.get('https://instaclone-e11n.onrender.com/api/v1/users/logout', {withCredentials:true});
            console.log(res)
            if(res.data.success){
                // console.log(user);
                dispatch(setAuthUser(null));
                dispatch(setSelectedPosts(null));
                dispatch(setPosts([]))
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.message)
        }
    }
    const sidebarHandler=(text)=>{
         if(text==="Logout"){
            logoutHandler();
         }
         else if(text==="Create"){
               setOpen(true)
         }
         else if(text==="Profile"){
            navigate(`/profile/${user?.id}`)
         }
         else if(text==="Home"){
            navigate('/')
         }
         else if(text==="Messages"){
            navigate('/chat')
         }
    }
    const sidebarItems=[
        { icon:<Home/>, text:"Home"},
        { icon:<Search/>, text:"Search"},
        { icon:<TrendingUp/>, text:"Explore"},
        { icon:<MessageCircle/>, text:"Messages"},
        { icon:<HeartIcon/>, text:"Notifications"},
        { icon:<PlusSquare/>, text:"Create"},
        { 
            icon:(
                <Avatar className='w-6 h-6'>
      <AvatarImage src={user?.profilePicture} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
            ),
            text:"Profile"
        },
        { icon:<LogOut/>, text:"Logout"}
        
    ]
    return(
        <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[17%] h-screen">
            <div className="flex flex-col">
                <h1 className="my-8 pl-3 font-bold text-xl"><span style={{fontFamily:"cursive"}}>Instagram </span>
                <span style={{fontFamily:"'Lobster',cursive"}}>clone</span></h1>
                <div>
                    {
                       sidebarItems.map((item,index)=>{
                        return (
                            <div onClick={()=>sidebarHandler(item.text)}   key={index} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                                  <div className="w-6 shrink-0">{item.icon}</div>  
                                    <span>{item.text}</span>
                                </div>
                        )
                       })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen}/>
        </div>
    )
}
export default Sidebar