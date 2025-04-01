import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Profile from './pages/Profile'
import Appointment from './pages/Appointment'
import Appoint from './pages/Appoint'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingsAndReviews from './pages/Review'
import ReviewPage from './pages/Review'
import ReAppointment from './pages/ReAppointment'


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10]>'>
    <Navbar />
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/appointment/:Id' element={<Appoint/>}/>
        <Route path='/review' element={<ReviewPage/>}/>
        <Route path='/ReAppointment' element={<ReAppointment />}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
