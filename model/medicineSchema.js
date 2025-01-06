const mongoose = require('mongoose');
const validator = require('validator');

const medicineSchema = new mongoose.Schema({
    medicine_no: {
        type: Number,
    },
    medicine_name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    entry_date: {
        type: Date,
        default: Date.now()
    },
    medicine: {
        type: Number,
    },


});

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;