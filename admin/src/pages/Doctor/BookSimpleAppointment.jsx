// import { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// // import { AppContext } from "../context/DoctorContext";
// import { toast } from "react-toastify";
// import { DoctorContext } from "../../context/doctorContext";

// const BookSimpleAppointment = () => {
//   const { Id } = useParams();
//   const { doctors, backendUrl, dToken, getDoctors } = useContext(DoctorContext);
//   const navigate = useNavigate();

//   const [docInfo, setDocInfo] = useState({});
//   const [docSlots, setDocSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");
//   const [unAvailableSlots, setUnAvailableSlots] = useState([]);
//   const [patientName, setPatientName] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const selectedDate = new Date();

//   useEffect(() => {
//     if (!doctors || !Array.isArray(doctors)) return;
  
//     const fetchedDoctor = doctors.find((doc) => String(doc._id) === String(Id));
//     if (fetchedDoctor) {
//       setDocInfo(fetchedDoctor);
//     }
//   }, [Id, doctors]);
  

//   const AvailableSlots = async () => {
//     setDocSlots([]);

//     let currentDate = new Date();
//     let endTime = new Date();
//     endTime.setHours(21, 0, 0, 0);

//     currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
//     currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);

//     let timeSlots = [];
//     while (currentDate < endTime) {
//       let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//       let dateKey = `${String(selectedDate.getUTCDate()).padStart(2, "0")}_${String(selectedDate.getUTCMonth() + 1).padStart(2, "0")}_${selectedDate.getUTCFullYear()}`;

//       const isSlotAvailable = !docInfo.slots_booked?.[dateKey]?.includes(formattedTime);

//       if (isSlotAvailable) {
//         timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
//       }
//       currentDate.setMinutes(currentDate.getMinutes() + 30);
//     }

//     setDocSlots((prev) => [...prev, ...timeSlots]);
//   };



//   useEffect(() => {
//     const fetchUnavailableSlots = async () => {
//       const correctDate = new Date(selectedDate);
//       correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
//       const formattedDate = correctDate.toISOString().split("T")[0];

//       try {
//         const response = await fetch(`${backendUrl}/api/doctor/unavailabel-slots?date=${formattedDate}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${dToken}`,
//           },
//         });

//         const data = await response.json();
//         if (data.success) {
//           setUnAvailableSlots(data.slots || []);
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     };

//     if (dToken) fetchUnavailableSlots();
//   }, [Id, selectedDate, dToken]);




//   useEffect(() => {
//     AvailableSlots();
//   }, [docInfo]);

//   const bookAppointment = async () => {
//     // if (!dToken) {
//     //   toast.warn("Login to book an appointment");
//     //   return navigate("/login");
//     // }
//     if (!slotTime || !patientName || !mobileNumber) {
//       toast.warn("Please fill all fields and select a slot");
//       return;
//     }

//     try {
//       const response = await fetch(`${backendUrl}/api/doctor/book-doctor`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${dToken}`,
         
//         },
//         body: JSON.stringify({
//           slotDate: selectedDate,
//           slotTime,
//           patientName,
//           mobileNumber,
//         }),
//       });
//       console.log(dToken)

//       const data = await response.json();
//       if (data.success) {
//         toast.success(data.message);
//         getDoctors();
//         navigate("/appointment");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };



  
//   return (
//     <div className="container mx-auto p-4 max-w-xl">
//       <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

//       <input
//         type="text"
//         placeholder="Patient Name"
//         className="w-full p-2 mb-3 border rounded"
//         value={patientName}
//         onChange={(e) => setPatientName(e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Mobile Number"
//         className="w-full p-2 mb-3 border rounded"
//         value={mobileNumber}
//         onChange={(e) => setMobileNumber(e.target.value)}
//       />

//       <h2 className="text-lg font-semibold mb-2">Available Slots for Today</h2>
//       <div className="flex flex-wrap gap-3 mb-4">
//         {docSlots.length > 0 ? (
//           docSlots.map((slot, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 if (!unAvailableSlots.includes(slot.time)) {
//                   setSlotIndex(index);
//                   setSlotTime(slot.time);
//                 }
//               }}
//               disabled={unAvailableSlots.includes(slot.time)}
//               className={`px-4 py-2 border rounded-lg ${
//                 unAvailableSlots.includes(slot.time)
//                   ? "bg-red-400 text-white cursor-not-allowed"
//                   : slotIndex === index
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {slot.time}
//             </button>
//           ))
//         ) : (
//           <p className="text-gray-500">No available slots</p>
//         )}
//       </div>

