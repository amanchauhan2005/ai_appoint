import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken' 
import 'dotenv/config'
 const addDoctor=async(req,res)=>{
   console.log('aman')
    try {
     const{name,email,password,speciality,degree,experience,about,fees,address}=req.body
     const imageFile=req.file
     console.log(imageFile)
     cloudinary.config({
        cloud_name: 'dv4w78jfr',
        api_key: '423994487479825',
        api_secret: 'LmcMhfC65oNggf7ey_zoCKTHSLs'
    })
     //checking for all data to add doctor
     if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!address){
        return res.json({msg1:"missing details",sucess1:false})
     }
     //validating email format by validator
     if(!validator.isEmail(email)){
        return res.json({msg1:"Enter valid email",sucess1:false})
     }
     //validating strong password
     if(password.length<8){
        return res.json({msg1:"Enter valid password",sucess1:false})
     }
     //genearting salt 
     const salt=await bcrypt.genSalt(10)
     const hashedPassword=await bcrypt.hash(password,salt)
     console.log(hashedPassword)
     //uploding image to cloudinary
     const imageUpload=await cloudinary.uploader.upload(imageFile.path,{ folder: 'doctors',
        resource_type: 'auto',
        timeout: 60000})
     const imageUrl=imageUpload.secure_url
      
     console.log(imageUrl)
     const doctorData={
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
     }
     const newDoctor=new doctorModel(doctorData)
     await newDoctor.save()
     res.json({sucess:true,message:"doctor added"})
     console.log({name,email,password,speciality,degree,experience,about,fees,address},imageFile)
    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error.message})
    }
 }
 //API FOR admin login
 const loginAdmin=async(req,res)=>{
    try {
       const {email,password}=req.body
       if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD) {
        //console.log('JWT SECRET:',process.env.JWT_SECRET)
       //payload in aut
        const token=jwt.sign(email+password,'aman')
       // console.log(token)
        res.json({token1:token,sucess:true,message:"get details"})

       }else{
        res.json({message:'Invalid Crediantials',sucess:false})
       }
    } catch (error) {
        console.log(error)
        res.json({message:'error',sucess:false})
    }
 }
 //API TO GET ALL DOCTORS LIST FOR ADMINPANEL
 const allDoctors=async(req,res)=>{
   try {
      const doctors=await doctorModel.find({}).select('-password')
      res.json({sucess:true,doctors})
   } catch (error) {
      console.log(error)
      res.json({sucess:false,message:error.message})
   }
 }
 
 export{
    addDoctor,
    loginAdmin,
    allDoctors
 }
