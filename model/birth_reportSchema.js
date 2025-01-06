const mongoose = require('mongoose');
const validator = require('validator');

const birth_reportSchema = new mongoose.Schema({
    
    birth_type:{
        type:String,
        default:'',
    },
    patient_name:{
        type:String,
    },
    doctor_name:{
        type:String,
    },
    date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type:Number,
    },
    email:{
        type:String,
    },
    mobile:{
        type:Number,
    },
    birth_report:{
        type:Number,
    },


});

const Birth = mongoose.model('Birth', birth_reportSchema);
module.exports = Birth;