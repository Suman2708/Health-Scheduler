import 'dotenv/config'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/usersSchema.js'
import mongoose from 'mongoose'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import reviewModel from '../models/reviewModel.js'
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



// ---Api for finding Available Slots------
const AvailableSlots = async (req, res) => {
    try {
        const { docId, date } = req.query;

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
        console.log(slots)
        res.json({ success: true, message: "Slots available", slots });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};






// Function to find two available dates


const getAvailableSlots = async (req, res) => {
    const { docId } = req.query; 

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const availableDays = [];
        let daysChecked = 0;

        while (availableDays.length < 2) {
            let checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() + daysChecked); // Increment date

            const doctor = await doctorModel.findById(docId);

            if (!doctor) {
                return res.status(404).json({ success: false, message: "Doctor not found" });
            }

            const dateKey = checkDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
            const bookedSlots = doctor.slots_booked[dateKey] || [];

            const allSlots = [ "10:00 AM","10:30 AM", "11:00 AM","11:30 AM", "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
                               "02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM",
                               "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM"]; // Example slots
            const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

            if (availableSlots.length > 0) {
                availableDays.push({ date: dateKey, slots: availableSlots });
            }

            daysChecked++; // Move to the next day
        }

        return res.json({ success: true, availableSlots: availableDays });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const reAppointment=async(req,res)=>{
    try {
        const { userId } = req.body;
        const {docId}=req.query;

        const lastPaidAppointment = await appointmentModel.findOne({
            userId,
             docId,
        });
        console.log(lastPaidAppointment.slotDate)
        // console.log(lastPaidAppointment.payment)
        const [day, month, year] = lastPaidAppointment.slotDate.split("_").map(Number);
    const slotDate = new Date(year, month , day); // Month is 0-based in JavaScript
    console.log(userId)

    console.log(slotDate); // Now it will be a valid Date object



        const today = new Date();
today.setHours(0, 0, 0, 0);
    const fifteenDaysAgo = new Date();
fifteenDaysAgo.setDate(slotDate.getDate() + 15);
console.log(today<=fifteenDaysAgo )

        if (lastPaidAppointment  ) {
            // Fetch available slots for the next 2 days
            // const availableSlots = await getAvailableSlots(doctorId);

            return res.json({
                success: true,
                message: "You have a free follow-up option. Please choose from available slots.",
                lastPaidAppointment
            });
        }

        // If no paid appointment, book a new paid appointment
        return res.json({ success: false, message: "Please book a paid appointment first." });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}





// ---------------Api to Book Appointment-------------
const bookAppointment = async (req, res) => {
    try {
      const { userId, docId, slotDate, slotTime } = req.body;
  
      const docData = await doctorModel.findById(docId).select("-password");
      if (!docData.available) {
        return res.json({ success: false, message: "Doctor not available" });
      }
  
      let slots_booked = docData.slots_booked;
  
      // ✅ Convert `slotDate` to local date format (No UTC issues)
      let correctDate = new Date(slotDate);
      correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
      let formattedDate = correctDate.toISOString().split("T")[0]; 
    //   console.log(formattedDate)
  
  
      // ✅ Checking for slot availability
      if (slots_booked[formattedDate]) {
        if (slots_booked[formattedDate].includes(slotTime)) {
          return res.json({ success: false, message: "Slot not available" });
        } else {
          slots_booked[formattedDate].push(slotTime);
        }
      } else {
        slots_booked[formattedDate] = [];
        slots_booked[formattedDate].push(slotTime);
      }
  
      const userData = await userModel.findById(userId).select("-password");
  
      delete docData.slots_booked;
  
      const appointmentData = {
        userId,
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
  
      // ✅ Save new slots data in `docData`
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
  
      res.json({ success: true, message: "Appointment Booked" });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  







// ----------Api to get appointment Details------------

const myAppointment=async(req,res)=>{
    try {

        const { userId } = req.body;
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



// Api for storing the rating and review for a  doctor

const ratingAndReview = async (req, res) => {
    try {
      const { doctorId, userId, rating, comment } = req.body;
  
      if (!rating || !comment) {
        return res.json({ success: false, message: "Fill all details" });
      }
  
      const ratingData = { userId, rating, comment, createdAt: new Date() };
  
      const existingReview = await reviewModel.findById(doctorId);
  
      if (existingReview) {
        existingReview.reviews.push(ratingData);
        await existingReview.save();
        return res.json({ success: true, message: "Review added successfully" });
      } else {
        const newReview = new reviewModel({ _id: doctorId, reviews: [ratingData] });
        await newReview.save();
        return res.json({ success: true, message: "New review collection created successfully" });
      }
    } catch (error) {
      res.json({ success: false, message: "Not Updated" });
      console.log(error);
    }
  };


const seeRating=async(req,res)=>{
    try {
        const {doctorId}=req.query
    const data2= await reviewModel.findById(doctorId)
    res.json({success:true,message:"Sent SuccessFully",data2})
    } catch (error) {
        res.json({success:false,message:"Not Fetched"})
         console.log(error)
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









export {userLogin,userRegistration,userInfo,updateUser,bookAppointment,myAppointment,cancelAppointments,
    payment,ratingAndReview,seeRating,AvailableSlots,reAppointment,getAvailableSlots }