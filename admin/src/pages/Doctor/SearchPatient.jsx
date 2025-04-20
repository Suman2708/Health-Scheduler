import  { useContext, useState } from 'react';
import { toast } from 'react-toastify';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Input, Button, Card, CardContent } from '@mui/material';
import { DoctorContext } from '../../context/doctorContext';


const PatientSearch = () => {
  const {backendUrl,dToken}=useContext(DoctorContext)
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSearch=async()=>{
        try {
            
            const response= await fetch(`${backendUrl}/api/doctor/search-patient`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${dToken}`
                },
                body:JSON.stringify({name,phone:mobile})
            })

            const data=await response.json()
            console.log(data)
            if(data.success){
                setResult(data.appointments)
                console.log(data.appointments)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
                toast.error(error.message)
        }
    }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Search Patient</h2>

      <Input
        placeholder="Enter patient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSearch} disabled={loading} className="w-full mb-4">
        {loading ? 'Searching...' : 'Search'}
      </Button>

      {result && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Patient Found:</h3>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Mobile:</strong> {result.mobile}</p>
            <p><strong>Age:</strong> {result.age}</p>
            {/* Add more fields as needed */}
          </CardContent>
        </Card>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default PatientSearch;
