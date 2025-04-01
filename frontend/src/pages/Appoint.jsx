import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Appoint = () => {
  const { Id } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [reviews, setReview] = useState([]);
  const [unAvailableSlots,setUnAvailableSlots]=useState([]);
  const [visible,setVisible]=useState(false)

  useEffect(() => {
    const fetchedDoctor = doctors.find((doc) => doc._id === Id);
    if (fetchedDoctor) {
      setDocInfo(fetchedDoctor);
      setSpecialization(fetchedDoctor.speciality);
    }
  }, [Id, doctors]);


const AvailableSlots = async (selectedDate, setDocSlots, docInfo) => {
  setDocSlots([]);

  let currentDate = new Date(selectedDate);
  let endTime = new Date(selectedDate);
  endTime.setHours(21, 0, 0, 0);

  if (new Date().toDateString() === currentDate.toDateString()) {
    currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
    currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
  } else {
    currentDate.setHours(10);
    currentDate.setMinutes(0);
  }

  let timeSlots = [];
  while (currentDate < endTime) {
    let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let date = `${String(selectedDate.getUTCDate()).padStart(2, "0")}_${String(selectedDate.getUTCMonth() + 1).padStart(2, "0")}_${selectedDate.getUTCFullYear()}`;
    
    const isSlotAvailable = !docInfo.slots_booked[date]?.includes(formattedTime);

    if (isSlotAvailable) {
      timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
    }
    currentDate.setMinutes(currentDate.getMinutes() + 30);
  }

  setDocSlots((prev) => [...prev, ...timeSlots]);
};

useEffect(() => {
  if (selectedDate) {
    // Convert selectedDate to the correct format (YYYY-MM-DD)
    // const formattedDate = selectedDate.toISOString().split("T")[0];
    let correctDate = new Date(selectedDate);
    correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
    let formattedDate = correctDate.toISOString().split("T")[0]; 
    // Fetch unavailable slots from the backend
    const fetchUnavailableSlots = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/user/slots-unavailable?docId=${Id}&date=${formattedDate}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization':`Bearer ${token}`
          }
        });

        const data = await response.json();
        // console.log(data)
        if (data.success) {
          setUnAvailableSlots(data.slots || []);
          console.log(data.slots)
        } else {
          console.error("Error fetching unavailable slots:", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    // docSlots.filter(slot => !unAvailableSlots.includes(slot.time))

    fetchUnavailableSlots();
  }
}, [selectedDate]);



    const Rating=async(Id)=>{
     if(!token){
      toast.warn('Login to book appointment')
      return    navigate('/login')
     }

     try {
       const response=await fetch(`${backendUrl}/api/user/see-rating?doctorId=${Id}`,{
        method:'GET',
        headers:{
          'Content-type':'Application/json',
          'Authorization':`Bearer ${token}`
        }
       })

       if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data= await response.json()

      if (data.success ) {
        setReview(data.data2.reviews); 
    } else {
        setReview([]);                       
        toast.error(data.message || "No reviews found");
    }


     } catch (error) {
      console.log(error)
      toast.error(error.message)
     }
  }

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
      const response = await fetch(`${backendUrl}/api/user/book-appointment`, {
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
        getDoctors();
        navigate("/appointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const modifiedDoctors = doctors.filter(
    (doc) => doc.speciality.toLowerCase() === specialization.toLowerCase() && doc._id !== Id
  );



  useEffect(() => {
    if (selectedDate) {
      AvailableSlots(selectedDate, setDocSlots, docInfo);
    }
  }, [selectedDate]);




  useEffect(()=>{
    if(!token){
      toast.warn("Login to book an appointment");
      return navigate("/login");
    }
      try {
        const againAppointment = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/user/appointment-again?docId=${Id}`, {
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
              console.log(data.lastPaidAppointment.payment)
            } else {
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
  },[Id])








  return (
    docInfo && (
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
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Doctor Reviews</h2>
    
    <button onClick={()=>{Rating(Id),setVisible((prev) => !prev);}}
         className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300"
    >
       Show Ratings & Comments 
    </button>

    <div className="mt-6 space-y-4">
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
     </div>
 </div>

            {/* Calendar Integration */}
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Select a Date</h2>
              <Calendar
               
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date()}
              />
            </div>

            {/* Slot Selection */}
            <div className="mt-4">
    <h2 className="text-lg font-medium mb-2">Available Slots</h2>
    <div className="flex flex-wrap gap-3">
      {docSlots.length > 0 ? (
        docSlots.map((slot, index) => (

          <button
      key={index}
      onClick={() => {
        if (!unAvailableSlots.includes(slot.time)) {
          setSlotIndex(index);
          setSlotTime(slot.time);
        }
      }}
      disabled={unAvailableSlots.includes(slot.time)}
      className={`px-4 py-2 border rounded-lg ${
        unAvailableSlots.includes(slot.time) ? "bg-red-400 text-white cursor-not-allowed" :
        slotIndex === index ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
    >
      {slot.time}
    </button>
        ))
      ) : (
        <p className="text-gray-500">No available slots</p>
      )}
    </div>
  </div>

            <button
              onClick={bookAppointment}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-lg"
            >
              Book an Appointment
            </button>

            <button
              onClick={()=>navigate(`/ReAppointment?docId=${Id}`)}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-lg"
            >
              Free Appointment
            </button>
          </div>
        </div>


        {/* Related Doctors */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center">Related Doctors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-4">
            {modifiedDoctors.length > 0 ? (
              modifiedDoctors.map((item) => (
                <Link
                  key={item._id}
                  to={`/appointment/${item._id}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="bg-blue-200 shadow-md rounded-lg p-3 hover:shadow-lg hover:scale-105 transition duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mx-auto rounded-full mb-2"
                  />
                  <p className="text-green-500 text-xs text-center font-semibold">Available</p>
                  <h3 className="text-sm font-semibold text-center text-gray-800">{item.name}</h3>
                  <p className="text-center text-gray-600 text-xs">{item.speciality}</p>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500">No related doctors available.</p>
            )}
          </div>
        </div>
      </div>

      
    )
  );
};

export default Appoint;
