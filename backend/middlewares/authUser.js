import jwt from 'jsonwebtoken'

// USER authentication middleware

// const authUser=async(req,res,next)=>{
//     try {
        
//       const {token}=req.headers
//       if(!token){
//         return res.json({success:false,message:"Not authorized login Again"})
//       }  
//       const token_decode=jwt.verify(token,process.env.JWT_SECRET)
//     req.body.userId=token_decode.id


//       next()


//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }


// export default authUser



const authUser = async (req, res, next) => {
  try {
    // Extract Token from Authorization Header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again' });
    }

    // Get Token from "Bearer <TOKEN>"
    const token = authHeader.split(' ')[1];

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId=decoded.id

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default authUser;
