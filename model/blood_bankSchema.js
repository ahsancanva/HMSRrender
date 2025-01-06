const mongoose = require('mongoose');
const validator = require('validator');

const blood_bankSchema = new mongoose.Schema({

    blood_group: {
        type: String,
    },
    no_bag: {
        type: Number,
    },
    entry_date: {
        type: Date,
        default: Date.now()
    },
    bank: {
        type: Number,
    }
});

const Blood = mongoose.model('Blood', blood_bankSchema);
module.exports = Blood;