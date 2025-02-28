import 'dotenv/config'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/usersSchema.js'
import mongoose from 'mongoose'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'




// -----------User Registration-----------------
const userRegistration=async(req,res)=>{

    try {

        const {name,email,password}=req.body

    if(!name || !email || !password){
       return res.json('Please fill all the details')
    }

    if(!validator.isEmail(email)){
        return res.json({success:false,message:'Please check the Email'})
    }

    if(password.length<8){
        return res.json({success:false,message:'Please choose a strong password'})
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password,salt);

    const userData={
        name:name,
        email:email,
        password:hashedPassword
    }

    const newUser= new userModel(userData)
   const user= await newUser.save();
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
    // console.log(token)
    res.json({success:true,message:"Registered Successfully",token})
        
    } catch (error) {
        res.json({success:false,message:"Not Registered"})
        console.log(error)
    }
    
}









// const userLogin=async(req,res)=>{
//     try {
//          const {email,password}=req.body
//          const user= await userModel.findOne({email})
//          if(!user){
//            return res.json({success:false,message:'User does not exist'})
//          }
//          const isMatch=await bcrypt.compare(password,user.password)
//          if(isMatch){
//             const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//            return res.status(200).json("Login Successfully",token)
//          }
//          else{
//             res.json({success:false,message:"Please fill the correct password"})
//          }
    
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
   
// }






async function userLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!password || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Corrected response
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        console.log(token)
        res.json({success:true,message:"Login Successfully",token})

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}



// --------getting userInfo of User from Database--------------

const userInfo=async(req,res)=>{
    try {
        
        const {userId}=req.body
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,message:"Data Fetched",userData})
    } catch (error) {
                console.log(error)
        res.json({success:false,message:error.message})
    }
}





// const updateUser=async(req,res)=>{
//     try {
//         const{userId,name,phone,address,gender,dob,}=req.body
//         const imageFile=req.file

//         if(!name || !phone || !gender || !dob ){
//             return res.json({success:false,message:"Please fill all Info"})
//         }
//         await userModel.findByIdAndUpdate(userId,{name,phone,gender,dob,address:JSON.parse(address)})
//         if(imageFile){
//             const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
//             const imageUrl= imageUpload.secure_url

//             await userModel.findByIdAndUpdate(userId,{image:imageUrl})
//         }
//         const userData=await userModel.findById(userId).select('-password')
//         res.json({success:true,message:"Profile Updated",userData})


//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }






const updateUser = async (req, res) => {
    try {
        const { userId, name, phone, address, gender, dob } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !gender || !dob) {
            return res.status(400).json({ success: false, message: "Please fill all Info" });
        }

        // ✅ Ensure address is correctly parsed if it's a string
        let parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

        // 🔍 Check if user exists before updating
        let existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // ✅ Ensure `address` exists before updating
        let updateData = {
            name,
            phone,
            gender,
            dob
        };

        if (parsedAddress && typeof parsedAddress === "object") {
            updateData["address.line1"] = parsedAddress.line1 || existingUser.address.line1;
            updateData["address.line2"] = parsedAddress.line2 || existingUser.address.line2;
        }

        // 🔄 Update user info
        let updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        // 📸 Upload image if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $set: { image: imageUpload.secure_url } },
                { new: true }
            );
        }

        res.json({ success: true, message: "Profile Updated", userData: updatedUser });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};










// ---------------Api to Book Appointment-------------

const bookAppointment=async(req,res)=>{

    try {
       
        const{userId,docId,slotDate,slotTime}=req.body
        // console.log(req.body)

        const docData=await doctorModel.findById(docId).select('-password')
        console.log(docData)
        if(!docData.available){
            return res.json({success:false,message:"Doctor not available"})
        }

        let slots_booked=docData.slots_booked

        // checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot not available"})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }


        const userData=await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData={
                userId,docId,
                userData,docData,
                amount:docData.fees,
                slotTime,slotDate,
                date:Date.now()
        }

        const newAppointment=new appointmentModel(appointmentData)
        await newAppointment.save()


        // save new slots data in docData

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:"Appointment Booked"})

        


    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}







// ----------Api to get appointment Details------------

const myAppointment=async(req,res)=>{
    try {

        const {userId}=req.body
        const appointments= await appointmentModel.find({userId})
        res.json({success:true,appointments})
        
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}











// --------------Api to cancel appointmnets---------
const cancelAppointments=async(req,res)=>{
    try {
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)


        // ---verify User-----
        if(appointmentData.userId!==userId){
            return res.json({success:false,message:'Unauthorized action'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        // ----Releasing docSlots------
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData= await doctorModel.findById(docId)
        console.log(doctorData.slots_booked)        
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Cancelled'})
        
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
    


}





// We need to Signup for getting this info
const razorpayInstance=new razorpay({
    key_id:process.env.RAZOR_KEY_ID,
    key_secret:process.env.RAZOR_SECRET_KEY
})


// -------------Api to make online payments-------------
const payment=async(req,res)=>{


    try {
        const{appointmentId}=req.body
        const appointmentData= await appointmentModel.findById(appointmentId)
    
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:'Appointment cancelled or not found'})
        }
    
        // creating options for razorpay
        const options={
            amount:appointmentData.amount*100,
            currency:process.env.CURRENCY,
            receipt:appointmentId,
        }
    
        // creation of oreder
        const order= await razorpayInstance.orders.create(options)
        res.json({success:true,order})

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}









export {userLogin,userRegistration,userInfo,updateUser,bookAppointment,myAppointment,cancelAppointments,payment}