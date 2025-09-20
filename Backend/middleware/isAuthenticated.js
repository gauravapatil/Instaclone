import jwt from "jsonwebtoken";

export const isAuthenticated= async (req,res,next)=>{
    try {
         const token=req.cookies.token;
         if(!token){
            return res.status(401).json({msg:"Please login to access this resource"})
            }
        const decode= await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({msg:"Please login to access this resource"})
            }
            req.id=decode.userId;
            next();
        }
        catch (error) {
            console.log(error)
           
        }
         }

    
