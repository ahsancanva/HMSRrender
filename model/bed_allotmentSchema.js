const mongoose = require('mongoose');
const validator = require('validator');

const bed_allotmentSchema = new mongoose.Schema({
    bed_no:{
        type:Number,
    },
    patient_name:{
        type:String,
    },
    bed_type:{
        type:String,
    },
    allotment_date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type:Number,
    },
    discharge_date:{
        type: Date,
        default: Date.now()
    },
    email:{
        type:String,
    },
    mobile:{
        type:Number,
    },
    bed_allotment:{
        type:Number,
    },
});

const Bed = mongoose.model('Bed', bed_allotmentSchema);
module.exports = Bed;