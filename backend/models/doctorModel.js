// const mongoose=require('mongoose')


import mongoose from "mongoose";


const doctorSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,Unique:true},
    password:{type:String,required:true},
    image:{type:String,required:true},
    speciality:{type:String,required:true},
    degree:{type:String,required:true},
    experience:{type:String,required:true},
    about:{type:String,required:true},
    available:{type:Boolean,default:true},
    fees:{type:Number,required:true},
    address:{type:Object,required:true},
    date:{type:Date,required:true},
    slots_booked:{type:Object,default:{}}
},{minimize:false})


// const doctorSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     image: { type: String, required: true },
//     speciality: { type: String, required: true },
//     degree: { type: String, required: true },
//     experience: { type: String, required: true },
//     about: { type: String, required: true },
//     available: { type: Boolean, default: true },
//     fees: { type: Number, required: true },
//     address: { type: Object, required: true },
//     date: { type: Date, required: true },
//     slots_booked: { type: Object, default: {} },

//     // New fields for ratings and comments
//     ratings: {
//         averageRating: { type: Number, default: 0 }, // Average rating (computed from reviews)
//         totalReviews: { type: Number, default: 0 }   // Total number of ratings received
//     },
//     reviews: [
//         {
//             userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who posted the review
//             rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
//             comment: { type: String, required: true }, // Review text
//             createdAt: { type: Date, default: Date.now } // Timestamp
//         }
//     ]
// }, { minimize: false });

const doctorModel= mongoose.model.doctor ||  mongoose.model('doctor',doctorSchema)

// module.exports=doctorModel

export default doctorModel;