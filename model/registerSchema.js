const mongoose = require('mongoose');
const validator = require('validator');

const registerSchema = new mongoose.Schema({
    
    name:{
        type:String,
    },
    mobile:{
        type:Number,
    },
    image:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
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

const Register = mongoose.model('Register', registerSchema);
module.exports = Register;