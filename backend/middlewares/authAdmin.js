// import jwt from 'jsonwebtoken'

// // Admin authentication middleware

// const authAdmin=async(req,res,next)=>{
//     try {
        
//       // const {atoken}=req.headers
//       const authHeader = req.headers["authorization"];
//         const atoken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

//       if(!atoken){
//         return res.json({success:false,message:"Not authorized login Again"})
//       }  
//       const token_decode=jwt.verify(atoken,process.env.JWT_SECRET)

//       if(token_decode!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASS){
//         return res.json({success:false,message:"Not authorized login Again"})
//       }

//       next()


//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }


// export default authAdmin

import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
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

    // Expected Admin Identity (same as during token generation)
    const expectedAdminIdentity = process.env.ADMIN_EMAIL + process.env.ADMIN_PASS;

    // Ensure the decoded token matches the expected admin identity
    if (decoded !== expectedAdminIdentity) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again' });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default authAdmin;
