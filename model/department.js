const mongoose = require('mongoose');
const validator = require('validator');

const departmentSchema = new mongoose.Schema({
    
    name:{
        type:String,
    },
    mobile:{
        type:Number,
    },
    image:{
        type:String,
    },
    gender:{
        type:Number,
    },
    department:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    reception:{
        type: Number,
    },
    doctor:{
        type: Number,
    },
    nurse:{
        type: Number,
    },
    patient:{
        type: Number,
    },
    appointment:{
        type: Number,
    },
    accountant:{
        type: Number,
    },
    lab:{
        type: Number,
    },
    pharmacist:{
        type: Number,
    },
    bedallotment:{
        type: Number,
    },
    bloodbank:{
        type: Number,
    },
    is_admin: {
        type: Number,
    },
    is_verified: {
        type: Number,
        default: 0
    },
    token:{
        type:String,
        default:''
    }

});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;