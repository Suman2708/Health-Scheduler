import express from 'express'
import { userRegistration,userLogin, userInfo, updateUser, bookAppointment, myAppointment, cancelAppointments, payment, ratingAndReview, seeRating, AvailableSlots, reAppointment, getAvailableSlots } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
const userRouter=express.Router()


userRouter.post('/register',userRegistration)
userRouter.post('/login',userLogin)
userRouter.get('/userinfo',authUser,userInfo)
userRouter.post('/updateuser',upload.single('image'),authUser,updateUser)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,myAppointment)
userRouter.post('/cancel',authUser,cancelAppointments)
userRouter.post('/payment',authUser,payment)
userRouter.post('/submit-review',authUser,ratingAndReview)
userRouter.get('/see-rating',authUser,seeRating)
userRouter.get('/slots-unavailable',AvailableSlots)
userRouter.get('/appointment-again',authUser,reAppointment)
userRouter.get('/available-dates',authUser,getAvailableSlots)
export default userRouter