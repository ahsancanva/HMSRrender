const mongoose = require('mongoose');
const validator = require('validator');

const death_reportSchema = new mongoose.Schema({
    
    death_type:{
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
    death_report:{
        type:Number,
    },

});

const Death = mongoose.model('Death', death_reportSchema);
module.exports = Death;