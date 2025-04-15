import doctorModel from "../models/doctorModel.js"
import 'dotenv/config.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/usersSchema.js"
import nodemailer from "nodemailer"


const changeAvailability=async(req,res)=>{

    try {

        const {docId}=req.body
        // console.log(docId)
        const docData=await doctorModel.findById(docId)
        // console.log(docData.available)
        const updatedDoc =await doctorModel.findByIdAndUpdate(docId,{available: !docData.available},{new:true})
        res.json({success:true,message:'Availability Changed', available: updatedDoc.available })
        
    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})
    }

}


const doctorList=async(req,res)=>{
    try {
        
        const doctors= await doctorModel.find({}).select('-password')
        res.status(200).json(doctors)

    } catch (error) {
        
        res.status(500).json("Internal Server Error")
        console.log(error)
    }
}

// -----------Api for doctor Login-------------
const doctorLogin=async(req,res)=>{

    try {
        const{email,password}=req.body
        const doctorData=await doctorModel.findOne({email})
        if(!doctorData){
           return res.json({success:false,message:'No Doctor Exist!'})
        }
        const isMatch= await  bcrypt.compare(password,doctorData.password)
        if(isMatch){
            const token=jwt.sign({id:doctorData._id},process.env.JWT_SECRET)
            res.json({success:true,message:'Login Successfully',token})
        }
        else{
            res.json({success:false,message:'Wrong Password'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}



// --------Api  to get  all the appointments of that doctor-------

const appointmentsDoctor=async(req,res)=>{
    try {
        
        const {docId}=req.body
        const appointments=await appointmentModel.find({docId})
        res.json({success:true,message:'Fteched',appointments})
        console.log(appointments)
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}






// ---------Api to mark appointment complete for doctor model-----
// const completeAppointment=async(req,res)=>{
//     try {
//         const {docId,appointmentId}=req.body
//         const appointmentData=await appointmentModel.findById(appointmentId)
//         if(appointmentData  && appointmentData.docId===docId){
//             await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
//             return res.json({success:true,message:'Appointment Completed',appointmentData:userId})
//         }
//         else{
//             return res.json({success:false,message:'Mark Failed'})
//         }

//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }






const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL, 
    pass: process.env.APP_PASSWORD,
  },
});

const completeAppointment = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const secretKey=process.env.UD_SECRET;
    

    // Fetch appointment details
    const appointmentData = await appointmentModel.findById(appointmentId);
    const userId=await appointmentModel.findById(appointmentId).select("userId");
    if (!appointmentData || appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Mark Failed" });
    }

    // Mark appointment as completed
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
    const token = jwt.sign({ userId, docId }, secretKey, { expiresIn: "24h" });
    console.log(token)
    // Fetch user details
    const userData = await userModel.findById(appointmentData.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Send Email to User
    const reviewLink = `http://localhost:51/review?token=${encodeURIComponent(token)}`;
    console.log(reviewLink)
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: userData.email,
      subject: "Rate Your Recent Appointment",
      html: `
        <p>Dear ${userData.name},</p>
        <p>Your appointment with Dr. ${appointmentData.doctorName} has been marked as completed.</p>
        <p>We would love to hear your feedback! Please rate and review your experience by clicking the link below:</p>
        <a href="${reviewLink}" style="padding:10px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:5px;">Leave a Review</a>
        <p>Thank you!</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email Error:", error);
      } else {
        console.log("Email Sent: " + info.response);
      }
    });

    return res.json({ success: true, message: "Appointment Completed and Review Email Sent" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// -------Api to cancel appointment------

const cancelAppointment=async(req,res)=>{
    try {
        const {docId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData  && appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:'Appointment Cancelled'})
        }
        else{
            return res.json({success:false,message:'Cancellation Failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}




// ---Doctor dashboard------
const doctorDashboard=async(req,res)=>{

    try {
        const {docId}=req.body
        const appointments= await appointmentModel.find({docId})
        let earnings=0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
    })

    let patients=[]
    appointments.map((item)=>{
        if(!patients.includes(item.userId)){
           patients.push(item.userId)
        }
})

    const dashData={
        earnings,
        appointments:appointments.length,
        patients:patients.length,
        latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData})

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }  
}



// ----Api for doctor Profile---------
const doctorProfile=async(req,res)=>{
    try {

        const{docId}=req.body
        const docData= await doctorModel.findById(docId).select('-password')
        res.json({success:true,docData})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// -------api to update doctor Profile from doctor panel----

const updateDoctor=async(req,res)=>{
    try {
        const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:'Profile Updated'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}




// ---------  Controller for  booking of the doctor by doctor personal assitant  ------------






export {changeAvailability,doctorList,
    doctorLogin,appointmentsDoctor,
    completeAppointment,cancelAppointment,
    doctorDashboard,doctorProfile,
    updateDoctor
}