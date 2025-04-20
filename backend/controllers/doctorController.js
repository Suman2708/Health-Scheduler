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
    // console.log(token)
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





// ------- controller for finding the unavailable slots -----------------

const UnAvailableSlots = async (req, res) => {
    try {
        const {docId}=req.body
        const { date } = req.query;

        const docData = await doctorModel.findById(docId).select("slots_booked");
        if (!docData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let formattedDate;

        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            formattedDate = date; // Use as is if already in correct format
        } else {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ success: false, message: "Invalid date format" });
            }

            // Convert to local time before formatting to YYYY-MM-DD
            parsedDate.setMinutes(parsedDate.getMinutes() + parsedDate.getTimezoneOffset());

            formattedDate = parsedDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
        }

        // console.log("Formatted Date Key:", formattedDate);

        const slots = docData.slots_booked[formattedDate];
        // console.log(slots)
        res.json({ success: true, message: "Slots available", slots });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};





// ---------  Controller for  booking of the doctor by doctor personal assitant  ------------

const bookAppointment = async (req, res) => {
  try {
    const { name, phone, docId, slotDate, slotTime } = req.body;

    // 🔍 Step 1: Check if user already exists by phone
    let userData = await userModel.findOne({ phone });

    if (!userData) {
      // 🧾 Step 2: Create new user
      userData = new userModel({ name, phone });
      await userData.save();
    }

    // 🪙 Step 3: Generate JWT token
    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData?.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    // ⛔ Step 4: Prevent duplicate appointments
    const existingAppointment = await appointmentModel.findOne({
      userId: userData._id,
      docId,
      isCompleted: false,
      cancelled: false,
    });

    if (existingAppointment) {
      return res.json({ success: true, message: "Slots Already Booked" });
    }

    let slots_booked = docData.slots_booked;

    // ✅ Step 5: Format date and check slot
    let correctDate = new Date(slotDate);
    correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
    let formattedDate = correctDate.toISOString().split("T")[0];

    if (slots_booked[formattedDate]) {
      if (slots_booked[formattedDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[formattedDate].push(slotTime);
      }
    } else {
      slots_booked[formattedDate] = [slotTime];
    }

    delete docData.slots_booked;

    const appointmentData = {
      userId: userData._id,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate: formattedDate,
      date: new Date(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({
      success: true,
      message: "Appointment Booked",
      token, // 🔐 Send token back
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






// --------  Controller to search the patient whether it  has booked any appointment with this doctor or not --------
const searchPatient = async (req, res) => {
    const { name, phone} = req.body;
    const {docId}=req.body;
    // console.log(name,phone,o)

    // Validate input data before querying the database
    if (!name || !phone || !docId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: name, phone, or docId",
        });
    }

    try {
        const patient0= await userModel.findOne({name,phone});
        console.log(patient0)
        const patient = await appointmentModel.find({
            // patient0._id,
            docId
        });
        console.log(patient)

        if (patient) {
            return res.json({
                success: true,
                patient
            });
        } else {
            return res.json({
                success: false,
                message: "No patient found with the given details"
            });
        }
    } catch (error) {
        console.error("Booking Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching for the patient"
        });
    }
};






export {changeAvailability,doctorList,
    doctorLogin,appointmentsDoctor,
    completeAppointment,cancelAppointment,
    doctorDashboard,doctorProfile,
    updateDoctor,bookAppointment,UnAvailableSlots,
    searchPatient
}