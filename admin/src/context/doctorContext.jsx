import { createContext, useState } from "react";
import {toast} from 'react-toastify'

export const DoctorContext =createContext()

const DoctorContextProvider=(props)=>{ 

    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const [dToken,setDToken]=useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'');
    const [appointments,setAppointments]=useState([])
    const [dashboard,setDashboard]=useState([])
    const [profileData,setProfileData]=useState(false)

    const getAppointments=async()=>{
        try {
            
            const response= await fetch(`${backendUrl}/api/doctor/all-appointments`,{
                method:'GET',
                headers:{
                    'Content-Type':'Application/json',
                    'Authorization':`Bearer ${dToken}`
                }
            })

            const data=await response.json()
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
                toast.error(error.message)
        }
    }

    const completeAppointment=async(appointmentId)=>{
        try {
            const response= await fetch(`${backendUrl}/api/doctor/complete-appointments`,{
                method:'POST',
                headers:{
                    'Content-Type':'Application/json',
                    'Authorization':`Bearer ${dToken}`
                },
                body:JSON.stringify({appointmentId})
            })
            if(!response.ok){
                const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch doctors');
            }

            const data=await response.json()
            if(data.success){
                console.log(data.message)
                toast.success(data.message)
                getAppointments()
                console.log(data)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }



    const cancelAppointment=async(appointmentId)=>{
        try {
            const response= await fetch(`${backendUrl}/api/doctor/cancel-appointments`,{
                method:'POST',
                headers:{
                    'Content-Type':'Application/json',
                    'Authorization':`Bearer ${dToken}`
                },
                body:JSON.stringify({appointmentId})
            })

            const data=await response.json()
            if(data.success){
                toast.success(data.message)
                getAppointments()
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getDashboard=async()=>{
        try {
            const response= await fetch(`${backendUrl}/api/doctor/doctor-dashboard`,{
                method:'GET',
                headers:{
                    'Content-Type':'Application/json',
                    'Authorization':`Bearer ${dToken}`
                }
            })

            const data=await response.json()
            if(data.success){
                toast.success(data.message)
                setDashboard(data.dashData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getProfileData=async()=>{
        try {
            const response= await fetch(`${backendUrl}/api/doctor/doctor-profile`,{
                method:'GET',
                headers:{
                    'Content-Type':'Application/json',
                    'Authorization':`Bearer ${dToken}`
                }
            })

            const data=await response.json()
            if(data.success){
                toast.success(data.message)
                setProfileData(data.docData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const value={
            backendUrl,dToken,
            setDToken,appointments,setAppointments,
            getAppointments,completeAppointment,
            cancelAppointment,dashboard,
            setDashboard,getDashboard,
            getProfileData,profileData,setProfileData
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider