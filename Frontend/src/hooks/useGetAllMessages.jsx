import { setMessages } from "@/redux/chatSlice";
import store from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";





const useGetAllMessages = () =>{
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth)

    useEffect(()=>{
        const fetchAllMessages = async () => {
            try{
                const res = await axios.get(`https://instaclone-e11n.onrender.com/api/v1/messages/all/${selectedUser?._id}`, {withCredentials:true})
                // console.log("From sugg:",res.data)
                if(res.data.success){
                    dispatch(setMessages(res.data.messages))
                    
                }
            }
            catch(error){
                console.log(error)
            }
        }
        fetchAllMessages();
    },[selectedUser])
}

export default useGetAllMessages;