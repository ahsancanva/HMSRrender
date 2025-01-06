const mongoose = require('mongoose');
const validator = require('validator');

const newsletterSchema = new mongoose.Schema({
    

    email:{
        type:String,
    },
    newsletter: {
        type: Number,
    },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
module.exports = Newsletter;