// const mongoose = require('mongoose');
// mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://localhost:27017/HMS',{useNewUrlParser:true,useUnifiedTopology:true,family:4})
// .then(()=>{
//     console.log('connection successfull');
// })
// .catch((err)=>{
//     console.log(err)
// });

require('dotenv').config()
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

module.exports=connectDB;