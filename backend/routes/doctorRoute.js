import express from 'express';
import upload from '../middlewares/multer.js';
// import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability, doctorList } from '../controllers/doctorController.js';
const doctorRouter=express.Router();


doctorRouter.get('/doctordata',doctorList)

export default doctorRouter