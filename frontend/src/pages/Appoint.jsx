
import { useParams,Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Appoint = () => {
  const { Id } = useParams(); 
  const { doctors,currencySymbol,backendUrl,token,getDoctors } = useContext(AppContext);
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const navigate=useNavigate()

  const [docInfo, setDocInfo] = useState({});
 
  const [docSlots,setDocSlots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('')
  const [specialization,setSpecialization]=useState("")

  const handle = async () => {
    const fetched = doctors.find(doc => doc._id === Id);
     setDocInfo(fetched);
     console.log(doctors)
  };


     const modifiedDoctors=doctors.filter(doc=>doc.speciality.toLowerCase() === specialization.toLowerCase() && doc._id!=Id)
  // console.log(modifiedDoctors)


 
  

  const AvailableSlots=async()=>{
    setDocSlots([])

    //-----getting Current Date------
    let today= new Date()

    for(let i=0;i<7;i++){
      // ----------getting Date with Index--------
      let currentDate=new Date(today)
      currentDate.setDate(today.getDate()+i)

// ------setting end time of the Date with index--------
      let endTime=new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      // ---------setting Hours-----------
      if(today.getDate()===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10)
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)

      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots=[]
      while(currentDate<endTime){
        let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

        let day=currentDate.getDate()
        let month=currentDate.getMonth()+1
        let year=currentDate.getFullYear()

        let date=day +"_"+month+ "_"+year
        let slotTime=formattedTime

        const isSlotAvailable=docInfo.slots_booked[date] && docInfo.slots_booked[date].includes(slotTime)?false:true


        if(isSlotAvailable){
           timeSlots.push({
          datetime:new Date(currentDate),
          time:formattedTime
        })

        }
//     add slot to array
       

        // Increment currnt Time by 30 min
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }

      setDocSlots(prev=>([...prev,timeSlots]))
    }
  }



  const bookAppointment=async()=>{
    if(!token){
      toast.warn('Login to book appointment')
      return    navigate('/login')
    }

    try {
      
      const date=docSlots[slotIndex][0].datetime

      let day=date.getDate()
      let month=date.getMonth()+1
      let year=date.getFullYear()

      const slotDate=day +"_"+month+ "_"+year
      const response= await fetch(`${backendUrl}/api/user/book-appointment`,{
        method:'POST',
        headers:{
          'Content-type':'Application/json',
          'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({docId:Id,slotDate,slotTime})
      })

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data= await response.json()
      if(data.success){
        toast.success(data.message)
         console.log(data)
      getDoctors()
      navigate('/appointment')
      }
      else{
        toast.error(data.message)
      }
     

    } catch (error) {
      
      console.log(error)
      toast.error(error.message)
    }
  }






  useEffect(() => {
    handle();
  }, [Id]);


  useEffect(() => {
    if (docInfo.speciality) {
      setSpecialization(docInfo.speciality);
    }
  }, [docInfo]);


useEffect(()=>{
  AvailableSlots()
},[docInfo])


// useEffect(()=>{
// },[docSlots])

  return docInfo && (
    <div>
      {/* ------doctor Details----------- */}
        <div className=" flex flex-col sm:flex-row gap-4">
         <div>
            <img className="bg-primary w-full sm:max-w-72 rounded-lg " src={docInfo.image} alt="" />
         </div>
         <div className=" flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-whote mx-2 sm:mx-0 mt-[-80px] sm:mt-0  ">
          {/* ------docInfo:  name,  degree,,experince    */}

          <p className=" flex items-center gap-2 text-2xl font-medium text-gray-900  " >{docInfo.name}
          <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className=" flex items-center gap-2 text-sm mt-1 text-gray-600 ">
            <p>{docInfo.degree}-{docInfo.speciality}
            </p>
            <button className=" py-0.5 px-2 border text-xs rounded-full " >{docInfo.experience}</button>
          </div>

          {/* -----Doctor About----- */}
          <div>
             <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 " >About <img src={assets.info_icon} alt="" /> </p>
             <p className=" text-sm text-gray-500 max-w-[700px] mt-1 "> {docInfo.about} </p>
          </div>

            <p className=" text-gray-500 font-medium mt-4 " >
              Appointment Fee: <span className="text-gray-500"> {currencySymbol}{docInfo.fees} </span>
            </p>
         </div>
        </div>


        {/* Booking Slots */}
        <div className=" sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
          <p>Booking Slots</p>
          <div className=" flex gap-3 items-center w-full overflow-x-scroll mt-4 ">
            {
              docSlots.length && docSlots.map((item,index)=>(
                <div onClick={()=>{setSlotIndex(index)}} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index?'bg-primary text-white':'border border-gray-200'}`} key={index}>
                  <p>{item[0] && days[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>


          <div className=" flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {
              docSlots.length && docSlots[slotIndex].map((item,index)=>(
                
                    <p key={index} onClick={()=>{setSlotTime(item.time)}}  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime? 'bg-primary  text-white ':' text-gray-400 border border-gray-300' }`}>
                      {item.time.toLowerCase()}
                    </p>
              ))
            }
          </div>

          <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-10 py-3 rounded-full my-6 " >Book an Appointment</button>
        </div>
        
        <div className="flex flex-col items-center px-3 space-y-4">
  {/* Title */}
  <p className="text-2xl font-bold text-center">Related Doctors</p>

  {/* Centered Doctors List */}
  <div className="w-full flex justify-center">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {modifiedDoctors.map((item) => (
        <Link
          key={item._id}
          to={`/appointment/${item._id}`} onClick={()=>{scrollTo(0,0)}}
          className="bg-blue-200 shadow-md rounded-lg p-3 hover:shadow-lg hover:scale-105 transition duration-300 w-40"
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
      ))}
    </div>
  </div>
</div>


    
    </div>
  );
};

export default Appoint;
