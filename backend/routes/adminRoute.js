// const express=require('express')
// const addDoctor=require('../controllers/adminController')
// const upload=require('../middlewares/multer.js')
// const adminRouter= express.Router();



import express from 'express';
import {addDoctor,adminDashboard,allAppointment,deleteAppointment,loginAdmin, ReterivedDoctors} from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';
const adminRouter= express.Router();


adminRouter.post('/add-doctors',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.get('/doctorslist',authAdmin,ReterivedDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/allappointment',authAdmin,allAppointment)
adminRouter.post('/cancel-appointment',authAdmin,deleteAppointment)
adminRouter.get('/dashboard',authAdmin,adminDashboard)


// module.exports=adminRouter
export default adminRouter;





