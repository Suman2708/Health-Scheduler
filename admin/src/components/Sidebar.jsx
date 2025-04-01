import React, { useContext } from 'react'
import { AdminContext } from '../context/adminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/doctorContext'

const Sidebar = () => {
    const {aToken} =useContext(AdminContext)
    const {dToken}=useContext(DoctorContext)

    
  return (
    <div className='min-h-screen bg-white border-r'>
    {
        aToken && <ul className='text-[#515151] mt-5 '>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`}to={'/admin-dashboard'} >
                <img src={assets.home_icon} alt="" />
                <p className='text-black hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink  className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`}  to={'/all-appointments'} >
                <img src={assets.appointment_icon} alt="" />
                <p className='text-black hidden md:block'>Appointments</p>
            </NavLink>
            <NavLink  className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`} to={'/add-doctor'} >
                <img src={assets.add_icon} alt="" />
                <p className='text-black hidden md:block'>Add Doctor</p>
            </NavLink>
            <NavLink  className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`}  to={'/doctor-list'} >
                <img src={assets.people_icon} alt="" />
                <p className='text-black hidden md:block'>Doctors List</p>
            </NavLink> 
        </ul>
    }
    {
        dToken && <ul className='text-[#515151] mt-5 '>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`}to={'/doctor-dashboard'} >
                <img src={assets.home_icon} alt="" />
                <p className='text-black hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink  className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`}  to={'/doctor-appointment'} >
                <img src={assets.appointment_icon} alt="" />
                <p className='text-black hidden md:block'>Appointments</p>
            </NavLink>
            <NavLink  className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-blue-500':''}`} to={'/doctor-profile'} >
                <img src={assets.add_icon} alt="" />
                <p className='text-black hidden md:block'>Profile</p>
            </NavLink> 
        </ul>
    }
      
    </div>
  )
}

export default Sidebar
