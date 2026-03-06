import jwt from 'jsonwebtoken'
export const authUser=async(req,res,next)=>{
   try {
    console.log('unhappy')
     console.log("All headers:", req.headers) 
        const {token}=req.headers
        console.log(token);
        if(!token){
            return res.json({sucess:false,message:'Not Authorized Login Again'})
        }
        const token_decode=jwt.verify(token,'aman');
        req.body.userId=token_decode.id//see when you make token you make object with token_id
        next()
    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error})
        
    }
}