import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { use, useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import store from "@/redux/store";
const Login =()=>{
    const navigate=useNavigate()
    const [input,setInput]=useState({
        email:"",
        password:""
    })
    
    const [loading,SetLoading] = useState(false)
    const {user} = useSelector(store=>store.auth)
    const dispatch = useDispatch();
    const OnInputChange = (e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const signupHandler=async (e)=>{
        e.preventDefault();
        
        // console.log(input)
        try {
            SetLoading(true)
            const res= await axios.post('http://localhost:8000/api/v1/users/login',input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            })
            if(res.data.success){
                dispatch(setAuthUser(res.data.ActiveUser))
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            
        
        }
        finally{
            SetLoading(false);
            setInput({
                email:"",
                password:""
            })
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
                    <h1 className="text-center font-bold text-xl" >
                    <span style={{fontFamily:"cursive"}}>Instagram </span>
                    <span style={{fontFamily:"'Lobster',cursive"}}>clone</span>
                    </h1>
                    <p className="text-sm text-center">Login</p>
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
                </div>{
                loading ? (
                    <Button ><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>
                ):(
                    <Button type="submit">Login</Button>
                )
            }
                
               <span className="text-center">Don't have account? <Link className="text-blue-600" to="/signup">Signup</Link></span>
            </form>
        </div>
    )
}

export default Login;