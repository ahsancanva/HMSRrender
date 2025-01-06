const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    subject:{
        type:String,
    },
    message:{
        type:String,
    },
    contact: {
        type: Number,
    },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;