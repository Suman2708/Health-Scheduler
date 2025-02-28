import express from 'express'
import { userRegistration,userLogin, userInfo, updateUser, bookAppointment, myAppointment, cancelAppointments, payment } from '../controllers/userController.js'
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

export default userRouter