const mongoose = require('mongoose');
const validator = require('validator');

const paymentSchema = new mongoose.Schema({
    
    fullname:{
        type:String,
    },
    email:{
        type:String,
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    zip:{
        type:Number,
    },
    cardname:{
        type:String,
    },
    cardnumber:{
        type:Number,
    },
    expmonth:{
        type:String,
    },
    expyear:{
        type:String,
    },
    expmonth:{
        type:String,
    },
    cvv:{
        type:Number,
    },
    payment:{
        type: Number,
    },
    token:{
        type:String,
        default:''
    }

});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;