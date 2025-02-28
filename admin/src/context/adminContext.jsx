import { createContext, useState } from "react";
import { toast } from "react-toastify";
// import axios from 'axios'

export const AdminContext =createContext()

const AdminContextProvider=(props)=>{

const [aToken,setAToken]= useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
const [doctors,setDoctors]=useState([])
const [dashData,setDashData]=useState([])

const backendUrl=import.meta.env.VITE_BACKEND_URL


const getDoctors=async()=>{
    try {
        // const {data}=await axios.post(backendUrl+'/api/admin/doctorslist',{},{headers:{aToken}})
        
        const response=await fetch(`${backendUrl}/api/admin/doctorslist`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${aToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch doctors');
          }
  
          const data = await response.json();
          setDoctors(data); 
          console.log(data);

        // if(data.success){
        //     setDoctors(data.doctors)
        //     console.log(data.doctors)
        // }else{
        //     toast.error(data.message || 'Failed to fetch')
        // }


    } catch (error) {
        console.log(error.message)
        toast.error(error.message)
    }
}



const changeAvailability=async(docId)=>{

    try {
        const response=await fetch(`${backendUrl}/api/admin/change-availability`,{

            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${aToken}`
            },
            body:JSON.stringify({docId})
        })
        if(!response.ok){
            toast.error('Not Authorized')
        }
        const data=await response.json();
        getDoctors()
        console.log(data)

    } catch (error) {
        toast.error(error.message)
    }
}


const getDashData=async()=>{
    try {
        const response=await fetch(`${backendUrl}/api/admin/dashboard`,{

            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${aToken}`
            },  
        })
        if(!response.ok){
            toast.error('Not Authorized')
        }
        const data=await response.json();
        if(data.success){
            setDashData(data.dashData)
        }
        else{
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
}


    const value={
        aToken,setAToken,
        backendUrl ,doctors,
        getDoctors,changeAvailability,getDashData,dashData
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider