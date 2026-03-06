import React, { useContext } from 'react'
import { NavLink ,useNavigate} from 'react-router-dom'
import { useState } from 'react';
import {assets} from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext';
function Navbar() {
    const navigate=useNavigate();
    const [menu,Setmenu]=useState(false);
    const {token,settoken,userData}=useContext(AppContext)
    const logout=()=>{
        console.log("running");
        settoken(false);
        localStorage.removeItem('token');
       navigate('/Login');
        console.log("runnning3")
    }
    const handleCreate=()=>{
        navigate('/Login')
    }
  return (
    <div className='flex items-center justify-between  text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer ' src={assets.logo} alt='img'/>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>
                    Home
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
            </NavLink>
            <NavLink to='/Doctor'>
                <li className='py-1'>
                    AllDoctors
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
            </NavLink>
            <NavLink to='/About'>
                <li className='py-1'>
                    About
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
            </NavLink>
            <NavLink to='/Contact'>
                <li className='py-1'>
                     Contact            
                 </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
            </NavLink>
        </ul>
        <div>
            {token&&userData?
            <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img src={userData.image} className='w-8 rounded-full' alt=''></img>
            <img className='w-2.5' src={assets.dropdown_icon} alt=""/>
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={()=>navigate('/Myprofile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={()=>navigate('/Myappointement')}className='hover:text-black cursor-pointer'>My Appointements</p>
               <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
            </div>
            </div>
            </div>:
            <button onClick={handleCreate} className='bg-primary text-white rounded-full px-8 py-4 hidden md:block font-light'>Create Account</button>}
        </div>
        <img onClick={()=>Setmenu(true)} className='w-6 md:hidden'src={assets.menu_icon}></img>
        {/*----mobile_menu------*/}
        <div className={`${menu?'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300`}>
        <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo}></img>
            <img  className='w-7' onClick={()=>Setmenu(false)}src={assets.cross_icon }></img>
        </div>
        <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={()=>Setmenu(false)} to='/'>Home</NavLink>
            <NavLink  onClick={()=>Setmenu(false)}to='/Doctor'>All Doctors</NavLink>
            <NavLink  onClick={()=>Setmenu(false)}to='/About'>About</NavLink>
            <NavLink  onClick={()=>Setmenu(false)}to='/Contact'>Contact</NavLink>
        </ul>
        </div>
    </div>
  )
}
export default Navbar