import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";






const useGetAllSuggestedUsers = () =>{
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAllSuggestedUsers = async () => {
            try{
                const res = await axios.get("http://localhost:8000/api/v1/users/suggested", {withCredentials:true})
                console.log("From sugg:",res.data)
                if(res.data.success){
                    // console.log(res)
                    dispatch(setSuggestedUsers(res.data.users))
                    
                }
            }
            catch(error){
                console.log(error)
            }
        }
        fetchAllSuggestedUsers();
    },[])
}

export default useGetAllSuggestedUsers;