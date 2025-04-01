import { createContext, useState } from "react";
import { toast } from "react-toastify";
// import axios from 'axios'

export const AdminContext =createContext()

const AdminContextProvider=(props)=>{

const [aToken,setAToken]= useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
const [doctors,setDoctors]=useState([])
const [dashdata,setDashData]=useState([])
const [appointments,setAppointment]=useState([]);

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
        if(data.success){
            toast.success(data.message)
            getDoctors()
        }
        else{
            toast.error(data.message)
        }
       
        // console.log(data)

    } catch (error) {
        toast.error(error.message)
    }
}

const getDashData = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/admin/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aToken}`
            },
        });

        if (!response.ok) {
            toast.error('Not Authorized');
            return;
        }

        const data = await response.json();
        console.log("Fetched Dashboard Data:", data);

        if (data.success) {
            setDashData(data.dashData);
            localStorage.setItem("dashdata", JSON.stringify(data.dashData));  // Store data in localStorage
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

// const getDashData=async()=>{
//     try {
//         const response=await fetch(`${backendUrl}/api/admin/dashboard`,{

//             method:'GET',
//             headers:{
//                 'Content-Type': 'application/json',
//                 'Authorization':`Bearer ${aToken}`
//             },  
//         })
//         if(!response.ok){
//             toast.error('Not Authorized')
//         }
//         const data=await response.json();
//         console.log(data)
//         if(data.success){
//             setDashData(data.dashData)
           
//         }
//         else{
//             toast.error(data.message)
//         }

//     } catch (error) {
//         toast.error(error.message)
//     }
// }





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


    const value={
        aToken,setAToken,
        backendUrl ,doctors,
        getDoctors,changeAvailability,getDashData,dashdata,
        appointments,cancelled,fetchAppointments,setDashData
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider