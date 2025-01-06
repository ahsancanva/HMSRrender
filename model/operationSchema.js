const mongoose = require('mongoose');
const validator = require('validator');

const operationSchema = new mongoose.Schema({
    
    operation_name:{
        type:String,
    },
    patient_name:{
        type:String,
    },
    sarjan_name:{
        type:String,
    },
    date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type:Number,
    },
    operation:{
        type:Number,
    },
    email:{
        type:String,
    },
    mobile:{
        type:Number,
    }



});

const Operation = mongoose.model('Operation', operationSchema);
module.exports = Operation;