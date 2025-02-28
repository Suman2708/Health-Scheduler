import React, { createContext, useEffect, useState } from 'react'
// import { doctors } from '../assets/assets'
import { toast } from "react-toastify";

export const AppContext=  createContext();



const AppContextProvider = (props) => {

  const currencySymbol ='$'

  const backendUrl=import.meta.env.VITE_BACKEND_URL

  const [doctors,setDoctors]=useState([])
  const [userData, setUserData]=useState({})
  const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'')

   

    const getDoctors=async()=>{
      try {
        
        const response=  await fetch(`${backendUrl}/api/doctor/doctordata`,{
          method:'GET',
          headers:{
            'content-type':'Application-json',
            'Authorization':`Bearer ${token}`
          }
        })

        if(!response.ok){
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch doctors');
        }


        const data=await response .json();
        setDoctors(data)
        console.log(doctors)


      } catch (error) {
        toast.error(error.message);
        console.log(error)
      }
    }

    const loadUserData=async()=>{
      try {
        
        const response=await fetch(`${backendUrl}/api/user/userinfo`,{
          method:'GET',
          headers:{
            'content-type':'Application-json',
            'Authorization':`Bearer ${token}`
          }
        })

        // console.log(response)

        if(!response.ok){
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch data');
        }


        const data=await response.json();
        // console.log(data)
        setUserData(data)
        // console.log(userData)

      } catch (error) {
        toast.error(error.message);
        console.log(error)
      }
    }

    useEffect(()=>{
      getDoctors()
    },[])

    useEffect(()=>{
      if(token){
        loadUserData()
      }
      else{
        setUserData({})
      }
    },[token])



    const value={
      doctors,currencySymbol,
      getDoctors,token,setToken,backendUrl,userData,setUserData,
      loadUserData
  }

  return (
    <div>
      <AppContext.Provider value={value}>
        {props.children}
      </AppContext.Provider>
    </div>
  )
}

export default AppContextProvider
