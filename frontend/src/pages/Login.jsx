import  { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const {token,setToken,backendUrl}=useContext(AppContext)
  const navigate=useNavigate()

  const [state,setState]=useState('Sign Up')
  const [email,setEmail]=useState('')
  const[name,setName]=useState('')
  const[password,setPassword]=useState('')



  const onSubmitHandler= async(event)=>{
      event.preventDefault()

      try {
        
        if(state==='Sign Up'){
          const response=await fetch(`${backendUrl}/api/user/register`,{
              method:'POST',
              headers:{
                'Content-Type': 'application/json',
                // 'Authorization':`Bearer ${token}`
              },
              body:JSON.stringify({name,email,password})
          })

          if (!response.ok) {
            // If the response is not successful, throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
          }

          console.log(response)

          const data=await response.json();
          if (data.success) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            toast.success('Login Successful')
            console.log(data.token);
          }
          else{
              toast.error(data.message)
          }
        }

        else{
          const response=await fetch(`${backendUrl}/api/user/login`,{
            method:'POST',
            headers:{
              'Content-Type': 'application/json',
              // 'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({email,password})
        })

        if (!response.ok) {
          // If the response is not successful, throw an error
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        console.log(response)

        const data=await response.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Login Successful')
          console.log(data.token);
        }
        else{
            toast.error(data.message)
        }
      }
        }


       catch (error) {
          console.log(error)
      }
  }


  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])


  return (
   <form onSubmit={onSubmitHandler} action="" className=' min-h-[80vh] flex items-center'>
    <div className=' flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 borer rounded-xl  text-zinc-600  text-sm shadow-2xl '>
      <p className=' text-2xl font-semibold '>
      {
        state==='Sign Up'?"Create Account":'Login'
      }
      </p>
      <p>Please {state==='Sign Up'?"sign up":'login'} to book appointment</p>
      {
        state==='Sign Up' && <div className='w-full'>
        <p>Full Name</p>
        <input className='border border-zinc-300 rounded-full p-2 mt-1' type="text" onChange={(e)=>{setName(e.target.value)}} value={name} required />
      </div>
      }
      
      <div className='w-full'>
        <p>Email</p>
        <input className='border border-zinc-300 rounded-full p-2 mt-1' type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email} required />
      </div>
      <div className='w-full'>
        <p>Password</p>
        <input className='border border-zinc-300 rounded-full p-2 mt-1' type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password} required />
      </div>
      <button className=' bg-primary text-white w-full py-2 rounded-md text-base  ' >{state==='Sign Up'?"sign up":'login'}</button>
      {
        state==='Sign Up'? 
        <p>Already have an account ? <span onClick={()=>{setState('Login')}} className=' text-primary underline cursor-pointer '>Login here</span> </p>:
        <p>Create an account ? <span onClick={()=>{setState('Sign Up')}} className=' text-primary underline cursor-pointer '> click here</span></p>
      }
    </div>
   </form>
  )
}

export default Login
