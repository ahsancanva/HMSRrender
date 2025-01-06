const mongoose = require('mongoose');
const validator = require('validator');

const newinvoiceSchema = new mongoose.Schema({
    
    date:{
        type: Date,
        default: Date.now()
    },
    name:{
        type:String,
    },
    fathername:{
        type:String,
    },
    id_card:{
        type:String,
    },
    product_name:{
        type:String,
    },
    unit:{
        type:Number,

    },
    price:{
        type:Number,

    },
    amount:{
        type:Number,


    },
    total:{
        type:String,

    },
    newinvoice: {
        type: Number,
    }

});

const Newinvoice = mongoose.model('Newinvoice', newinvoiceSchema);
module.exports = Newinvoice;