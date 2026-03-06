import validator from 'validator'
import bcrypt from 'bcrypt'
import {userModel} from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import am from '../models/appointementModel.js'
import razorpay from 'razorpay'
import Stripe from 'stripe'
import mongoose from 'mongoose'
// api to register user
 export const registerUser=async(req,res)=>{
    try {
       const{name,email,password}=req.body 
       if(!name||!password||!email){
        return res.json({sucess:false,message:"missing details"})
       }
       //validating email
       if(!validator.isEmail(email)){
        return res.json({sucess:false,message:"enter a valid email"})
       }
       if(password.length<8){
       return  res.json({sucess:false,message:"enter a strong password"})
       }
        // Check if user already exists
       const existingUser = await userModel.findOne({email})
       if(existingUser){
           return res.json({sucess:false,message:"User already exists"})
       }
       //hashing userpassword
       const salt=await bcrypt.genSalt(10);
       const hashedPassword=await bcrypt.hash(password,salt);
       const userData={
        name,
        email,
        password:hashedPassword
       }
       const newuser=new userModel(userData);
       const user=await newuser.save();
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
       res.json({sucess:true,token});

    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error.message})
    }
}
//api to login
export const loginuser=async(req,res)=>{
    try {
        const{email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
    
            return res.json({sucess:false,message:error.message})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
           const token=jwt.sign({id:user._id},process.env.JWT_SECRET) 
           return res.json({sucess:true,token})
        }
        else{
           return  res.json({sucess:false,message:"invalid credentials"})
        }
    } catch (error) {
        console.log(error);
       return  res.json({sucess:false,message:error.message})
    }
}
//api to get userdata
export const getProfile=async(req,res)=>{
    try {
         const token = req.headers.token;
        
        if (!token) {
            return res.json({ sucess: false, message: "Token missing" });
        }
        
        // Decode token to get userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("=== GET PROFILE DEBUG ===");
        console.log("Token received:", !!token);
        console.log("User ID from token:", userId)
        const userdata=await userModel.findById(userId).select('-password')
        res.json({sucess:true,userData:userdata})

    } catch (error) {
        console.log(error);
        res.json({sucess:false,message:error.message});

    }
}
//api to update user profile
export const updateProfile=async(req,res)=>{
    try {
        const {name,phone,address,dob,gender}=req.body;
        const imageFile=req.file
        const imagebody=req.body
        const token = req.headers.token;
         if (!token) {
            return res.json({ sucess: false, message: "Token missing" });
        }
        //getting userid from token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        console.log("User ID:", userId);
         console.log("=== MONGODB ATLAS DEBUG ===");
        console.log("Collection name:", userModel.collection.name);
        console.log("Database name:", userModel.db.databaseName);
        console.log("User ID received:", userId);
        console.log("Request data:", { name, phone, address, dob, gender });
        const user = await userModel.findById(userId);
        console.log("User found:", user ? "YES" : "NO");
        if (!userId) {
            return res.json({ sucess: false, message: "Invalid token" });
        }
        if(!name||!phone||!address||!dob||!gender){
            return res.json({sucess:false,message:"Data Missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //upload image
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId,{image:imageURL})


        }
        res.json({sucess:true,message:"Profile Updated"})

    } catch (error) {
        console.log(error)
        console.log("hi")
        res.json({sucess:false,message:error.message})
    }
}
//api to appointemnt doctor
export const bookApp=async(req,res)=>{
    try{
        const {userId,docId,slotDate,slotTime}=req.body
         console.log("Extracted values:", {userId, docId, slotDate, slotTime})
        
        if (!userId || !docId || !slotDate || !slotTime) {
            return res.json({
                sucess: false, 
                message: "Missing required fields",
                received: {userId: !!userId, docId: !!docId, slotDate: !!slotDate, slotTime: !!slotTime}
            })
        }
        const docData=await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({sucess:false,message:"Doctor Data not Available"})
        }
        let slots_booked=docData.slots_booked
        //checking for slots availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({sucess:false,message:'Slot not availabe'})
            }else{
            slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        const userData=await userModel.findById(userId).select('-password')
        delete docData.slots_booked//why this delete because wee need to store the docdata in apponitmentmodel as well and we do not nedd uncessary data to store in this
        const appointmentData={
            userId,
            docId,
            userData,
            doctorData:docData,//saving the data for later confusing if the doctor changes his profile with updated fees so we our deal is on previous vali na so that must be shown 
            amount:docData.fees,
            slotTime,
            slotDate,
            cancel:false,
            date:Date.now()
        }
        const newappointment=new am(appointmentData)
        newappointment.save()
        //we also nedd to update teh docdata slot
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({sucess:true,message:'appointement booked'})
    }
    catch(error){
        console.log(error)
        console.log("hi")
        res.json({sucess:false,message:error.message}) 
    }
}
// api to get user appointement for frontend my-appointement page
export const listAppointement=async(req,res)=>{
    try{
        console.log('amanchauhanisaman')
        const{userId}=req.body
        const appointement=await am.find({userId,cancel:false})
        res.json({sucess:true,appointement})
    }catch(error){
         console.log(error)
        console.log("hi")
        res.json({sucess:false,message:error.message}) 

    }
}
//api to cancel appointment
export const cancelApp=async(req,res)=>{
    try{
        const {userId,appointementId}=req.body
        const appdata=await am.findById(appointementId)
        //verify appointement user
        if(appdata.userId!=userId) {
            return res.json({sucess:false,message:'unauthorized action'})
        }
        await am.findByIdAndUpdate(appointementId,{cancel:true})
        //releasing doctorSlot
        const {docId,slotDate,slotTime}=appdata
        const doctorData=await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({sucess:true,message:'Appointment Cancelled'})

    }catch{
        console.log(error)
        console.log("hi")
        res.json({sucess:false,message:error.message})
    }
}
//api to make payment of appointement using razorpay
const stripe=new Stripe(
    process.env.STRIPE_SECRET_KEY
)
const payment=async(req,res)=>{
    try{

    }catch(error){
        console.log(error)
        console.log("hi")
        res.json({sucess:false,message:error.message})
    }
}
