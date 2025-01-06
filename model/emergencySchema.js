const mongoose = require('mongoose');
const validator = require('validator');

const emergencySchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now()
    },
    name:{
        type:String,
    },
    lastname:{
        type:String,
    },
    id_card:{
        type:String,

    },
    dob:{
        type: Date,
        default: Date.now()
    },
    image:{
        type:String,
    },
    gender:{
        type:String,
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    relation:{
        type:String,
    },
    address:{
        type:String,
    },
    heart_rate:{
        type:String,

    },
    blood_pressure:{
        type:String,

    },
    respiratory_rate:{
        type:String,

    },
    temperature:{
        type:String,

    },
    oxigen:{
        type:String,

    },
    height:{
        type:String,
    },
    weight:{
        type:String,
    },
    disease:{
        type:String,

    },
    death:{
        type:String,

    },
    bed_no:{
        type:String,


    },
    alergies: {
        type:String,
    },
    emergency: {
        type: Number,
    }

});

const Emergency = mongoose.model('Emergency', emergencySchema);
module.exports = Emergency;