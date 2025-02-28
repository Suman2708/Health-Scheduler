import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/adminContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {

    const {aToken,setAToken}=useContext(AdminContext)
    const navigate=useNavigate()

    const logout=()=>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
    }


  return (
    <div className=' flex justify-between items-center px-4 py-3 border-b bg-white  '>
       <div className=' flex  items-center gap-2 text-xs '>
        <img src={assets.admin_logo} alt="" />
        <p  className=' border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600  '>{aToken ? 'Admin':'Doctor'}</p>
       </div>
       <button onClick={logout} className=' bg-blue-500 text-white text-sm px-10 py-2 rounded-full '>LogOut</button>
    </div>
  )
}

export default Navbar
