import doctorModel from "../models/doctorModel.js"


const changeAvailability=async(req,res)=>{

    try {

        const {docId}=req.body
        // console.log(docId)
        const docData=await doctorModel.findById(docId)
        // console.log(docData.available)
        const updatedDoc =await doctorModel.findByIdAndUpdate(docId,{available: !docData.available},{new:true})
        res.json({success:true,message:'Availability Changed', available: updatedDoc.available })
        
    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})
    }

}


const doctorList=async(req,res)=>{
    try {
        
        const doctors= await doctorModel.find({}).select('-password')
        res.status(200).json(doctors)

    } catch (error) {
        
        res.status(500).json("Internal Server Error")
        console.log(error)
    }
}

export {changeAvailability,doctorList}