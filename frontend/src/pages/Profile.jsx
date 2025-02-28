// import React, { useEffect,useContext, useState } from 'react'
// import { AppContext } from '../context/AppContext'

// const Profile = () => {


// const {userData,setUserData}=useContext(AppContext)

//   const [isEdit, setIsEdit]=useState()



  


//   return userData &&   (
//     <div className=' max-w-lg flex flex-col gap-2 text-sm'>
//       <img className=' w-36 rounded' src={userData.image} alt="" />
//        {isEdit ? <input className=' bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={(e)=>{setUserData(prev=>({...prev,name:e.target.value}))}}/>: <p className=' font-medium text-3xl text-neutral-800 mt-4'>{userData.name} </p>
//        }
//        <hr  className=' bg-zinc-400 h-[1px] border-none' />
//        <div>
//           <p className=' text-neutral-500 underline mt-3'>Contact Information</p>
//           <div className='  grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3  text-neutral-700 '>
//             <p className=' font-medium'>Email Id:</p>
//             <p className=' text-blue-500'>{userData.email} </p>
//             <p className=' font-medium'>Phone:</p>
//             {isEdit ? <input className='bg-gray-100 max-w-52 p-1 rounded-md ' type="text" value={userData.phone} onChange={(e)=>{setUserData(prev=>({...prev,phone:e.target.value}))}}/>: <p className='text-blue-400'>{userData.phone} </p>
//        }
//        {/* <p className='  font-medium '>Address:</p>
//        {
//         isEdit ?
//         <p>
//           <input className='max-w-52 bg-gray-50 p-1 rounded-md' type="text" onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={userData.address.line1}  />
//           <br />
//           <input className=' bg-gray-50 p-1 rounded-md' onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} value={userData.address.line2} type="text" />
//         </p>
//         : <p className=' text-gray-500'>
//           {userData.address.line1}
//           <br />
//           {userData.address.line2}
//         </p>
//        } */}
//           </div>
//        </div>

//        <div >
//         <p className=' text-neutral-500 underline mt-3'>Basic Information</p>
//         <div className='grid grid-cols-[1fr_3fr] gap-y-4 mt-3  text-neutral-700 '>
//           <p className='  font-medium '>Gender:</p>
//           {
//             isEdit ?
//             <select className=' max-w-20 bg-gray-100 p-1 rounded-md' onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} value={userData.gender}>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//             : <p className=' text-gray-400'>{userData.gender}</p> 
//           }
//           <p className=' font-medium'>Birthday:</p>
//           {
//             isEdit ?
//             <input className=' max-w-28 bg-gray-100 p-1 rounded-md' type="date" onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))} value={userData.dob}/>
//             : <p className=' text-gray-400'> {userData.dob} </p>
//           }
//         </div>
//        </div>

//        <div className='mt-10'>
//         {
//           isEdit ?
//           <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover: text-black transition-all  ' onClick={()=>setIsEdit(false)} >Save Information</button>
//           : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover: text-black transition-all ' onClick={()=>setIsEdit(true)}>Edit</button>
//         }
//        </div>
      
//     </div>
//   )
// }

// export default Profile







import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);


  return userData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className="w-36 rounded" src={userData?.image || "/default-avatar.png"} alt="Profile" />
      
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData?.name || ""}
          onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData?.name || "No Name"}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email Id:</p>
          <p className="text-blue-500">{userData?.email || "No Email"}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52 p-1 rounded-md"
              type="text"
              value={userData?.phone || ""}
              onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className="text-blue-400">{userData?.phone || "No Phone"}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <>
              <input
                className="max-w-52 bg-gray-50 p-1 rounded-md"
                type="text"
                onChange={(e) => setUserData(prev => ({
                  ...prev, address: { ...prev?.address, line1: e.target.value }
                }))}
                value={userData?.address?.line1 || ""}
              />
              <br />
              <input
                className="bg-gray-50 p-1 rounded-md"
                type="text"
                onChange={(e) => setUserData(prev => ({
                  ...prev, address: { ...prev?.address, line2: e.target.value }
                }))}
                value={userData?.address?.line2 || ""}
              />
            </>
          ) : (
            <p className="text-gray-500">
              {userData?.address?.line1 || "No Address"}
              <br />
              {userData?.address?.line2 || ""}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary transition-all"
            onClick={() => setIsEdit(false)}>Save Information</button>
        ) : (
          <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary transition-all"
            onClick={() => setIsEdit(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;

