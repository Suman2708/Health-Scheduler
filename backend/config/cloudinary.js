// const cloudinary =require('cloudinary').v2
// require('dotenv').config();

import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';



const connectCloudinary = async() => {
  try {
     cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET_KEY,
    });
  
    console.log('Cloudinary Connected Successfully');
    console.log("Cloudinary Config:", cloudinary.config());
  
  } catch (error) {
    console.log("err",error)
  }
   
}
  // module.exports = connectCloudinary
  export default connectCloudinary;