import  { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/doctorContext'
import { AppContext } from '../../context/appContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
  const {getAppointments,appointments,dToken,completeAppointment,cancelAppointment}=useContext(DoctorContext)
  const {calculateAge,slotDateFormat,currency}=useContext(AppContext)


  useEffect(()=>{
    if(dToken){
      getAppointments()
    }
  },[dToken])


  return appointments.reverse() && (
    <div className="w-full max-w-6xl mx-auto p-5">
  <p className="mb-3 text-lg font-medium">All Appointments</p>

  <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
    
    {/* Table Header (Only for Large Screens) */}
    <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 bg-gray-100 font-medium py-3 px-6 border-b">
      <p>#</p>
      <p>Patient</p>
      <p>Payment</p>
      <p>Age</p>
      <p>Date & Time</p>
      <p>Fees</p>
      <p>Action</p>
    </div>

    {/* Table Data */}
    {appointments.map((item, index) => (
      <div
        key={index}
        className="sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-cols-1 p-4 border-b hover:bg-gray-50 transition duration-200"
      >
        {/* Large Screen Layout */}
        <p className="hidden sm:block font-semibold">{index + 1}</p>

        <div className="hidden sm:flex items-center gap-2">
          <img src={item.userData.image} alt="" className="w-10 h-10 rounded-full" />
          <p>{item.userData.name}</p>
        </div>

        <p className="hidden sm:block">{item.payment ? "ONLINE" : "CASH"}</p>
        <p className="hidden sm:block">{calculateAge(item.userData.dob)}</p>
        <p className="hidden sm:block">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
        <p className="hidden sm:block">{currency}{item.amount}</p>

        {/* Action Buttons (Always Visible) */}
        {
            item.cancelled ?
            <p className=' text-red-400 text-xs font-medium'>Cancelled</p> :
            item.isCompleted?
            <p className=' text-green-500 text-xs font-medium'>Completed</p> :
            <div className="flex gap-3 justify-center">
          <img onClick={()=>completeAppointment(item._id)} src={assets.tick_icon} alt="Approve" className="w-6 h-6 hover:opacity-70 transition cursor-pointer" />
            <img onClick={()=>cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-6 h-6 cursor-pointer hover:opacity-70 transition" />
          </div>
          }

        {/* Small Screen Layout */}
        <div className="sm:hidden flex flex-col gap-3">
          <p><strong>Patient:</strong> {item.userData.name}</p>
          <p><strong>Payment:</strong> {item.payment ? "ONLINE" : "CASH"}</p>
          <p><strong>Age:</strong> {calculateAge(item.userData.dob)}</p>
          <p><strong>Date & Time:</strong> {slotDateFormat(item.slotDate)}, {item.slotTime}</p>
          <p><strong>Fees:</strong> {currency}{item.amount}</p>

          {
            item.cancelled ?
            <p className=' text-red-400 text-xs font-medium'>Cancelled</p> :
            item.isCompleted?
            <p className=' text-green-500 text-xs font-medium'>Completed</p> :
            <div className="flex gap-3 justify-center">
          <img onClick={()=>completeAppointment(item._id)} src={assets.tick_icon} alt="Approve" className="w-6 h-6 hover:opacity-70 transition cursor-pointer" />
            <img onClick={()=>cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-6 h-6 cursor-pointer hover:opacity-70 transition" />
          </div>
          }
         
        </div>

      </div>
    ))}
  </div>
  
  
</div>



  )
}

export default DoctorAppointment
