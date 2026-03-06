import express from 'express'
import { Router } from 'express'
import { registerUser,loginuser, getProfile,updateProfile,bookApp,listAppointement,cancelApp} from '../controllers/usercontroller.js'
import { authUser } from '../middleware/authuser.js'
import upload from '../middleware/multer.js'
const userRouter=express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginuser)
userRouter.get('/get-profile',getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/bookapp',authUser,bookApp)
userRouter.get('/appointement',authUser,listAppointement)
userRouter.post('/cancel-app',authUser,cancelApp)
export default userRouter