import  { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {

  const navigate=useNavigate();
  const {doctors}=useContext(AppContext)

  return (
    <div className="max-w-5xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">Top Doctors to Book</h1>
      <p className="text-center text-gray-600 mb-6">
        Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
      </p>

      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
        {doctors.slice(0,10).map((item, index) => (
          <Link
            key={index}
            to={`/appointment/${item._id}`}
            className="bg-white shadow-md rounded-xl p-3 hover:shadow-lg hover:translate-y-[-10px] transition duration-300 w-44"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover mx-auto rounded-full mb-2"
            />
            <p className=" text-green-500 text-sm text-center rounded-full ">Available</p>
            <h3 className="text-medium font-semibold text-center text-gray-800">{item.name}</h3>
            <p className="text-center text-gray-600 text-sm">{item.speciality}</p>
            {/* <p className="text-center text-gray-600 text-xs">{item.degree}</p>
            <p className="text-center text-gray-600 text-xs">{item.experience} Experience</p> */}
            <div className="flex justify-center mt-2">
              <button className="bg-blue-300  text-white text-xs px-3 py-1 rounded-lg hover:bg-blue-600">
                View Profile
              </button>
            </div>
          </Link>
        ))}
      </div>
      <div>



        <button className=" bg-blue-300 hover:translate-y-[-10px] text-white px-12 py-3 rounded-full mt-10  hover:bg-blue-600" onClick={()=>{ navigate('/doctors') }}>more...</button>
      </div>
    </div>
  );
};

export default TopDoctors;
