// const mongoose =require('mongoose');
// require('dotenv').config();


import mongoose from 'mongoose';
import 'dotenv/config';


const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database Connected"); 
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1);
    }
}

// module.exports = connectDB;
export default connectDB;