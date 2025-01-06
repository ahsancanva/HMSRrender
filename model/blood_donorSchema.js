const mongoose = require('mongoose');
const validator = require('validator');

const blood_donorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    gender: {
        type: String,
    },
    age: {
        type: Number,
    },
    blood_group: {
        type: String,
    },
    no_bag: {
        type: Number,
    },
    donation_date: {
        type: Date,
        default: Date.now()
    },
    blood_donor: {
        type: Number,
    }
});

const BloodDonor = mongoose.model('BloodDonor', blood_donorSchema);
module.exports = BloodDonor;