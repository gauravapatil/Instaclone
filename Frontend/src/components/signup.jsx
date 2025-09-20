import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { useSelector } from "react-redux";
import store from "@/redux/store";
const Signup =()=>{
    
    const [input,setInput]=useState({
        username:"",
        email:"",
        password:""
    })
    const navigate= useNavigate();
    const {user}= useSelector(store=>store.auth)
    const [loading,SetLoading] = useState(false)
    const OnInputChange = (e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const signupHandler=async (e)=>{
        e.preventDefault();
        
        // console.log(input)
        try {
            SetLoading(true)
            const res= await axios.post('https://instaclone-e11n.onrender.com/api/v1/users/register',input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            })
            if(res.data.success){
                 navigate('/login');
                toast.success(res.data.message)
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            
        
        }
        finally{
            SetLoading(false);
            setInput({username:"",
                email:"",
                password:""})
        } 
    }
    useEffect(()=>{
        if(user){
             navigate("/")
        }
      })



    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 w-96">
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl"><span style={{fontFamily:"cursive"}}>Instagram </span>
                    <span style={{fontFamily:"'Lobster',cursive"}}>clone</span></h1>
                    <p className="text-sm text-center">Signup</p>
                </div>
                <div>
                    <Label className="font-medium">Username</Label>
                    <Input type="text" className="focus-visible:ring-transparent my-2"
                    name="username"
                    value={input.username}
                    onChange={OnInputChange}
                    />
                    
                </div>
                <div>
                    <Label className="font-medium">Email</Label>
                    <Input type="email" className="focus-visible:ring-transparent my-2"
                    name="email"
                    onChange={OnInputChange}
                    value={input.email}
                    
                    />
                    
                </div>
                <div>
                    <Label className="font-medium">Password</Label>
                    <Input type="password" className="focus-visible:ring-transparent my-2"
                    name="password"
                    value={input.password}
                    onChange={OnInputChange}
                    
                    />
                </div>
                <Button type="submit">Signup</Button>
            <span className="text-center">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></span>
            </form>
        </div>
    )
}

export default Signup;