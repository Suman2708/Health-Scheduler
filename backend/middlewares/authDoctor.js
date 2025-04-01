import jwt from 'jsonwebtoken'
import 'dotenv/config.js'

const authDoctor=async(req,res,next)=>{

    try {
        const authHeader=req.headers.authorization
        const{email,password}=req.body
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized. Login again' });
        }
  
      // Get Token from "Bearer <TOKEN>"
        const token = authHeader.split(' ')[1];
        // const decode =jwt.verify(token,process.env.JWT_SECRET)
        // const decodePassword=decode.subString(0,email.length)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.docId=decoded.id
        next()
    } catch (error) {
        console.error('Admin Auth Error:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }

    

}

export default authDoctor