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
import Razorpay from 'razorpay'




// // -----------User Registration-----------------
// const userRegistration=async(req,res)=>{

//     try {

//         const {name,email,password}=req.body

//     if(!name || !email || !password){
//        return res.json('Please fill all the details')
//     }

//     if(!validator.isEmail(email)){
//         return res.json({success:false,message:'Please check the Email'})
//     }

//     if(password.length<8){
//         return res.json({success:false,message:'Please choose a strong password'})
//     }

//     const salt=await bcrypt.genSalt(10)
//     const hashedPassword= await bcrypt.hash(password,salt);

//     const userData={
//         name:name,
//         email:email,
//         password:hashedPassword
//     }

//     const newUser= new userModel(userData)
//    const user= await newUser.save();
//     const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//     // console.log(token)
//     res.json({success:true,message:"Registered Successfully",token})
        
//     } catch (error) {
//         res.json({success:false,message:"Not Registered"})
//         console.log(error)
//     }
    
// }









// // const userLogin=async(req,res)=>{
// //     try {
// //          const {email,password}=req.body
// //          const user= await userModel.findOne({email})
// //          if(!user){
// //            return res.json({success:false,message:'User does not exist'})
// //          }
// //          const isMatch=await bcrypt.compare(password,user.password)
// //          if(isMatch){
// //             const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
// //            return res.status(200).json("Login Successfully",token)
// //          }
// //          else{
// //             res.json({success:false,message:"Please fill the correct password"})
// //          }
    
// //     } catch (error) {
// //         console.log(error)
// //         res.json({success:false,message:error.message})
// //     }
   
// // }






// async function userLogin(req, res) {
//     const { email, password } = req.body;

//     try {
//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         if (!password || !user.password) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // ✅ Corrected response
//         const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//         // console.log(token)
//         res.json({success:true,message:"Login Successfully",token})

