const mongoose = require('mongoose');
const validator = require('validator');

const opdSchema = new mongoose.Schema({

    name:{
        type:String,
    },
    dob:{
        type: Date,
        default: Date.now()
    },
    address:{
        type:String,
    },
    fathername:{
        type:String,
    },
    id_card:{
        type:String,

    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    gender:{
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
    date:{
        type: Date,
        default: Date.now()
    },
    opd: {
        type: Number,
    }

});

const Opd = mongoose.model('Opd', opdSchema);
module.exports = Opd;