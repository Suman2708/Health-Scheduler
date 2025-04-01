import  { useContext, useState } from 'react'
import { AdminContext } from '../context/adminContext'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/doctorContext'


const Login = () => {
    const [state,setState]=useState('Admin')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const {setAToken,backendUrl}=useContext(AdminContext)
    const {setDToken}=useContext(DoctorContext)

    const handler = async (event) => {
      event.preventDefault();
      try {
        if (state === 'Admin') {
          const response = await fetch(`${backendUrl}/api/admin/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }
    
          const data = await response.json();
    
          if (data.success) {
            localStorage.setItem('aToken', data.token);
            setAToken(data.token);
            toast.success('Login Successful')
            console.log(data.token);
          }
          else{
              toast.error(data.message)
          }
        } else {

          try {
            
            const response= await fetch(`${backendUrl}/api/doctor/login`,{
                method:'POST',
                headers:{
                    'Content-Type':'Application/json',
                },
                body:JSON.stringify({email,password})
            })

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            const data= await response.json();
            if (data.success) {
                localStorage.setItem('dToken', data.token);
                setDToken(data.token);
                toast.success('Login Successful')
                console.log(data.token);
              }
              else{
                  toast.error(data.message)
              }
        } catch (error) {
            toast.error(error.message)
        }

        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    

  return (
    <form onSubmit={handler} className=' min-h-[80vh] flex items-center' action="">
        <div className=' flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg '>
            <p className=' text-2xl font-semibold m-auto'>
            <span className=' text-primary'>
                 {state}
            </span>
               
                Login
            </p>
            <div className='w-full'>
              <p>Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className=' border border-[#DADADA] rounded w-full p-2 mt-1' type="email"  required/>
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className=' border border-[#DADADA] rounded w-full p-2 mt-1' type="password"  required />
            </div>
            <button className=' bg-blue-500  text-white w-full py-2 rounded-md text-base' >Login</button>
            {
              state==='Admin'?
              <p>Doctor Login? <span className=' text-blue-500  underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
              :<p>Admin Login? <span className='text-blue-500  underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
            }
        </div>
    </form>
  )
}

export default Login
