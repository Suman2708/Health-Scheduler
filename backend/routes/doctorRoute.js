import express from 'express';
import upload from '../middlewares/multer.js';
// import authAdmin from '../middlewares/authAdmin.js';
import { appointmentsDoctor, bookAppointment, cancelAppointment, changeAvailability, completeAppointment, doctorDashboard, doctorList ,doctorLogin, doctorProfile, searchPatient, UnAvailableSlots, updateDoctor} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
const doctorRouter=express.Router();


doctorRouter.get('/doctordata',doctorList)
doctorRouter.post('/login',doctorLogin)
doctorRouter.get('/all-appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointments',authDoctor,completeAppointment)
doctorRouter.post('/cancel-appointments',authDoctor,cancelAppointment)
doctorRouter.get('/doctor-dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/doctor-profile',authDoctor,doctorProfile)
doctorRouter.post('/update-doctor',authDoctor,updateDoctor)
doctorRouter.post('/book-doctor',authDoctor,bookAppointment)
doctorRouter.get('/unavailabel-slots',authDoctor,UnAvailableSlots)
doctorRouter.post('/search-patient',authDoctor,searchPatient)

export default doctorRouter