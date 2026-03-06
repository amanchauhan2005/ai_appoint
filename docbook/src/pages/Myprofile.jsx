import React from 'react'
import {useContext,useState} from 'react'
import { AppContext } from '../context/AppContext'
import {assets} from '../assets/assets_frontend/assets'
import axios from 'axios'
import {toast} from 'react-toastify'
const Myprofile = () => {
  const {userData,setUserData,token,backendUrl,loadUserProfileData}=useContext(AppContext)
  console.log("hi")
  console.log(userData)
  console.log("userData is false:", userData === false)
  console.log("userData is undefined:", userData === undefined)
  const [isEdit,setisEdit]=useState(false)
  const [image,setImage]=useState(false)
  console.log(isEdit);
  const updateUserProfileData=async()=>{
    try{
      const formdata=new FormData()
      formdata.append('name',userData.name)
      formdata.append('phone',userData.phone)
      formdata.append('address',JSON.stringify(userData.address))
      formdata.append('gender',userData.gender)
      formdata.append('dob',userData.dob)
      image&&formdata.append('image',image)
      const{data}=await axios.post(backendUrl+'/api/user/update-profile',formdata,{headers:{token}})
      if(data.sucess){
        toast.success(data.message)
        await loadUserProfileData()
        setisEdit(false);
        setImage(false);
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error);
    }

  }
  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isEdit?
        <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75'src={image?URL.createObjectURL(image):userData.image} alt=""/>
         <img className='w-10 absolute bottom-12 right-12' src={image?'':assets.upload_icon} alt=""/> 

          </div>
          <input onChange={(e)=>setImage(e.target.files[0])}type="file" name="" id="image" hidden/>
        </label>:
        <img className="w-36 riunded" src={userData.image} alt=""/>
      }
      {/*<img className='w-36 rounded' src={userData.image}/>*/}
      {
       isEdit?
       (<input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type='text' value={userData.name} onChange={e=>setUserData(prev=>({...prev,name:e.target.value}))}></input>)
       :
       (<p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>)
      }
      <hr className='bg-zinc-300 h-[3px] border-none'/>
      <div>
        <p className='text-gray-500 text-xl underline mt-2 mb-2'>Contact Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-4'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
       isEdit?
       (<input className='bg-gray-100 max-w-52' type='text' value={userData.phone} onChange={e=>setUserData(prev=>({...prev,phone:e.target.value}))}></input>)
       :
       (<p className='text-blue-500'>{userData.phone}</p>)
      }
      <p>Adress:</p>
      {
        isEdit?
        <p className='font-medium'>
          <input className='bg-gray-50'type='text' onChange={(e)=>setUserData(prev=>({...prev,adress:{...prev.address,line1:e.target.value}}))} value={userData.address.line1}/>
          <br/> 
          <input  className='bg-gray-50'type='text' onChange={(e)=>setUserData(prev=>({...prev,adress:{...prev.address,line2:e.target.value}}))} value={userData.address.line2}/>
        </p>
        :<p  className='text-blue-500' >
          {userData.address.line1}
          <br />
          {userData.address.line2}
        </p>
      }
        </div>
      </div>
      <div>
        <p className='text-gray-500 text-xl underline mt-2 mb-2'>Basic Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2 mt-3 text-neutral-400'>
          <p className='font-medium text-gray-800'>Gender:</p>
          {
            isEdit?
            <select className='max-w-20 bg-gray-100' onChange={(e)=>setUserData({...prev,gender:e.target.value})}>
              <option value="Male"> Male</option>
              <option value="female">Female</option>
            </select>:
            <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium text-gray-800'>Birthday:</p>
          {
            isEdit?
            <input className='max-w-40' type='date' onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))} value={userData.dob}></input>
            :
            <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='mt-5 mb-10'>
        {
          isEdit?
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition all duration-300 'onClick={updateUserProfileData}>Save Information</button>:
          <button className='border border-primary px-8 py-2 rounded-full  hover:bg-primary hover:text-white transition all duration-300'onClick={()=>setisEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default Myprofile