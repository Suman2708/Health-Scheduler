import { useContext, useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';


const ReAppointment = () => {
    const {token,currencySymbol,backendUrl,doctors}=useContext(AppContext)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const Id = queryParams.get("docId");

      const [docInfo, setDocInfo] = useState({});
      const [currentIndex, setCurrentIndex] = useState(0);
      const [selectedDate, setSelectedDate] = useState(new Date());
      const [slotTime, setSlotTime] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    // const [unAvailableSlots,setUnAvailableSlots]=useState([]);
    const [availableDates,setAvailableDates]= useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const navigate=useNavigate();



    const bookAppointment = async () => {
      if (!token) {
        toast.warn("Login to book an appointment");
        return navigate("/login");
      }
      if (!slotTime) {
        toast.warn("Please select a slot");
        return;
      }
  
      try {
        const response = await fetch(`${backendUrl}/api/user/book-reappointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ docId: Id, slotDate: selectedDate, slotTime }),
          
        });
  
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          navigate("/appointment");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };
    


    const AvailableSlots = async (selectedDate) => {
      // setDocSlots([]);
//       let formattedDate;
// if (typeof selectedDate === 'string') {
//   formattedDate = selectedDate;
// } else {
//   let correctDate = new Date(selectedDate);
//   correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
//   formattedDate = correctDate.toISOString().split("T")[0];
// }

// console.log(formattedDate)
    
      // const fetchavailableSlots = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/user/available-slots?docId=${Id}&date=${selectedDate}`, {  
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          // console.log(data)
          if (data.success) {
            setAvailableSlots(data.availableSlots);
            console.log(availableSlots)
            toast.success(data.message)
            // console.log(data.slots)
          } else {
            console.error("Error fetching unavailable slots:", data.message);
          }
        } catch (error) {
          console.error("API Error:", error);
        }
      // };
    };
    
//     useEffect(() => {
//       if (selectedDate) {
//         let formattedDate;
// if (typeof selectedDate === 'string') {
//   formattedDate = selectedDate;
// } else {
//   let correctDate = new Date(selectedDate);
//   correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
//   formattedDate = correctDate.toISOString().split("T")[0];
// }

//         // Fetch unavailable slots from the backend
//         const fetchUnavailableSlots = async () => {
//           try {
//             const response = await fetch(`${backendUrl}/api/user/slots-unavailable?docId=${Id}&date=${formattedDate}`, {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 'Authorization':`Bearer ${token}`
//               }
//             });
    
//             const data = await response.json();
//             // console.log(data)
//             if (data.success) {
//               setUnAvailableSlots(data.slots || []);
//               // console.log(data.slots)
//             } else {
//               console.error("Error fetching unavailable slots:", data.message);
//             }
//           } catch (error) {
//             console.error("API Error:", error);
//           }
//         };
//         // docSlots.filter(slot => !unAvailableSlots.includes(slot.time))
    
//         fetchUnavailableSlots();
//       }
//     }, [selectedDate]);


      // useEffect(() => {
      //   if (selectedDate) {
      //     AvailableSlots(selectedDate);
      //   }
      // }, [selectedDate]);
  



    useEffect(()=>{
        if(!token){
            navigate('/login')
            toast.warn('Please Login First')
        }
        const fetchedDoctor = doctors.find((doc) => doc._id === Id);
        if (fetchedDoctor) {
          setDocInfo(fetchedDoctor);
        //   setSpecialization(fetchedDoctor.speciality);
        }

    },[])



    useEffect(() => {
      if (!token) {
        navigate("/login");
        toast.warn("Please Login First");
      }
    
      const AvailableDates = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/user/available-dates?docId=${Id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
          if (data.success) {
            toast.success(data.message || "Click on Free Appointment to ReAppointment");
            setAvailableDates(data.availableDates); // Contains date + slots
            // console.log(availableDates[0])
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error("API Error:", error);
          toast.error("Something went wrong while fetching available dates.");
        }
      };
    
      AvailableDates();
    }, []);
    


    // const currentSlot = availableSlots[currentIndex] || { date: "N/A", slots: [] };
    // setSelectedDate(currentSlot.date)



    // useEffect(() => {
    //   if (currentSlot.date !== "N/A") {
    //     setSelectedDate(currentSlot.date);
    //   }
    // }, [currentSlot.date]);



    
  return docInfo &&  (
    <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <img
                  className="bg-primary w-full sm:max-w-72 rounded-lg"
                  src={docInfo.image}
                  alt="Doctor"
                />
              </div>
              <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white">
                <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                  {docInfo.name}
                  <img className="w-5" src={assets.verified_icon} alt="Verified" />
                </p>
                <p className="text-sm text-gray-600">{docInfo.degree} - {docInfo.speciality}</p>
                <p className="text-sm text-gray-600">{docInfo.about}</p>
                <p className="text-gray-500 font-medium mt-2">
                  Appointment Fee: <span className="text-gray-500">{currencySymbol}{docInfo.fees}</span>
                </p>
    
                           <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Doctor Reviews</h2> */}
        
    
        {/* <div className="mt-6 space-y-4">
             {visible & reviews.length > 0 ? (
                reviews.map((review) => (
                     <div key={review._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                         <div className="flex items-center gap-2">
                             <span className="text-yellow-500 text-xl">⭐</span>
                             <p className="text-lg font-semibold">{review.rating}/5</p>
                         </div>
                         <p className="text-gray-700 mt-2">{review.comment}</p>
                     </div>
                 ))
             ) : (
                 <p className="text-gray-500 text-center text-lg">No reviews available.</p>
             )}
         </div> */}
     </div>
     </div>
     </div>

     <div className="p-4 mt-6 bg-white shadow-md rounded-xl">
      <h2 className="text-lg font-bold mb-4">Available Slots</h2>

      {/* Display date */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" >
        {
          availableDates.length>0? (
            availableDates.map((date,index)=>(
              <button 
                key={index}
                className="mb-6 border-b pb-4"
                onClick={()=>{setSelectedDate(date.date),AvailableSlots(date.date)}}>
                {date.date} 
                {/* <br />
                {selectedDate} */}
              </button>
            ))
          )
          :(
          <p className="text-gray-500">No Dates.</p>
        )
        }
      </div>

      {/* Display available slots */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <button onClick={()=>{setSlotIndex(index),
          setSlotTime(slot)}}
      key={index} className={`px-4 py-2 border rounded-lg ${
        slotIndex === index ? "bg-blue-600 text-white" : "bg-gray-200" }`}>
      {slot}
    </button>
          ))
        ) : (
          <p className="text-gray-500">No slots available.</p>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        {/* <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg ${currentIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Previous
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => Math.min(availableSlots.length - 1, prev + 1))}
          disabled={currentIndex === availableSlots.length - 1}
          className={`px-4 py-2 rounded-lg ${currentIndex === availableSlots.length - 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Next
        </button> */}
        <button
              onClick={bookAppointment}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-lg"
            >
              Book an Appointment
            </button>
      </div>
    </div>
    </div>
  );
}
export default ReAppointment;
