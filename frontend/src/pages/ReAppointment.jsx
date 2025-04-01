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
    // const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const navigate=useNavigate();

    // const checkAppointment = async () => {
    //     try {
    //         const response = await axios.post("/book-appointment", { userId: 1, Id, appointmentDate: date });

    //         if (response.data.availableSlots.length > 0) {
    //             setAvailableSlots(response.data.availableSlots);
    //         } else {
    //             alert("No available slots. Please select another date.");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         alert("Error booking appointment");
    //     }
    // };



    // const handleNext = () => {
    //     if (currentIndex < availableSlots.length - 1) {
    //       setCurrentIndex(currentIndex + 1);
    //     }
    //   };
    
    //   const handlePrevious = () => {
    //     if (currentIndex > 0) {
    //       setCurrentIndex(currentIndex - 1);
    //     }
    //   };




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



    useEffect(()=>{
        if(!token){
            navigate('/login')
            toast.warn('Please Login First')
        }
        try {
            const againAppointment = async () => {
              try {
                const response = await fetch(`${backendUrl}/api/user/available-dates?docId=${Id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  }
                });
        
                const data = await response.json();
                // console.log(data)
                if (data.success) {
                  toast.success(data.message || "Click on Free Appointment to ReAppointment")
                  setAvailableSlots(data.availableSlots)
                  console.log(data.availableSlots)
                } else {
                    setAvailableSlots(data.availableSlots)
                    console.log(data.availableSlots)
                  toast.success( data.message)
                  // console.error("Error fetching unavailable slots:", data.message);
                }
              } catch (error) {
                console.error("API Error:", error);
              }
            };
        
            againAppointment();
          } catch (error) {
            console.log(error)
          toast.error(error.message)
          }
    },[])


    const currentSlot = availableSlots[currentIndex] || { date: "N/A", slots: [] };
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

     <div className="p-4">
      <h2 className="text-lg font-bold">Available Slots</h2>

      {/* Display date */}
      <p className="text-md font-semibold text-blue-600">
        Date: {currentSlot.date}
      </p>

      {/* Display available slots */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {currentSlot.slots.length > 0 ? (
          currentSlot.slots.map((slot, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {slot}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No slots available.</p>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <button
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
        </button>
      </div>
    </div>
    </div>
  );
}

export default ReAppointment;
