// import { useContext, useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";

// const Doctors = () => {
//   const { speciality } = useParams();
//   const { doctors } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [filteredDoctors, setFilteredDoctors] = useState(doctors);
//   const [filter,setFilter]=useState(false)
//   const [filter1,setFilter1]=useState(false)

//   useEffect(() => {
//     if (speciality) {
//       const filtered = doctors.filter(
//         (doc) => doc.speciality.toLowerCase() === speciality.toLowerCase()
//       );
//       setFilteredDoctors(filtered);
//     } else {
//       setFilteredDoctors(doctors);
//     }
//   }, [doctors, speciality]);

//   const specialties = [
//     "Neurologist",
//     "Dermatologist",
//     "General Physician",
//     "Gynecologist",
//     "Pediatricians",
//     "Gastroenterologist",
//   ];



//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setFilter1(false);
//         console.log("Screen is now mobile (less than 768px)"); // Call your function here
//       } else {
//         setFilter1(true);
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     // Run function once on mount in case the screen is already small
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-5 flex gap-8">
//       {/* Left Sidebar */}
//       <div className="w-1/5 space-y-3">
//         <h2 className="text-base font-semibold mb-1">Filter by Specialty</h2>


//        {/* ------Mobile Menu------ */}
//        <button onClick={()=>{filter? setFilter(false):setFilter(true)}}    className='w-6 md:hidden'>Filter</button>
//        <div className={`${filter ? 'fixed w-full':'h-0 w-0 '}md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}>
       
//         {filter && specialties.map((spec) => (
//           <button
//             key={spec}
//             onClick={() =>
//               {{speciality === spec ? navigate(`/doctors`) : navigate(`/doctors/${spec}`)};{filter? setFilter(false):setFilter(true)}}}
//             className={`w-full px-2 py-1 text-sm border border-gray-400 rounded text-gray-700 transition duration-300 ${
//               speciality === spec ? "text-black border-black font-semibold" : ""
//             }`}
//           >
//             {spec}
//           </button>
//         ))}
//         </div>
        

//         {filter1 && specialties.map((spec) => (
//           <button
//             key={spec}
//             onClick={() =>
//               speciality === spec ? navigate(`/doctors`) : navigate(`/doctors/${spec}`)
//             }
//             className={`w-full px-2 py-1 text-sm border border-gray-400 rounded text-gray-700 transition duration-300 ${
//               speciality === spec ? "text-black border-black font-semibold" : ""
//             }`}
//           >
//             {spec}
//           </button>
//         ))}
//       </div>
      
//       {/* </div> */}

//       {/* Right Content */}
//       <div className="w-4/5 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-3">
//         {filteredDoctors.length > 0 ? (
//           filteredDoctors.map((item) => (
//             <Link
//               key={item._id}
//               to={`/appointment/${item._id}`}
//               className="bg-blue-200 shadow-md rounded-lg p-3 hover:shadow-lg hover:scale-105 transition duration-300 w-40"
//             >
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-16 h-16  object-cover mx-auto rounded-full mb-2"
//               />
//               <p className="text-green-500 text-xs text-center">Available</p>
//               <h3 className="text-sm font-semibold text-center text-gray-800">{item.name}</h3>
//               <p className="text-center text-gray-600 text-xs">{item.speciality}</p>
//             </Link>
//           ))
//         ) : (
//           <p className="col-span-4 text-center text-gray-500 text-sm">No doctors available for this specialty.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Doctors;




import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  // Filter doctors based on selected specialty
  useEffect(() => {
    if (speciality) {
      const filtered = doctors.filter(
        (doc) => doc.speciality.toLowerCase() === speciality.toLowerCase()
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [doctors, speciality]);

  const specialties = [
    "Neurologist",
    "Dermatologist",
    "General Physician",
    "Gynecologist",
    "Pediatricians",
    "Gastroenterologist",
  ];

  // Handle screen resize for sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
      if (window.innerWidth < 768) setShowFilterMenu(false); // Close mobile filter on resize
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col md:flex-row gap-6">
      {/* Left Sidebar */}
      <div className={`md:w-1/4 ${showSidebar ? "block" : "hidden"} space-y-3`}>
        <h2 className="text-lg font-semibold">Filter by Specialty</h2>
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() =>
              speciality === spec ? navigate("/doctors") : navigate(`/doctors/${spec}`)
            }
            className={`w-full px-3 py-2 text-sm border rounded transition ${
              speciality === spec ? "bg-blue-500 text-white" : "border-gray-400 text-gray-700"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilterMenu(!showFilterMenu)}
        className="md:hidden w-full bg-blue-500 text-white py-2 rounded"
      >
        {showFilterMenu ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Mobile Filter Menu */}
      {showFilterMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-center p-5">
          <button
            onClick={() => setShowFilterMenu(false)}
            className="absolute top-4 right-4 text-xl"
          >
            ✖
          </button>
          <h2 className="text-lg font-semibold mb-4">Select Specialty</h2>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => {
                speciality === spec ? navigate("/doctors") : navigate(`/doctors/${spec}`);
                setShowFilterMenu(false);
              }}
              className={`w-3/4 px-3 py-2 text-sm border rounded transition mb-2 ${
                speciality === spec ? "bg-blue-500 text-white" : "border-gray-400 text-gray-700"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}

      {/* Right Content - Doctors Grid */}
      <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((item) => (
            <Link
              key={item._id}
              to={`/appointment/${item._id}`}
              className="bg-white shadow-lg rounded-lg p-4 transition transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full w-32 h-32 object-cover block mx-auto rounded-full border-2 border-blue-300"
              />
              <p className="text-green-500 text-sm text-center mt-2">Available</p>
              <h3 className="text-base font-semibold text-center text-gray-800 mt-1">
                {item.name}
              </h3>
              <p className="text-center text-gray-600 text-sm">{item.speciality}</p>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-sm">
            No doctors available for this specialty.
          </p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
