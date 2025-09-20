
import store from "@/redux/store.js";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { AvatarFallback } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { setMessages } from "@/redux/chatSlice";
import Message from "./messages";






const ChatPage = ()=>{
    
    const [textMessage,setTextMessage] = useState("")
    const {user,suggestedUsers,selectedUser} = useSelector(store=>store.auth)
    const {Messages} = useSelector(store=>store.chat)
    
    const dispatch= useDispatch()

   const {onlineUsers} = useSelector(store=>store.chat)

   const sendMessageHandler = async () =>{
    try {
        const res= await axios.post(`https://instaclone-e11n.onrender.com/api/v1/messages/send/${selectedUser._id}`, {message:textMessage},
            {withCredentials:true}
    
        );
        if(res.data.success){
            dispatch(setMessages([...Messages,res.data.newMessage]))
            // console.log("sendMessage",textMessage)
            setTextMessage("")
        }
    } catch (error) {
        console.log(error)
    }
    
   }
   useEffect(()=>{
    return () => {
        dispatch(setSelectedUser(null))
    }
   },[])

    return (
        <div className="flex ml-[16%] h-screen pl-10">
            <section classname="w-full md:w-1/4 my-8">
                <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
                <hr className="mb-4 border-gray-300" />
                <div className="overflow-y-auto h=[80vh]">
                    {
                        suggestedUsers.map((suggestedUser)=>{
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            console.log("isOnline", isOnline, suggestedUser.username)
                            return (
                                <div className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer ml-2 " onClick={()=>dispatch(setSelectedUser(suggestedUser))}>
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage src={suggestedUser?.profilePicture} className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium"> {suggestedUser?.username}</span>
                                        <span className={`text-xs ${isOnline ? 'text-green-600': 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </section>
            {
                selectedUser ? (
                    <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
                        <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white">
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center"/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>{selectedUser?.username}</span>
                            </div>
                            </div>
                       <Message selectedUser={selectedUser}/>
                        <div className="flex items-center p-4 border-t-gray-300">
                             <Input value={textMessage} onChange={(e)=>setTextMessage(e.target.value)} type="text" 
                             className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages.."/>
                             <Button onClick={sendMessageHandler}>Send</Button>
                        </div>
                    </section>
                ) :
                (
                    <div className="flex flex-col items-center justify-center mx-auto">
                        <MessageCircleCode className="w-32 h-32 my-4"/>
                        <h1 className="font-medium text-xl">Your Messages</h1>
                        <span>Send a message to start the conversation</span>
                    </div>
                )
            }

        </div>
    )
}

export default ChatPage;