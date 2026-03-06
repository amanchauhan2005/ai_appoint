import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
import { useState,useEffect } from "react";
import { use } from "react";
export const AppContext=createContext()
export const AppContextProvider=(props)=>{
    const [token,settoken]= useState(localStorage.getItem('token')?localStorage.getItem('token'):null)
    console.log("Token:", localStorage.getItem('token'))
    const currency='$'
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [doctors,setdoctors]=useState([])
    const[userData,setUserData]=useState(null)
    const getDoctorsData=async()=>{
        try {
            console.log('Attempting to fetch from:', backendUrl + "/api/doctor/list")
            const{data}=await axios.get(backendUrl+"/api/doctor/list")
            if(data.sucess){
                setdoctors(data.doctors)
            }else{
                console.log("hiaman2");
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const loadUserProfileData=async()=>{
        try {
            console.log("=== LOADING USER PROFILE ===");
            console.log("Token being sent:", token);
            console.log("Backend URL:", backendUrl);
            console.log("Full request URL:", backendUrl+'/api/user/get-profile',{headers:{token}});
            
            const {data}=await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
            
            console.log("=== API RESPONSE RECEIVED ===");
            console.log("Full response:", data);
            console.log("Success field:", data.success);
            console.log("UserData field:", data.userData);
            
            if(data.sucess){
                console.log("✅ Success! Setting userData:", data.userData);
                setUserData(data.userData)
            }else{
                console.log("❌ API returned false, message:", data.message);
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log("=== API ERROR ===");
            console.log("Error:", error);
            console.log("Error message:", error.message);
            console.log("Error response:", error.response?.data);
            console.log("Error status:", error.response?.status);
            toast.error(error.message)
        }

    }
    const value={
        doctors:doctors,
        getDoctorsData,
        currency:currency,
        token,settoken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData
    }
    useEffect(()=>{
        getDoctorsData()
    },[])
    useEffect(()=>{
        if(token){
            console.log("=== DEBUG INFO ===");
            console.log("localStorage token:", localStorage.getItem('token'));
            console.log("React state token:", token);
            console.log("Are they equal?", localStorage.getItem('token') === token);
            loadUserProfileData()
        }else{
            console.log("not received");
            setUserData(false)
        }

    },[token])
    return(
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
      )
}