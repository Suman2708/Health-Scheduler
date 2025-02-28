import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/adminContext'; 

const DoctorList = () => {
  const {aToken,changeAvailability,doctors,getDoctors } = useContext(AdminContext);
  // const [doctors, setDoctors] = useState([]);

  // useEffect(() => {
  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await fetch(`${backendUrl}/api/admin/doctorslist`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${aToken}`, 
  //         },
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.message || 'Failed to fetch doctors');
  //       }

  //       const data = await response.json();
  //       setDoctors(data); // ✅ Store retrieved doctors in state
  //       console.log(data); // ✅ Print doctors in console
  //     } catch (error) {
  //       console.error('Error:', error.message);
  //     }
  //   };

  //   fetchDoctors(); // ✅ Call the function inside useEffect()
  // }, [backendUrl]); // ✅ Runs when backendUrl changes




  useEffect(()=>{
    if(aToken){
      getDoctors()
    }
      
  },[aToken])

  return (
    <div className="flex flex-col items-center w-full">
    {/* Heading at the top */}
    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Doctor List</h2>

    {/* Doctor Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 w-5/6">
      {doctors.map((item) => (
        <div
          key={item._id}
          to={`/appointment/${item._id}`}
          className="bg-white shadow-lg rounded-lg p-4 transition transform hover:scale-105 hover:shadow-xl flex flex-col items-center"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-32 h-32 object-cover rounded-full border-2 border-blue-300"
          />

          {/* Doctor Name */}
          <h3 className="text-base font-semibold text-gray-800 mt-1 text-center">
            {item.name}
          </h3>

          {/* Doctor Speciality */}
          <p className="text-gray-600 text-sm text-center">{item.speciality}</p>
          
          {/* Availability Text - Centered Inside the Card */}
          <div className=' mt-2 flex  flex-row items-center gap-1 text-sm'>
            <input onChange={()=>changeAvailability(item._id)} type="checkbox"  checked={item.available}/>
            <p className="text-green-500 text-sm font-medium mt-2">Available</p>
          </div>
          
          
          
        </div>
      ))}
    </div>
  </div>
  );
};

export default DoctorList;
