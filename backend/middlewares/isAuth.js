 import jwt from "jsonwebtoken"
 const isAuth=async (req,res,next)=>{
    try {
        // const token=req.cookies.token
            let token = '';
    
       if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log('token',token);
        if(!token){
            return res.status(400).json({message:"token is not found"})
        }

   const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)  
   
   req.userId=verifyToken.userId

   next()

    } catch (error) {
        return res.status(500).json({message:`is auth error ${error}`})
    }
 }

 export default isAuth