//       <button
//         onClick={bookAppointment}
//         className="w-100 px-4 bg-primary text-white py-2 rounded-lg bg-indigo-600"
//       >
//         Book Appointment
//       </button>
//     </div>
//   );
// };

// export default BookSimpleAppointment;








import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/doctorContext";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BookSimpleAppointment = () => {
  const { doctors, backendUrl, dToken, getDoctors } = useContext(DoctorContext);
  const navigate = useNavigate();

  // const [docInfo, setDocInfo] = useState({});
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [unAvailableSlots, setUnAvailableSlots] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());



  // const AvailableSlots = async () => {
  //   setDocSlots([]);

  //   let currentDate = new Date(selectedDate);
  //   let endTime = new Date(selectedDate);
  //   endTime.setHours(21, 0, 0, 0);

  //   if (new Date().toDateString() === selectedDate.toDateString()) {
  //     currentDate.setHours(Math.max(new Date().getHours() + 1, 10));
  //     currentDate.setMinutes(new Date().getMinutes() > 30 ? 30 : 0);
  //   } else {
  //     currentDate.setHours(10, 0, 0, 0);
  //   }

  //   let timeSlots = [];
  //   while (currentDate < endTime) {
  //     let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  //     let dateKey = `${String(selectedDate.getUTCDate()).padStart(2, "0")}_${String(selectedDate.getUTCMonth() + 1).padStart(2, "0")}_${selectedDate.getUTCFullYear()}`;
  //     const isSlotAvailable = !docInfo.slots_booked?.[dateKey]?.includes(formattedTime);

  //     if (isSlotAvailable) {
  //       timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
  //     }
  //     currentDate.setMinutes(currentDate.getMinutes() + 30);
  //   }

  //   setDocSlots(timeSlots);
  // };


  const AvailableSlots = async () => {
    setDocSlots([]);
  
    let currentDate = new Date(selectedDate);
    currentDate.setHours(10, 0, 0, 0); // Start from 10:00 AM
  
    let endTime = new Date(selectedDate);
    endTime.setHours(21, 0, 0, 0); // End at 9:00 PM
  
    let timeSlots = [];
  
    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
  
      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime,
      });
  
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }
  
    setDocSlots(timeSlots);
  };
  

  const fetchUnavailableSlots = async () => {
    const correctDate = new Date(selectedDate);
    correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());
    const formattedDate = correctDate.toISOString().split("T")[0];

    try {
      const response = await fetch(`${backendUrl}/api/doctor/unavailabel-slots?date=${formattedDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUnAvailableSlots(data.slots || []);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    if ( selectedDate) {
      AvailableSlots();
    }
  }, [ selectedDate]);

  useEffect(() => {
    if (dToken && selectedDate) {
      fetchUnavailableSlots();
    }
  }, [ selectedDate, dToken]);

  const bookAppointment = async () => {
    if (!slotTime || !patientName || !mobileNumber ) {
      toast.warn("Please fill all fields and select a slot");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/doctor/book-doctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dToken}`,
        },
        body: JSON.stringify({
          slotDate: selectedDate,
          slotTime,
          name:patientName,
          phone:mobileNumber,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate("/appointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

      {/* Doctor Selector */}
      {/* <h2 className="text-lg font-semibold mb-2">Select Doctor</h2>
      <select
        value={selectedDoctorId}
        onChange={(e) => setSelectedDoctorId(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">-- Select Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            Dr. {doc.name}
          </option>
        ))}
      </select> */}

      {/* Calendar */}
      <h2 className="text-lg font-semibold mb-2">Select Appointment Date</h2>
      <Calendar
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Patient Details */}
      <input
        type="text"
        placeholder="Patient Name"
        className="w-full p-2 mb-3 border rounded"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Mobile Number"
        className="w-full p-2 mb-3 border rounded"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />

      {/* Slots */}
      <h2 className="text-lg font-semibold mb-2">Available Slots</h2>
      <div className="flex flex-wrap gap-3 mb-4">
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
                unAvailableSlots.includes(slot.time)
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : slotIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {slot.time}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No available slots</p>
        )}
      </div>

      <button
        onClick={bookAppointment}
        className="w-full px-4 bg-indigo-600 text-white py-2 rounded-lg"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default BookSimpleAppointment;
