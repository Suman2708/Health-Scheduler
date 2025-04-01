import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/adminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/appContext";

const Dashboard = () => {
  const { dashdata, getDashData, aToken, setDashData, cancelled } = useContext(AdminContext);
  const {slotDateFormat}=useContext(AppContext)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (aToken) {
        try {
          await getDashData(); // Fetch fresh data first
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }

      // After attempting API fetch, fallback to localStorage if no fresh data
      const storedData = localStorage.getItem("dashdata");
      if (storedData) {
        setDashData(JSON.parse(storedData));
      }
      setLoading(false);
    };

    fetchData();
  }, [aToken]);

  useEffect(() => {
    if (dashdata) {
      localStorage.setItem("dashdata", JSON.stringify(dashdata)); // Store fresh data
    }
  }, [dashdata]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  if (!dashdata) {
    return <p className="text-center mt-10 text-gray-600">No data available</p>;
  }

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashdata.doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointment_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashdata.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashdata.patient}</p>
            <p className="text-gray-400">Users</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div className="pt-4 border border-t-0">
          {dashdata.latestAppointments?.map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={item.docData.image} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData.name}</p>
                <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : (
                <img onClick={() => cancelled(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
