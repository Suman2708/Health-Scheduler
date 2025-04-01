
import  { useContext } from 'react';
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/adminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import { DoctorContext } from './context/doctorContext';
import DoctorDashboard from './pages/Doctor/doctorDashboard';
import DoctorAppointment from './pages/Doctor/doctorAppointment';
import DoctorProfile from './pages/Doctor/doctorProfile';

const App = () => {

    const {aToken}=useContext(AdminContext)
    const {dToken}=useContext(DoctorContext)


  return aToken || dToken ? (
    <div className='bg-[#F8F9Fd]'>
      <Navbar />
      <ToastContainer/>
      <div className=' flex items-start '>
        <Sidebar />
        <Routes>

        {/* -----Admin Routes-------- */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<DashBoard/>} />
          <Route path='/all-appointments' element={<AllAppointment />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />

          {/* -------Doctor Routes------- */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appointment' element={<DoctorAppointment/>} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />

        </Routes>
      </div>
    </div>
  ):
  (<> 
    <Login/>
    <ToastContainer/>
  </>)
}

export default App