//     } catch (error) {
//         console.error("Login Error:", error);
//         return res.status(500).json({ message: "Server error" });
//     }
// }
 const userRegistration = async (req, res) => {
  try {
      const { name, phone } = req.body;

      if (!name || !phone) {
          return res.status(400).json({ success: false, message: 'Please provide name and phone number' });
      }

      const existingUser = await userModel.findOne({ name, phone });

      if (existingUser) {
          return res.status(400).json({ success: false, message: 'User with this name and phone number already exists' });
      }

      const userData = {
          name,
          phone
      };

      const newUser = new userModel(userData);
      const user = await newUser.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({ success: true, message: "Registered Successfully", token });
  } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ----------- User Login -----------
const userLogin = async (req, res) => {
  try {
      const { name, phone } = req.body;

      if (!name || !phone) {
          return res.status(400).json({ success: false, message: 'Please provide name and phone number' });
      }

      const user = await userModel.findOne({ name, phone });

      if (!user) {
          return res.status(400).json({ success: false, message: "User not found" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.status(200).json({ success: true, message: "Login Successfully", token });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


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
        // console.log(slots)
        res.json({ success: true, message: "Slots available", slots });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};






// ---------------------------Function to find two available dates for ReAppointment--------------------------------




const getAvailableDates = async (req, res) => {
    const { docId } = req.query;
  
    try {
      const doctor = await doctorModel.findById(docId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
    //   console.log(doctor)
      const today = new Date();
      const availableDates = [];
      let checkedDays = 0;
  
      while (availableDates.length < 2 && checkedDays < 30) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + checkedDays);
        const selectedDate = new Date(currentDate);
        selectedDate.setHours(0, 0, 0, 0);
  
        // Build slot range from 10:00 AM to 9:00 PM
        const isToday = selectedDate.toDateString() === today.toDateString();
  
        let startTime = new Date(selectedDate);
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
  
        if (isToday) {
          if (currentHour < 10) {
            startTime.setHours(10, 0, 0, 0);
          } else {
            let minutes = currentMinute <= 30 ? 30 : 0;
            let hour = minutes === 0 ? currentHour + 1 : currentHour;
            startTime.setHours(hour, minutes, 0, 0);
          }
        } else {
          startTime.setHours(10, 0, 0, 0);
        }
  
        const endTime = new Date(selectedDate);
        endTime.setHours(21, 0, 0, 0);
  
        const slots = [];
        while (startTime < endTime) {
          const time = startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
          slots.push(time);
          startTime.setMinutes(startTime.getMinutes() + 30);
        }
  
        const dateKey = `${String(selectedDate.getUTCDate()).padStart(2, '0')}_${String(selectedDate.getUTCMonth() + 1).padStart(2, '0')}_${selectedDate.getUTCFullYear()}`;
        // console.log(dateKey)
        const bookedSlots = doctor.slots_booked?.[dateKey] || [];
        const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));
  
        if (availableSlots.length > 0) {
          availableDates.push({
            date: selectedDate.getFullYear() + "-" + 
            String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" + 
            String(selectedDate.getDate()).padStart(2, '0') // "YYYY-MM-DD"
          });
        }
  
        checkedDays++;
      }
    //   console.log(availableDates)
  
      return res.json({ success: true, availableDates });
  
    } catch (error) {
      console.error("Error in getAvailableDates:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  
  



  // ----------functions to get the two dates on which the doctor has free slots  for booking the free appointment--------------

const getAvailableSlots = async (req, res) => {
    const { docId, date } = req.query;
    // console.log(docId);
    // console.log(date)
    const selectedDate=new Date(date);
    // let correctDate= new Date(formattedDate);
    //   correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
    //   let selectedDate = correctDate.toISOString().split("T")[0]; 
        // console.log(selectedDate)

    try {
      if (!selectedDate) {
        return res.status(400).json({ success: false, message: "Selected date is required" });
      }
  
      const doctor = await doctorModel.findById(docId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
  
      const selected = new Date(selectedDate);
      const today = new Date();
      const isToday = selected.toDateString() === today.toDateString();
  
      let startTime = new Date(selected);
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
  
      if (isToday) {
        if (currentHour < 10) {
          startTime.setHours(10, 0, 0, 0);
        } else {
          let minutes = currentMinute <= 30 ? 30 : 0;
          let hour = minutes === 0 ? currentHour + 1 : currentHour;
          startTime.setHours(hour, minutes, 0, 0);
        }
      } else {
        startTime.setHours(10, 0, 0, 0);
      }
  
      const endTime = new Date(selected);
      endTime.setHours(21, 0, 0, 0);
  
      const slots = [];
      while (startTime < endTime) {
        const time = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        slots.push(time);
        startTime.setMinutes(startTime.getMinutes() + 30);
      }
  
    //   const dateKey = `${String(selected.getUTCDate()).padStart(2, '0')}_${String(selected.getUTCMonth() + 1).padStart(2, '0')}_${selected.getUTCFullYear()}`;
    const dateKey= selected.getFullYear() + "-" + 
    String(selected.getMonth() + 1).padStart(2, '0') + "-" + 
    String(selected.getDate()).padStart(2, '0')
    // console.log(dateKey)
      const bookedSlots = doctor.slots_booked?.[dateKey] || [];
      // console.log(bookedSlots)
      const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));
      // console.log(availableSlots)
  
      return res.json({ success: true,message:"Successful", availableSlots });
  
    } catch (error) {
      console.error("Error in getAvailableSlots:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  



  // -----------Controller for checking to whether is valid for booking the free appointment for a doctor ------------
const reAppointment=async(req,res)=>{
    try {
        const { userId } = req.body;
        const {docId}=req.query;

        const lastPaidAppointment = await appointmentModel.findOne({
            userId,
             docId,
        });
        // console.log(lastPaidAppointment.slotDate)
        // console.log(lastPaidAppointment.previous_date)
      if(lastPaidAppointment.previous_date){
                const [year, month, day] = lastPaidAppointment.previous_date.split("-").map(Number);
        const slotDate = new Date(year, month - 1, day);  // Month should be zero-based


const fifteenDaysAgo = new Date(slotDate);
fifteenDaysAgo.setDate(slotDate.getDate() + 15);

const today = new Date();


        if (lastPaidAppointment.payment &&  today <= fifteenDaysAgo ) {
            // Fetch available slots for the next 2 days
            // const availableSlots = await getAvailableSlots(doctorId);

            return res.json({
                success: true,
                message: "You have a free follow-up option. Please choose from available slots.",
                lastPaidAppointment
            });
        }
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

      const appointment=await appointmentModel.findOne({userId,docId,isCompleted: false,cancelled:false});
      if(appointment){
        return res.json({success:true,message:"Slots Already Booked"});
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





const bookReAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const appointment=await appointmentModel.findOne({userId,docId,isCompleted: false,cancelled:false});
    if(appointment){
      return res.json({success:true,message:"Slots Already Booked"});
    }


    let slots_booked = docData.slots_booked;

    // ✅ Format date
    let correctDate = new Date(slotDate);
    correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
    let formattedDate = correctDate.toISOString().split("T")[0];

    // ✅ Check if slot is available
    if (slots_booked[formattedDate]) {
      if (slots_booked[formattedDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[formattedDate].push(slotTime);
      }
    } else {
      slots_booked[formattedDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    // ✅ Check for previous appointment
    const previousAppointment = await appointmentModel
      .findOne({ userId, docId })
      .sort({ date: -1 }); // latest appointment

    let autoPayment = false;
    let previous_date = formattedDate; // default to this appointment's date

    if (previousAppointment && previousAppointment.payment) {
      const prevDate = new Date(previousAppointment.previous_date || previousAppointment.slotDate);
      const today = new Date();

      const diffInDays = Math.floor((today - prevDate) / (1000 * 60 * 60 * 24));

      if (diffInDays <= 15) {
        autoPayment = true;
        previous_date = previousAppointment.previous_date || previousAppointment.slotDate;
      }
    }

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate: formattedDate,
      previous_date,
      date: new Date(),
      payment: autoPayment,
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







// ----------------   Not in the use as to be correct (it needed to be correct or to be removed ) -----------------
const getReAppointment = async (req, res) => {
  try {
    const { userId, docId } = req.query;

    if (!userId || !docId) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    const appointment = await appointmentModel.findOne({ userId, docId });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    return res.status(200).json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



  







// ----------Api to get appointment Details------------

const myAppointment=async(req,res)=>{
    try {

        const { userId} = req.body;
        const appointments = await appointmentModel.find({ 
          userId, 
          isCompleted: false 
        });
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
        // console.log(doctorData.slots_booked)        
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





// Razorpay instance setup (make sure this is defined at the top of your file)
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_SECRET_KEY
});

// ------------- API to make online payments -------------
const payment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Fetch appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment cancelled or not found' });
    }

    // Creating options for Razorpay order
    const options = {
      amount: appointmentData.amount * 100, // amount in paise
      currency: process.env.CURRENCY || 'INR',
      receipt: appointmentId
    };

    // ⚠️ Wait for the order to be created
    const order = await razorpayInstance.orders.create(options);

    // Send order details to frontend
    res.json({ success: true, order });

  } catch (error) {
    console.error("Payment Error:", error);

    // Optional: Send better error message to frontend
    if (error?.error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.error.description || 'Payment failed',
      });
    }

    res.status(500).json({ success: false, message: 'Unexpected server error' });
  }
};





// ------Api to verify the Payment--------
const verifyPayment=async(req,res)=>{
  try {
    const {razorpay_order_id}=req.body
    const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id)
    console.log(orderInfo)

    if(orderInfo.status==='paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:"Payment Successful"})
    }else{
      res.json({success:false,message:"Payment Failed"})
    }
    
  } catch (error) {
    res.json({success:false,message:error.message})
         console.log(error)
  }
}









export {userLogin,userRegistration,userInfo,updateUser,bookAppointment,myAppointment,cancelAppointments,
    payment,ratingAndReview,seeRating,AvailableSlots,reAppointment,getAvailableSlots,getAvailableDates,
    getReAppointment,bookReAppointment,verifyPayment }