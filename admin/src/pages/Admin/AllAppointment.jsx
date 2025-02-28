import {useContext,useState,useEffect}from 'react'
import { AdminContext } from '../../context/adminContext'
import { toast } from "react-toastify";
import { AppContext } from '../../context/appContext';
import { assets } from '../../assets/assets';


const AllAppointment = () => {

const {backendUrl,aToken}=useContext(AdminContext);
const {calculateAge,slotDateFormat,currency}=useContext(AppContext)

const [appointments,setAppointment]=useState([]);


const fetchAppointments = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/admin/allappointment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aToken}`,
      },
    });

    if (!response.ok) {
      return toast.error("Not Authorized");
    }

    const data = await response.json();
    // console.log("Fetched data:", data); // ✅ Check API response

    setAppointment(data.allAppointment) 
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error(error.message);
  }
};




const cancelled=async(appointmentId)=>{
    try {
      
      const response = await fetch(`${backendUrl}/api/admin/cancel-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aToken}`,
        },
        body:JSON.stringify({appointmentId})
      });

      if (!response.ok) {
        return toast.error("Not Authorized");
      }

      const data = await response.json(); 
      console.log(data)
      if(data.success){
        toast.success(data.message)
       fetchAppointments()
      }

      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message);
    }
}



useEffect(() => {
  if (!aToken) return;

  fetchAppointments();
}, [aToken]);




  // useEffect(() => {
  //   // const token = localStorage.getItem("token"); // Get token from localStorage
  
  //   fetch(`${backendUrl}/api/admin/allappointment`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${aToken}`, // Pass token in the header
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Fetched Data:", data); // Debugging: See what data is received
  //       if (Array.isArray(data)) {
  //         setAppointment(data);
  //       } else {
  //         setAppointment([]); // Set to empty array if the response is not an array
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching appointments:", error);
  //       setAppointment([]); // Set to empty array in case of error
  //     });
  // }, []);
  
  
  



  return (
    <div className=" w-full max-w-6xl m-5">
        <p className=' mb-3 text-lg font-medium'>All Appointment</p>
        <div className=' bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll  '>
          <div className=' hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b '>
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>
          {
            appointments.map((item,index)=>(
                <div className=' flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-700 py-3 px-6 border-b hover:bg-blue-300  ' key={index}>
                  <p className=' max-sm:hidden  '>{index+1} </p>
                  <div className=' flex items-center  gap-2'>
                    <img className=' w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name} </p>
                  </div>
                  <p className='max-sm:hidden'>{calculateAge(item.userData.dob)} </p>
                  <p> {slotDateFormat(item.slotDate)},{item.slotTime} </p>
                  <div className=' flex items-center  gap-2'>
                    <img className=' w-8 rounded-full bg-gray-200 ' src={item.docData.image} alt="" /> <p>{item.docData.name} </p>
                  </div>
                  <p>{currency}{item.amount} </p>
                  {item.cancelled ? <p className=' text-red-400 text-xs font-medium'>Cancelled</p>
                  :<img onClick={()=>cancelled(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                   }
                  
                </div>
            ))
          }
        </div>
    </div>
  );
}

export default AllAppointment
