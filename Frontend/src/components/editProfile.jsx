import { useDispatch, useSelector } from "react-redux";
import {Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";






const EditProfile = ()=>{
    const {user} = useSelector(store=>store.auth);
    const [loading,setLoading] = useState(false)
    const imageRef= useRef();
    const dispatch= useDispatch();
    const navigate = useNavigate();
    const [input,setInput] = useState({
        profilePic:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender || ""
    })


    const fileChangeHandler = (e)=>{
        const file = e.target.files?.[0];
        if (file){
            setInput({...input,profilePic:file})
        }
    }
    const selectChangeHandler = (value) =>{
        setInput({...input,gender:value})
       
    }

    // console.log(input)

    const dataHandler = async() => {

          
        console.log("input",input);
        const formData = new FormData();
        formData.append("bio",input.bio);
        formData.append("gender",input.gender)
        if(input.profilePic){
            formData.append("profilePic",input.profilePic)
        }
        for(let[key,value] of formData.entries()){
            console.log(key,value)
        }
       
        

        

try {
    setLoading(true)
    const res= await axios.post("http://localhost:8000/api/v1/users/profile/edit",formData, {withCredentials:true})
    if(res.data.success){
        console.log(res.data);
        const updatedUserData = {
            ...user,
            bio:res.data.user?.bio,
            gender:res.data.user?.gender,
            profilePicture:res.data.user?.profilePicture
        }

        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?.id}`)
       toast.success(res.data.message)
    }
    
} catch (error) {
    console.log(error)
}
finally{
    console.log("Input",input)
    setLoading(false)
}
    }
    return (
        <div className="flex max-w-2xl mx-auto pl-10 my-8">
<section className="flex flex-col gap-6 w-full">
    <h1 className="font-bold text-xl">Edit Profile</h1>
    <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={user?.profilePicture} alt="post"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <h1  className="font-bold text-sm">{user?.username}</h1>
                <span className="text-gray-600">{user?.bio || "bio here..."}</span>
            </div>
        </div>
        <input ref={imageRef} onChange={fileChangeHandler} type="file"  className="hidden"/>
        <Button onClick={()=>imageRef?.current.click()}  className="bg-[#0095F6] h-8 hover:bg-[#318bc7]">Change photo</Button>
    </div>
    <div className="">
        <h1 className="font-bold text-xl mb-2">Bio</h1>
        <Textarea name='bio' value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})}  className="focus-visible:ring-transparent"/>
    </div>
    <div>
    <h1 className="font-bold text-xl mb-2">Gender</h1>
    <Select Defaultvalue={input.gender}  OnValueChange={(value)=>{
        console.log("Selected Gender",value);
        setInput({...input,gender:value})}} >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Gender</SelectLabel>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          
        </SelectGroup>
      </SelectContent>
    </Select>
  
    


    </div>
    <div className="flex justify-end">
        {
        loading ? (
        <Button className="w-fit bg-[#0095F6] hover:bg-[#318bc7]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Please wait</Button>
          )  : (

            <Button onClick={dataHandler} className="w-fit bg-[#0095F6] hover:bg-[#318bc7]">Submit</Button>
          )
        }
    </div>
</section>
        </div>
       
    )
}

export default EditProfile;