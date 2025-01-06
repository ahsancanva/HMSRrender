const mongoose = require('mongoose');
const validator = require('validator');

const prescriptionSchema = new mongoose.Schema({

    name:{
        type:String,
    },
    id_card:{
        type:String,

    },
    address:{
        type:String,
    },
    fathername:{
        type:String,
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    clinic:{
        type:String,

    },
    visit:{
        type:String,

    },
    education:{
        type:String,

    },
    complaints:{
        type:String,

    },
    history:{
        type:String,

    },
    examination:{
        type:String,

    },
    treatment:{
        type:String,

    },
    date:{
        type: Date,
        default: Date.now()
    },
    prescription: {
        type: Number,
    }

});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;