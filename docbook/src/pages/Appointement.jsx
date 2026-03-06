import React, { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import Releateddoctor from '../components/Releateddoctor'
import {toast} from 'react-toastify'
import axios from "axios";
const Appointement = () => {
  const { id } = useParams();
  const { doctors, currency,getDoctorsData,loadUserProfileData,userData,token,backendUrl} = useContext(AppContext);
  const daysofweek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docslot, setdocslot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate=useNavigate()
  const fetchDocInfo = async () => {
    console.log("fetchDocInfo started with:", {
      docId: id,
      availableDoctors: doctors,
    });
    const docInfo2 = doctors.find((doc) => {
      console.log("Comparing:", {
        docId: doc._id,
        paramId: id,
        matches: doc._id === id,
      });
      return doc._id === id;
    });
    setDocInfo(docInfo2);
    console.log(docInfo);
  };
  const getAvailableSlot = async () => {
    setdocslot([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      //setting end time of the date
      let endtime = new Date();
      endtime.setDate(today.getDate() + i);
      endtime.setHours(21, 0, 0, 0);
      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeslot = [];
      while (currentDate < endtime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day=currentDate.getDay()
        let month=currentDate.getMonth()+1
        let year=currentDate.getFullYear()
        const slotDate=day+"_"+month+"_"+year
        const slotTime=formattedTime
        console.log(docInfo.slots_booked[slotDate])
        const isSlotAvailable=docInfo.slots_booked[slotDate]&&docInfo.slots_booked[slotDate].includes(slotTime)?false:true
        if(isSlotAvailable){
           timeslot.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setdocslot((prev) => [...prev, timeslot]);
    }
  };
  const bookapp=async()=>{
    if(!token){
      toast.warn('Login to book appointement')
      return navigate('/login')
    }
    try{
      console.log("hi")
      console.log({docslot})
      const date=docslot[1][0].datetime
      let day=date.getDate()
      let month=date.getMonth()+1
      let year=date.getFullYear()
      const slotDate=day+"_"+month+"_"+year
      console.log(slotDate)
      const {data}=await axios.post(backendUrl+'/api/user/bookapp',{docId:id,slotDate,slotTime},{headers:{token}})
      if(data.sucess){
        toast.success(data.message)
       getDoctorsData()
        navigate('/Myappointement')
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, id]);
  useEffect(() => {
    getAvailableSlot();
  }, [docInfo]);
  console.log("After effect:", docslot);
  console.log("After effect:", docInfo);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
            ></img>
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* doc name degree experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name} <img src={assets.verified_icon} alt=""></img>
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            {/* doctor about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About
                <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p clasName="text-gray-500 font-medium mt-4">
              Appointment fee:
              <span>
                {currency}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* booking slots section */}
        <div className=" sm:pl-4  font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll ">
            {docslot.length &&
              docslot.map((item, index) => (
                <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index?'bg-primary text-white':'border border-gray-300'}`} key={index}>
                  <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docslot.length&&docslot[slotIndex].map((item,index)=>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime?'bg-primary text-white':'border border-gray-300'}`}key={index}>
                {item.time.toLowerCase()}
              </p>
            )
          )}
          </div>
          <button className="bg-primary text-white rounded-full py-4 px-8 mt-3 " onClick={bookapp}>Book</button>
        </div>
        {/*Listing Releated Doctors*/}
        
        <Releateddoctor id={id} speciality={docInfo.speciality}/>
      </div>
    )
  );
};

export default Appointement;
