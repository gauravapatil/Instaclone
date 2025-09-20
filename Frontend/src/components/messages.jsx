
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";


const Message = ({selectedUser}) => {
    useGetRTM();
    useGetAllMessages();
    const {Messages} = useSelector(store=>store.chat)
    const {user} = useSelector(store=>store.auth)
    return (
       <div className="overflow-y-auto flex-1 p-4">
           <div className="flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{selectedUser?.username}</span>
             <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant="secondary">View Profile</Button></Link>
            </div>
           </div>
           <div className="flex flex-col gap-3">
            {
                Messages && Messages.map((msg)=>{
                    return (
                    <div key={msg._id || `${msg.SenderId}-${msg.message}-${Math.random()}`}  className={`w-full flex ${msg.SenderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                       <div className={`p-2 rounded-lg max-w-xs break-words ${msg.SenderId === user.id ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        {msg.message}

                       </div>
                    </div>
                    )
                })
            }
           </div>
       </div>
    )
}

export default Message;