import React from "react";
import { useContext,useState,useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {toast} from 'react-toastify'
import axios from 'axios'

const Myappointement = () => {
  const { doctors,backendUrl,token } = useContext(AppContext);
  const[appointement,setAppointement]=useState([])
  const getuserApp=async()=>{
    try{
      console.log('aman')
      const {data}=await axios.get(backendUrl+'/api/user/appointement',{headers:{token}})
      console.log({data})
      if(data.sucess){
        setAppointement(data.appointement.reverse())
        console.log(data.appointement)

      }
    }catch(error){
      console.log(error)
      toast.error(error.message)

    }
  }
  const cancelapp=async(appointementId)=>{
    try{
      console.log(appointementId)
      const {data}=await axios.post(backendUrl+'/api/user/cancel-app',{appointementId},{headers:{token}})
      console.log({data})
      if(data.sucess){
        toast.success(data.message)
        getuserApp()
      }else{
        toast.error(data.message) 
      }
    }catch(error){
      console.log(error)
      toast.error(error.message)
    }

  }
  useEffect(()=>{
    if(token){
      getuserApp()
    }
  },[token])
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b"> My appointements</p>
      <div>
        {appointement.map((items, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4  sm:flex sm:gap-6 py-2 border-b'>
            <div  className='grid grid-cols-[1fr_2fr] gap-4  sm:flex sm:gap-6 py-2 border-b' key={index}>
              <img className='w-32 bg-indigo-50' src={items.doctorData.image}></img>
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{items.doctorData.name}</p>
              <p>{items.doctorData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{items.doctorData.address.line1}</p>
              <p className='text-xs'>{items.doctorData.address.line2}</p>
              <p className='text-'><span>Date&Time:</span>{items.slotDate}|{items.slotTime}</p>
            </div>
            <div>
            </div>
            <div className="flex flex-col gap-2 justify-end ">
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              <button  onClick={()=>cancelapp(items._id)}className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myappointement;
