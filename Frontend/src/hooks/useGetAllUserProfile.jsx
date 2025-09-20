import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";




const useGetAllUserProfile = (userId) =>{
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAllUserProfile = async () => {
            try{
                const res = await axios.get(`http://localhost:8000/api/v1/users/${userId}/profile`, {withCredentials:true})
                // console.log("From profile:",res.data)
                if(res.data.success){
                    // console.log("from profile",res.data.user)
                    dispatch(setUserProfile(res.data.user))
                    
                }
            }
            catch(error){
                console.log(error)
            }
        }
        fetchAllUserProfile();
    },[userId])
}

export default useGetAllUserProfile;