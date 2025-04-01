import { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import { toast } from 'react-toastify'

const Appointment = () => {

  const {backendUrl,token,getDoctors}= useContext(AppContext)

  const [appointments,setAppointments]=useState([])
  const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split('_')
    return dateArray[0]+" " +months[Number(dateArray[1])]+" "+dateArray[2]
  }

  const getUserAppointment=async()=>{
    try {
      const response= await fetch(`${backendUrl}/api/user/appointments`,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'authorization':`Bearer ${token}`
        }
      })
      console.log(response)
      if(!response.ok){
        const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch data');
      }
      console.log(response)
      const data= await response.json()
      if(data.success){
        toast.success(data.message)
        console.log(data.appointments)
        setAppointments(data.appointments.reverse())
        
      }

      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error.message)
     }
  }



  const cancelAppointment=async(appointmentId)=>{
      try {
        
        const response= await fetch(`${backendUrl}/api/user/cancel`,{
          method:'POST',
          headers:{
             'Content-Type': 'application/json',
          'authorization':`Bearer ${token}`
          },
          body:JSON.stringify({appointmentId})
        })
        if(!response.ok){
          const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch data');
        }
        console.log(response)
        const data= await response.json()
        if(data.success){
          toast.success(data.message)
         getUserAppointment()
         getDoctors()
          
        }
  
        else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      console.log(error.message)
      }
  }



  const Payment=async(appointmentId)=>{

    try {
        
      const response= await fetch(`${backendUrl}/api/user/payment`,{
        method:'POST',
        headers:{
           'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
        },
        body:JSON.stringify({appointmentId})
      })
      if(!response.ok){
        const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch data');
      }
      console.log(response)
      const data= await response.json()
      if(data.success){
        toast.success(data.message)
       getUserAppointment()
       getDoctors()
        
      }

      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    console.log(error.message)
    }
  }

  useEffect(()=>{
    if(token){
      getUserAppointment()
    }
  },[token])

  return (
    <div>
      <p className=' pb-3 mt-12 font-medium text-zinc-700 border-b' >My Appointments</p>
      <div>
        {
          appointments.map((item)=>(
            <div className=' grid grid-cols-[1rf_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={item._id}>
              <div>
                <img className='w-32  bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className=' flex-1 text-sm text-zinc-600'>
                <p className=' text-nuetral-800  font-semibold'>{item.docData.name} </p>
                <p>{item.docData.speciality}</p>
                <p className=' text-zinc-700 font-medium mt-1'>Address:</p>
                <p className=' text-xs'>{item.docData.address.line1}</p>
                <p className=' text-xs'>{item.docData.address.line2}</p>
                <p className=' text-xs mt-1'> <span className=' text-sm  text-neutral-700 font-medium '>Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className=' flex flex-col gap-2 justify-end'>
               {!item.cancelled && !item.isCompleted && <button onClick={()=>Payment(item._id)} className=' text-sm  text-center sm:min-w-48 py-2 border hover:bg-primary text-black transition-all duration-300'>Pay Online</button>} 
               {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className=' text-sm  text-center sm:min-w-48 py-2 border hover:bg-red-700 text-black transition-all duration-300'>Cancel Appointment</button>}
               {item.cancelled &&  !item.isCompleted &&<button className=' sm:min-w-48 py-2 border border-red-500 rounded text-red-500 '>Appointment Cancelled</button>} 
              </div>
              {
                item.isCompleted && <button className=' sm:min-w-48 py-2 border border-gray-500 rounded text-green-500'>Completed</button>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Appointment
