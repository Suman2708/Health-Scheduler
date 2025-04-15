import mongoose from "mongoose";

// const appointmentSchema=({
//     userId:{type:String,required:true},
//     docId:{type:String,required:true},
//     slotDate:{type:String,required:true},
//     slotTime:{type:String,required:true},
//     userData:{type:Object,required:true},
//     docData:{type:Object,required:true},
//     amount:{type:Number,required:true},
//     date:{type:Number,required:true},
//     cancelled:{type:Boolean,default:false},
//     payment:{type:Boolean,default:false},
//     isCompleted:{type:Boolean,default:false}
// })


const appointmentSchema = new mongoose.Schema({
    userId:        { type: String, required: true },
    docId:         { type: String, required: true },
    slotDate:      { type: String, required: true },
    previous_date: { type: String }, 
    slotTime:      { type: String, required: true },
    userData:      { type: Object, required: true },
    docData:       { type: Object, required: true },
    amount:        { type: Number, required: true },
    date:          { type: Number, required: true },
    cancelled:     { type: Boolean, default: false },
    payment:       { type: Boolean, default: false },
    isCompleted:   { type: Boolean, default: false }
  });
  

  appointmentSchema.pre('save', function (next) {
    if (!this.previous_date) {
      this.previous_date = this.slotDate;
    }
    next();
  });

const appointmentModel=mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)

export default appointmentModel