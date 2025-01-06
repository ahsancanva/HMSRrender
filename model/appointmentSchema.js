const mongoose = require('mongoose');
const validator = require('validator');

const appointmentSchema = new mongoose.Schema({
    
    patient_name:{
        type:String,
    },
    doctor_name:{
        type:String,
    },
    image:{
        type:String,
    },
    appointment_date:{
        type: Date,
        default: Date.now()
    },
    time:{
        type:String,
    },
    amount:{
        type:String,
    },
    gender:{
        type:Number,
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
    },
    appointment: {
        type: Number,
    },
    token:{
        type:String,
        default:''
    }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;