// const validator=require('validator')
// const cloudinary = require('../config/cloudinary')
// const bcrypt=require('bcrypt')
// // const { now } = require('mongoose')
// const doctorModel = require('../models/doctorModel')
// const upload = require('../middlewares/multer.js'); 


import validator from 'validator';
import cloudinary from 'cloudinary'
import bcrypt from 'bcrypt';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/usersSchema.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import appointmentModel from '../models/appointmentModel.js';




// ----API for adding Doctors------


const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "uploads",
            timeout: 60000
        });
        console.log("Cloudinary Upload Result:", result);
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};


const addDoctor= async(req,res)=>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const filePath=req.file
        
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
           return res.json({success:false,message:"Please Fill all details"})
        }
        if(!validator.isEmail(email)){
           return res.json({success:false,message:"Incorrect Email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Choose the strong Password"})
        }


        //Hashing Password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);


        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("File uploaded:", req.file); // Debugging line

        const imageUrl = await uploadToCloudinary(req.file.path);
          


        const doctorData={
            name,
            email,
            password:hashedPassword,
            image:imageUrl,
            speciality,
            degree,
            experience,
            date:Date.now(),
            fees,
            about,
            address:JSON.parse(address)
        }

        const newDoctor=new doctorModel(doctorData);
        await newDoctor.save()
        res.json({success:true,message:"Data saved sucessfully"})
        
        

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Data not saved"})
    }
} 





//------API for Admin Login--------

const loginAdmin=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL  && password===process.env.ADMIN_PASS){

                const token=jwt.sign(email+password,process.env.JWT_SECRET)
                res.json({success:true,token})

        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}




// --------Api for reteriving Doctors Form Database-----

const ReterivedDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password'); 
        // console.log(doctors); 
        res.status(200).json(doctors); 
    } catch (error) {
        console.error("Error retrieving doctors:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
};


const allAppointment=async(req,res)=>{
    try {
        const allAppointment= await appointmentModel.find({})
        // console.log(allAppointment)
    res.json({success:true,message:'Fetched',allAppointment})
    } catch (error) {
        console.error("Error retrieving doctors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}



const deleteAppointment=async(req,res)=>{
    try {
        const {appointmentId}=req.body
        const appointmentData= await appointmentModel.findById(appointmentId)
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});

        const doctorId=appointmentData.docId
        const {slotDate,slotTime}=appointmentData
        const doctorData= await doctorModel.findById(doctorId)
        console.log(doctorData.slots_booked)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=> e!==slotTime)

        await doctorModel.findByIdAndUpdate(doctorId,{slots_booked})
        res.json({success:true,message:'Appointment Cancelled'})
        
    } catch (error) {
        console.error("Error retrieving doctors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}




//  Api to get dashboard data  for admin panel
const adminDashboard=async(req,res)=>{
    try {
        const doctors= await doctorModel.find({})
        const users= await userModel.find({})
        const appointments= await appointmentModel.find({})

        const dashData={
            doctors:doctors.length,
            patient:users.length,
            appointments:appointments.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        console.log(dashData.latestAppointments)
        res.json({success:true,dashData})
    } catch (error) {
        console.error("Error retrieving doctors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



export  {addDoctor,loginAdmin,ReterivedDoctors,allAppointment,deleteAppointment,adminDashboard}
