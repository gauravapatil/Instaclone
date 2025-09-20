import { setMessages } from "@/redux/chatSlice"
import  store from  "@/redux/store"
import { useEffect } from  "react";
import { useDispatch, useSelector } from  "react-redux"



const useGetRTM = () => {
    const dispatch = useDispatch();
    const {socket} = useSelector(store=>store.socketio);
    const {Messages} = useSelector(store=>store.chat)

   useEffect(()=>{
    socket?.on('newMessage',(newMessage)=>{
        dispatch(setMessages([...Messages,newMessage]))
    })
   

   return () =>{
    socket?.off('newMessage');
   }
},[Messages,setMessages]
)
}

export default useGetRTM;






