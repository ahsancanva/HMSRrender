require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const path = require('path');
const app = express();
const port = process.env.PORT || 3000

// import the external files
const connection = require('./connection');
const connectDB = require('./connection');
// import the user_router file
const routs = require('./routs/routs');
const router = require('./routs/routs');
app.use('/',router);  

// import the admin_router file
const admin_routs = require('./routs/admin_routs');
const adminRout = require('./routs/admin_routs');
app.use('/admin',adminRout);

const doctor_routs = require('./routs/doctor_routs');
const doctorRout = require('./routs/doctor_routs');
app.use('/doctor',doctorRout);

const nurse_routs = require('./routs/nurse_routs');
const nurseRout = require('./routs/nurse_routs');
app.use('/nurse',nurseRout);

const reception_routs = require('./routs/reception_routs');
const receptionRout = require('./routs/reception_routs');
app.use('/reception',receptionRout);

const pharma_routs = require('./routs/pharma_routs');
const pharmaRout = require('./routs/pharma_routs');
app.use('/pharma',pharmaRout);

const lab_routs = require('./routs/lab_routs');
const labRout = require('./routs/lab_routs');
app.use('/lab',labRout);

const accountant_routs = require('./routs/accountant_routs');
const accountantRout = require('./routs/accountant_routs');
app.use('/accountant',accountantRout);

// service the static foleder
app.use(express.static(path.join(__dirname, 'static'))); 

connectDB().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port  http://localhost:${port}`);
    });
})
