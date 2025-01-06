const express = require('express');
const path = require('path')
const ejs = require('ejs');
const multer = require('multer')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const session = require('express-session');
const bodyParser = require('body-parser')
const randomstring = require("randomstring");
const ExcelJS = require('exceljs');


// import the schema's file
const registerSchema = require('../model/registerSchema');
const Register = require('../model/registerSchema');
const appointmentSchema = require('../model/appointmentSchema')
const Appointment = require('../model/appointmentSchema')
const prescriptionSchema = require('../model/prescriptionSchema')
const Prescription = require('../model/prescriptionSchema')
const medicineSchema = require('../model/medicineSchema')
const Medicine = require('../model/medicineSchema')
const departmentSchema = require('../model/department')
const Department = require('../model/department')
const operationSchema = require('../model/operationSchema')
const Operation = require('../model/operationSchema')
const birth_reportSchema = require('../model/birth_reportSchema')
const Birth = require('../model/birth_reportSchema')
const death_reportSchema = require('../model/death_reportSchema')
const Death = require('../model/death_reportSchema')
const bed_allotmentSchema = require('../model/bed_allotmentSchema')
const Bed = require('../model/bed_allotmentSchema')
const blood_bankSchema = require('../model/blood_bankSchema')
const Blood = require('../model/blood_bankSchema')
// authentication
const pharmaauth= require('../middleware/pharmaauth');

// router
// const pharmaRout = express.Router();
const pharmaRout = express();

//  middleware
pharmaRout.use(bodyParser.urlencoded({ extended: false }))
pharmaRout.use(bodyParser.json())
pharmaRout.use(session({
  secret: 'keyboard cat'
}))

// // view engine for pharma
pharmaRout.set('view engine', 'ejs');
pharmaRout.set('views', './views/pharma')


// ==========================================================================
// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../static/image'))
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + name) //not-working
    // cb(null, file.fieldname + name) //not-working
    // cb(null, name)  //not-working
    // cb(null, file.fieldname) //not-working
  }
})

const upload = multer({ storage: storage })
// ==========================================================================

// ==========================================================================
// secure passwodr
const securepassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
  } catch (err) {
    console.log(err)
  }
}


// ==========================================================================
// sendmail
const sendResetPasswordMail = async (name, email, token) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "For Reset password Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/pharma/reset-password?token=${token}">Reset</a> Your password.
         <br><br> Please <a href="http://localhost:3000/pharma/login">login</a> here....`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}




// ====================================================================

// ==========================================================================
// sendVerifymail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password//  quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Registration Verification Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/verify?id=${user_id}">Verify</a> Your Mail.
         <br><br> Please <a href="http://localhost:3000/pharma/login">login</a> here....`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}

// ==========================================================================


// ==========================================================================
// sendVerifymail
const AddNewUser = async (name, email, password, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "pharma Add You and Verification Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/pharma/verify?id=${user_id}">Verify</a> Your Mail.
         <br><br> Your login Email : ${email}
         <br><br> Your login password : ${password}
        <br><br> Please <a href="http://localhost:3000/pharma/login">login</a> here....`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}


// ==========================================================================
// send_operation_report
const send_operation_report = async (operation_name, patient_name, sarjan_name, date, status, email, mobile, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Operation Repoort Mail ✔", // Subject line
      text: `WELL COME ${patient_name}`,
      html: `Hii ${patient_name},.
         <br> Your Operaton Name : ${operation_name},
         <br> Patient Name : ${patient_name},
         <br> Your Sarjan Name: ${sarjan_name},
         <br> Date of Operation : ${date},
         <br> Your Status : ${status},
         <br> Your Email : ${email},
         <br> Your mobile : ${mobile},
         <br>
        <br> Thanks --> Good Luck  `, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}
// send_Appointment_report
const send_appointment = async (patient_name, pharma_name, appointment_date, email, mobile, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Operation Repoort Mail ✔", // Subject line
      text: `WELL COME ${patient_name}`,
      html: `Hii ${patient_name},.
         <br> Patient Name : ${patient_name},
         <br> pharma Name : ${pharma_name},
         <br> Appointment Date : ${appointment_date},
         <br> Your Email : ${email},
         <br> Your mobile : ${mobile},
         <br>
        <br> Thanks --> Good Luck  `, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}
// send_operation_report
const send_prescription = async (issue_date, visit, patient_name, case_history, medication, quantity,amount, description, email, mobile, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Operation Repoort Mail ✔", // Subject line
      text: `WELL COME ${patient_name}`,
      html: `Hii ${patient_name},.
         <br> issue_Date : ${issue_date},
         <br> visit : ${visit},
         <br> Case History : ${case_history},
         <br> Medication : ${medication},
         <br> Drug Name : ${drug_name},
         <br> Drug Strength : ${drug_strength},
         <br> Quantity : ${quantity},
         <br> Amount : ${amount},
         <br> Dscription : ${description},

         <br> Your Email : ${email},
         <br> Your mobile : ${mobile},
         <br>
        <br> Thanks --> Good Luck  `, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}
// ==========================================================================
// send_birth_report
const send_birth_report = async (birth_type, patient_name, pharma_name, date, status, email, mobile, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Birth Repoort Mail ✔", // Subject line
      text: `WELL COME ${patient_name}`,
      html: `Hii ${patient_name},.
         <br> Your Birth_Type : ${birth_type},
         <br> Patient Name : ${patient_name},
         <br> Your pharma Name: ${pharma_name},
         <br> Date of Operation : ${date},
         <br> Your Status : ${status},
         <br> Your Email : ${email},
         <br> Your Mobile : ${mobile},
         <br>
        <br> Thanks --> Good Luck  `, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}
// send death report
const send_death_report = async (death_type, patient_name, pharma_name, date, status, email, mobile, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Death Repoort Mail ✔", // Subject line
      text: `WELL COME ${patient_name}`,
      html: `Hii ${patient_name},.
         <br> Your Death_Type : ${death_type},
         <br> Patient Name : ${patient_name},
         <br> Your pharma Name: ${pharma_name},
         <br> Date of Operation : ${date},
         <br> Your Status : ${status},
         <br> Your Email : ${email},
         <br> Your Mobile : ${mobile},
         <br>
        <br> Thanks`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}
// send bed_allotment
const send_bed_allotment = async (bed_no, patient_name, bed_type, allotment_date, status, discharge_date, email, mobile, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Bed Allotment Mail ✔", // Subject line
      text: `WELL COME ${patient_name}`,
      html: `Hii ${patient_name},.
         <br> Your Bed_no : ${bed_no},
         <br> Patient Name : ${patient_name},
         <br> Bed Type: ${bed_type},
         <br> Bed Allotment Date : ${allotment_date},
         <br> Your Status : ${status},
         <br> Bed Discharge Date : ${discharge_date},
         <br> Your Email : ${email},
         <br> Your Mobile : ${mobile},
         <br>
        <br> Thanks`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}

// Authentications

pharmaRout.get('/', pharmaauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.get('/login', pharmaauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await Department.findOne({ email: email });
    if (userData) {
      const isMatch = await bcrypt.compare(password, userData.password);
      if (isMatch) {
        if (userData.pharmacist == 0) {
          res.render('login', { message: 'Plese verify your email' })

        }
        else {
          req.session.user_id = userData._id;
          res.redirect('/pharma/pharma_dashboard')
        }
      }
      else {
        res.render('login', { message: 'Invalid login Detailed' })

      }
    }
    else {
      res.render('login', { message: 'Invalid login Detailed' })
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/logout', pharmaauth.isLogin, async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/pharma')
  } catch (err) {
    console.log(err)
  }
})



// ====================================================================
// forget password
pharmaRout.get('/forget', pharmaauth.isLogout, async (req, res) => {
  try {
    res.render('forget')
  } catch (err) {
    console.log(err)
  }
})


pharmaRout.post('/forget', pharmaauth.isLogout, async (req, res) => {
  try {
    const email = req.body.email;
    const forgetData = await Department.findOne({ email });
    if (forgetData) {
      if (forgetData.pharmacist == 0) {
        res.render('forget', { message: 'Please Verify Your mail' })
      }
      else {
        const randomString = randomstring.generate();
        const updateData = await Department.updateOne({ email }, { $set: { token: randomString } });
        sendResetPasswordMail(forgetData.name, forgetData.email, randomString);
        res.render('forget', { message: 'Please check Your mail. To Reset Your password' })
      }
    }
    else {
      res.render('forget', { message: 'User email not valid' })
    }

  } catch (err) {
    console.log(err)
  }
})



// Reset password
pharmaRout.get('/reset-password', pharmaauth.isLogout, async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await Department.findOne({ token });
    if (tokenData) {
      res.render('reset-password', { user_id: tokenData._id });
    }
    else {
      res.render('err', { message: 'Invalid Detailed' })
    }

  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/reset-password', async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;

    const secure_password = await securepassword(password);
    const updatedData = await Department.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
    res.redirect('/pharma')
  } catch (err) {
    console.log(err)
  }
})


//Mail Verification
pharmaRout.get('/verification', pharmaauth.isLogout, async (req, res) => {
  try {
    res.render('verification')
  } catch (err) {
    console.log(err)
  }
})


pharmaRout.post('/verification', async (req, res) => {
  try {
    const email = req.body.email;
    const MailVeri = await Department.findOne({ email });
    if (MailVeri) {
      // jo hum ne phale registration me mail ko verify kiya tha....
      // ussi method ko istmal karen ga............
      // Note:: laken SaveUser variable ki jgah MailVeri Variable ko use karen ga......
      sendVerifyMail(MailVeri.name, MailVeri.email, MailVeri._id);
      res.render('verification', { message: 'Please check Your E-mail and Verify your mail' })

    }
    else {
      res.render('verification', { message: 'Invalid Detailed' })
    }
  } catch (err) {
    console.log(err)
  }
})



// pharma dashboard 
pharmaRout.get('/pharma_dashboard', pharmaauth.isLogin, async (req, res) => {
  try {

    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('pharma_dashboard', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// // dashboard userlist ===> show user list
// pharmaRout.get('/user_list',pharmaauth.isLogin,async (req, res) => {
//   try {
//     const userData = await Register.find({is_admin:0});
//     res.render('user_list',{user:userData})
//   } catch (err) {
//     console.log(err)
//   }
// })

// pharmaprofile link
pharmaRout.get('/profile', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('profile', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

//pharma edit profile
pharmaRout.get('/edit', pharmaauth.isLogin, async (req, res) => {
  try {
    // const id = req.query.id;
    const editData = await Department.findById({ _id: req.query.id });
    if (editData) {
      res.render('edit', { user: editData })
    }
    else {
      res.redirect('/pharma/profile')
    }
  } catch (err) {
    console.log(err)
  }
})


// pharma update the profile
pharmaRout.post('/edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
      }
    });
    res.redirect('/pharma/profile')
  } catch (err) {
    console.log(err)
  }
})


// dashboard userlist ===> show user list and search
pharmaRout.get('/user_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      pharmacist: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      pharmacist: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('user_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// Add New User through pharma
pharmaRout.get('/user_add', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('user_add', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


pharmaRout.post('/user_add', upload.single('image'), async (req, res) => {
  try {
    const password = randomstring.generate(8);
    const spassword = await securepassword(password);
    const addUser = new Department({
      name: req.body.name,
      mobile: req.body.mobile,
      image: req.file.filename,
      email: req.body.email,
      password: spassword,
      pharmacist: 1
    });

    const UserSave = await addUser.save();
    if (UserSave) {
      AddNewUser(UserSave.name, UserSave.email, UserSave.password, UserSave._id);
      res.redirect('/pharma/user_list')
    }
    else {
      res.render('user_add', { message: 'Something WentWrong' })
    }
  } catch (err) {
    console.log(err)
  }
})




// edit user by amdin 
pharmaRout.get('/user_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('user_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/user_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/user_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        is_verified: req.body.verify,
        image: req.file.filename,
        email: req.body.email

      }
    });
    res.redirect('/pharma/user_list')
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/user_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('user_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// delete user by amdin 
pharmaRout.get('/user_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/user_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/user_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'doctr' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ pharmacist: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })

  } catch (err) {
    console.log(err)
  }
})

// pharmaRout.get('*', pharmaauth.isLogout, async (req, res) => {
//   try {
//     res.redirect('/')
//   } catch (err) {
//     console.log(err)
//   }
// })








//  medicine Module 
// =============================================================
// =============================================================
// =============================================================
// =============================================================

pharmaRout.get('/medicine', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('medicine', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.post('/medicine', async (req, res) => {
  try {
    const User = new Medicine({
      medicine_no: req.body.medicine_no,
      medicine_name: req.body.medicine_name,
      quantity:req.body.quantity,
      price: req.body.price,
      entry_date:req.body.entry_date,
      medicine: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/pharma/medicine_list')
    }
    else {
      res.render('medicine', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
pharmaRout.get('/medicine_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Medicine.find({
      medicine: 1,
      $or: [
        { medicine_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { medicine_no: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Medicine.find({
      medicine: 1,
      $or: [
        { medicine_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { medicine_no: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('medicine_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/medicine_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await  Medicine.findById({ _id: req.query.id })
    res.render('medicine_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
pharmaRout.get('/medicine_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Medicine.findById({ _id: id })
    if (userData) {
      res.render('medicine_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/medicine_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/medicine_edit', async (req, res) => {
  try {
    const updateData = await Medicine.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        medicine_no: req.body.medicine_no,
        medicine_name: req.body.medicine_name,
        quantity:req.body.quantity,
        price: req.body.price,
        entry_date:req.body.entry_date,
        medicine: 1,
      }
    });
    res.redirect('/pharma/medicine_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/medicine_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Medicine.deleteOne({ _id: id });
    res.redirect('/pharma/medicine_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/medicine_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'medicine_no', key: 'medicine_no' },
      { header: 'medicine_Name', key: 'medicine_name' },
      { header: 'quantity', key: 'quantity' },
      { header: 'price', key: 'price' },
      { header: 'entry_date', key: 'entry_date' },
    ];


    let counter = 1;
    const userData = await Medicine.find({ medicine: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})


// appointment Module 
// =============================================================
// =============================================================
// =============================================================
// =============================================================

pharmaRout.get('/appointment', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('appointment', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.post('/appointment',upload.single('image'), async (req, res) => {
  try {
    const User = new Appointment({
      patient_name: req.body.patient_name,
      pharma_name: req.body.pharma_name,
      image:req.file.filename,
      appointment_date:req.body.appointment_date,
      gender:req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      appointment: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_appointment(UserSave.patient_name, UserSave.pharma_name, UserSave.appointment_date, UserSave.email,UserSave.mobile, UserSave._id);
      res.redirect('/pharma/appointment_list')
    }
    else {
      res.render('appointment', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
pharmaRout.get('/appointment_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Appointment.find({
      appointment: 1,
      $or: [
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { pharma_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Appointment.find({
      appointment: 1,
      $or: [
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { pharma_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('appointment_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/appointment_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Appointment.findById({ _id: req.query.id })
    res.render('appointment_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
pharmaRout.get('/appointment_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Appointment.findById({ _id: id })
    if (userData) {
      res.render('appointment_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/appointment_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/appointment_edit',upload.single('image'), async (req, res) => {
  try {
    const updateData = await Appointment.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        patient_name: req.body.patient_name,
        pharma_name: req.body.pharma_name,
        image:req.file.filename,
        appointment_date:req.body.appointment_date,
        gender:req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        appointment: 1,
      }
    });
    res.redirect('/pharma/appointment_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/appointment_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Appointment.deleteOne({ _id: id });
    res.redirect('/pharma/appointment_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/appointment_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'pharma_Name', key: 'pharma_name' },
      { header: 'appointmentdate', key: 'appointmentdate' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
    ];


    let counter = 1;
    const userData = await Appointment.find({ appointment: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})



// Prescription Module 
// =============================================================
// =============================================================
// =============================================================
// =============================================================

pharmaRout.get('/prescription', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('prescription', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.post('/prescription',upload.single('image'), async (req, res) => {
  try {
    const User = new Prescription({
      date_of_issue: req.body.date_of_issue,
      visit: req.body.visit,
      patient_name: req.body.patient_name,
      case_history: req.body.case_history,
      medication: req.body.medication,
      drug_name: req.body.drug_name,
      drug_strength: req.body.drug_strength,
      quantity: req.body.quantity,
      amount: req.body.amount,
      description: req.body.description,
      image:req.file.filename,
      gender:req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      prescription: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_appointment(UserSave.date_of_issue,UserSave.visit,UserSave.patient_name, UserSave.case_history,UserSave.medication,UserSave.drug_name,UserSave.drug_strength,UserSave.quantity,UserSave.amount,UserSave.description,  UserSave.email,UserSave.mobile, UserSave._id);
      res.redirect('/pharma/prescription_list')
    }
    else {
      res.render('prescription', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
pharmaRout.get('/prescription_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Prescription.find({
      prescription: 1,
      $or: [
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { case_history: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Prescription.find({
      prescription: 1,
      $or: [
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { case_history: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('prescription_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/prescription_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Prescription.findById({ _id: req.query.id })
    res.render('prescription_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
pharmaRout.get('/prescription_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Prescription.findById({ _id: id })
    if (userData) {
      res.render('Prescription_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/prescription_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/prescription_edit',upload.single('image'), async (req, res) => {
  try {
    const updateData = await Prescription.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        date_of_issue: req.body.date_of_issue,
        visit: req.body.visit,
        patient_name: req.body.patient_name,
        case_history: req.body.case_history,
        medication: req.body.medication,
        drug_name: req.body.drug_name,
        drug_strength: req.body.drug_strength,
        quantity: req.body.quantity,
        amount: req.body.amount,
        description: req.body.description,
        image:req.file.filename,
        gender:req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        prescription: 1,
      }
    });
    res.redirect('/pharma/prescription_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/prescription_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Prescription.deleteOne({ _id: id });
    res.redirect('/pharma/prescription_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/prescription_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'date_of_entry', key: 'date_of_entry' },
      { header: 'visit', key: 'visit' },
      { header: 'case_history', key: 'case_history' },
      { header: 'medication', key: 'medication' },
      { header: 'drug_name', key: 'drug_name' },
      { header: 'drug_strength', key: 'drug_strength' },
      { header: 'quantity', key: 'quantity' },
      { header: 'amount', key: 'amount' },
      { header: 'description', key: 'description' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
    ];


    let counter = 1;
    const userData = await Prescription.find({ prescription: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})





// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// all departement 

pharmaRout.get('/department', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('department', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.post('/department', upload.single('image'), async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Department({
      name: req.body.name,
      mobile: req.body.mobile,
      image: req.file.filename,
      gender:req.body.gender,
      department: req.body.department,
      email: req.body.email,
      reception: req.body.reception,
      pharma: req.body.pharma,
      nurse: req.body.nurse,
      patient: req.body.patient,
      appointment: req.body.appointment,
      accountant: req.body.accountant,
      lab: req.body.lab,
      pharmacist: req.body.pharmacist,
      bedallotment: req.body.bedallotment,
      bloodbank: req.body.bloodbank,
      password: spassword,
      is_verified: req.body.verify,
      is_admin:0
    });

    const UserSave = await User.save();
    if (UserSave) {
      sendVerifyMail(req.body.name, req.body.email, UserSave._id);
      AddNewUser(UserSave.name, UserSave.email, UserSave.password, UserSave._id);
      if (UserSave.reception) {
        res.redirect('/pharma/reception_list')
      }
      else if (UserSave.pharma) {
        res.redirect('/pharma/pharma_list')
      }
      else if (UserSave.nurse) {
        res.redirect('/pharma/nurse_list')
      }
      else if (UserSave.patient) {
        res.redirect('/pharma/patient_list')
      }
      else if (UserSave.appointment) {
        res.redirect('/pharma/appointment_list')
      }
      else if (UserSave.accountant) {
        res.redirect('/pharma/accountant_list')
      }
      else if (UserSave.pharmacist) {
        res.redirect('/pharma/pharmacist_list')
      }
      else if (UserSave.lab) {
        res.redirect('/pharma/lab_list')
      }
      else if (UserSave.bedallotment) {
        res.redirect('/pharma/bedallotment_list')
      }
      else {
        res.redirect('/pharma/bloodbank_list')
      }
      // res.render('pharma_list', { message: 'your registraion has been successfull. Please verify your mail' })
    }
    else {
      res.render('department', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})



// reception module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/reception_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      reception: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      reception: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('reception_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
pharmaRout.get('/reception_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('reception_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/reception_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/reception_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/reception_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/reception_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/reception_list')
  } catch (err) {
    console.log(err)
  }
})
// view recepton 
pharmaRout.get('/reception_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('reception_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// Export data in excel form
pharmaRout.get('/reception_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ reception: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})



//pharma Module
pharmaRout.get('/doctor_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      doctor: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      doctor: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('doctor_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
pharmaRout.get('/doctor_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('doctor_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/doctor_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/doctor_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/doctor_list')
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/doctor_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('doctor_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/doctor_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/doctor_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
pharmaRout.get('/doctor_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ doctor: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})

// Nurse module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/nurse_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      nurse: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      nurse: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('nurse_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
pharmaRout.get('/nurse_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('nurse_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/nurse_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/nurse_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/nurse_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/nurse_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/nurse_list')
  } catch (err) {
    console.log(err)
  }
})

// view nurse 
pharmaRout.get('/nurse_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('nurse_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/nurse_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ nurse: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})



// patient module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/patient_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      patient: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      patient: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('patient_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
pharmaRout.get('/patient_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('patient_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/patient_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/patient_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/patient_list')
  } catch (err) {
    console.log(err)
  }
})

// view nurse 
pharmaRout.get('/patient_view', pharmaauth.isLogin, async (req, res) => { 
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('patient_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/patient_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/patient_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
pharmaRout.get('/patient_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ patient: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})





// Accountant module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/accountant_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      accountant: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      accountant: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('accountant_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
pharmaRout.get('/accountant_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('accountant_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/accountant_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/accountant_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/accountant_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/accountant_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/accountant_list')
  } catch (err) {
    console.log(err)
  }
})

// accountant view 
pharmaRout.get('/accountant_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('accountant_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// Export data in excel form
pharmaRout.get('/accountant_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ accountant: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})


// pharmacist module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/pharmacist_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      pharmacist: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      pharmacist: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('pharmacist_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
pharmaRout.get('/pharmacist_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('pharmacist_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/pharmacist_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/pharmacist_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/pharmacist_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/pharmacist_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/pharmacist_list')
  } catch (err) {
    console.log(err)
  }
})

// pharmacist view

pharmaRout.get('/pharmacist_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('pharmacist_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/pharmacist_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ pharmacist: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})


// labouratories module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/lab_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      lab: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      lab: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('lab_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
pharmaRout.get('/lab_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('lab_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/lab_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/lab_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
        is_verified: req.body.verify,
      }
    });
    res.redirect('/pharma/lab_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/lab_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/pharma/lab_list')
  } catch (err) {
    console.log(err)
  }
})

// lab view

pharmaRout.get('/lab_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('lab_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/lab_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'is_admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ lab: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})






// operation Module 
// =============================================================

pharmaRout.get('/operation', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('operation', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.post('/operation', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Operation({
      operation_name: req.body.operation_name,
      patient_name: req.body.patient_name,
      sarjan_name: req.body.sarjan_name,
      status:req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      date:req.body.date,
      operation: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_operation_report(UserSave.operation_name, UserSave.patient_name, UserSave.sarjan_name, UserSave.date, UserSave.status, UserSave.email,UserSave.mobile, UserSave._id);
      res.redirect('/pharma/operation_list')
    }
    else {
      res.render('operation', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})


// operation module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/operation_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Operation.find({
      operation: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Operation.find({
      operation: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('operation_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


pharmaRout.get('/operation_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Operation.findById({ _id: req.query.id })
    res.render('operation_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// edit user by amdin 
pharmaRout.get('/operation_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Operation.findById({ _id: id })
    if (userData) {
      res.render('operation_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/operation_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/operation_edit', async (req, res) => {
  try {
    const updateData = await Operation.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        operation_name: req.body.operation_name,
        patient_name: req.body.patient_name,
        sarjan_name: req.body.sarjan_name,
        status:req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        date:req.body.date,
        operation: 1,
      }
    });
    res.redirect('/pharma/operation_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/operation_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Operation.deleteOne({ _id: id });
    res.redirect('/pharma/operation_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/operation_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'operation_Name', key: 'operation_name' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'sarjan_name', key: 'sarjan_name' },
      { header: 'date', key: 'date' },
      { header: 'status', key: 'status' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
    ];


    let counter = 1;
    const userData = await Operation.find({ operation: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})






// Birth_Report Module 
// =============================================================

pharmaRout.get('/birth_report', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('birth_report', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
pharmaRout.post('/birth_report', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Birth({
      birth_type: req.body.birth_type,
      patient_name: req.body.patient_name,
      pharma_name: req.body.pharma_name,
      date:req.body.date,
      status:req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      birth_report: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        send_birth_report(UserSave.birth_type, UserSave.patient_name, UserSave.pharma_name, UserSave.date, UserSave.status, UserSave.email,UserSave.mobile, UserSave._id);
        res.redirect('/pharma/birth_report_list')
    }
    else {
      res.render('birth_report', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})


// birth module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/birth_report_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Birth.find({
      birth_report: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Birth.find({
      birth_report: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('birth_report_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


pharmaRout.get('/birth_report_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Birth.findById({ _id: req.query.id })
    res.render('birth_report_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
pharmaRout.get('/birth_report_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Birth.findById({ _id: id })
    if (userData) {
      res.render('birth_report_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/birth_report_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/birth_report_edit', async (req, res) => {
  try {
    const updateData = await Birth.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        birth_type: req.body.birth_type,
        patient_name: req.body.patient_name,
        pharma_name: req.body.pharma_name,
        date:req.body.date,
        status:req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        birth_report: 1,
      }
    });
    res.redirect('/pharma/birth_report_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/birth_report_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Birth.deleteOne({ _id: id });
    res.redirect('/pharma/birth_report_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/birth_report_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Birth_Type', key: 'birth_type' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'pharma_name', key: 'pharma_name' },
      { header: 'date', key: 'date' },
      { header: 'status', key: 'status' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
    ];


    let counter = 1;
    const userData = await Birth.find({ birth_report: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})



// death module 
// =========================================================================
pharmaRout.get('/death_report', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('death_report', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/death_report', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Death({
      death_type: req.body.death_type,
      patient_name: req.body.patient_name,
      pharma_name: req.body.pharma_name,
      date:req.body.date,
      status:req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      death_report: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        send_death_report(UserSave.birth_type, UserSave.patient_name, UserSave.pharma_name, UserSave.date, UserSave.status, UserSave.email,UserSave.mobile, UserSave._id);
        res.redirect('/pharma/death_report_list')
    }
    else {
      res.render('death_report', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})
// death module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/death_report_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Death.find({
      death_report: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Death.find({
      death_report: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('death_report_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


pharmaRout.get('/death_report_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Death.findById({ _id: req.query.id })
    res.render('death_report_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// edit user by amdin 
pharmaRout.get('/death_report_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Death.findById({ _id: id })
    if (userData) {
      res.render('death_report_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/death_report_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/death_report_edit', async (req, res) => {
  try {
    const updateData = await Death.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        death_type: req.body.death_type,
        patient_name: req.body.patient_name,
        pharma_name: req.body.pharma_name,
        date:req.body.date,
        status:req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        death_report: 1,
      }
    });
    res.redirect('/pharma/death_report_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/death_report_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Death.deleteOne({ _id: id });
    res.redirect('/pharma/death_report_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/death_report_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Death_Type', key: 'death_type' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'pharma_name', key: 'pharma_name' },
      { header: 'date', key: 'date' },
      { header: 'status', key: 'status' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
    ];


    let counter = 1;
    const userData = await Death.find({ death_report: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})




// Bed_allotment module 
// =========================================================================
pharmaRout.get('/bed_allotment', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('bed_allotment', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/bed_allotment', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Bed({
      bed_no: req.body.bed_no,
      patient_name: req.body.patient_name,
      bed_type: req.body.bed_type,
      allotment_date:req.body.allotment_date,
      status:req.body.status,
      discharge_date:req.body.discharge_date,
      email: req.body.email,
      mobile: req.body.mobile,
      bed_allotment: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        send_bed_allotment(UserSave.bed_type, UserSave.patient_name, UserSave.bed_type, UserSave.allotment_date, UserSave.status, UserSave.discharge_date, UserSave.email, UserSave.mobile, UserSave._id);
        res.redirect('/pharma/bed_allotment_list')
    }
    else {
      res.render('bed_allotment', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})
// death module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/bed_allotment_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Bed.find({
      bed_allotment: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Bed.find({
      bed_allotment: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('bed_allotment_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/bed_allotment_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Bed.findById({ _id: req.query.id })
    res.render('bed_allotment_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// edit user by amdin 
pharmaRout.get('/bed_allotment_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Bed.findById({ _id: id })
    if (userData) {
      res.render('bed_allotment_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/bed_allotment_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/bed_allotment_edit', async (req, res) => {
  try {
    const updateData = await Bed.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        bed_no: req.body.bed_no,
        patient_name: req.body.patient_name,
        bed_type: req.body.bed_type,
        allotment_date:req.body.allotment_date,
        status:req.body.status,
        discharge_date:req.body.discharge_date,
        email: req.body.email,
        mobile: req.body.mobile,
        bed_allotment: 1,
      }
    });
    res.redirect('/pharma/bed_allotment_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/bed_allotment_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Bed.deleteOne({ _id: id });
    res.redirect('/pharma/bed_allotment_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/bed_allotment_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'patient_Name', key: 'patient_name' },
      { header: 'Bed_Type', key: 'bed_type' },
      { header: 'allotment_date', key: 'allotment_date' },
      { header: 'status', key: 'status' },
      { header: 'discharge_date', key: 'discharge_date' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
    ];


    let counter = 1;
    const userData = await Bed.find({bed_allotment: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})




// Blood module 
// =========================================================================
pharmaRout.get('/blood_bank', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('blood_bank', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/blood_bank', async (req, res) => {
  try {
    const User = new Blood({
      blood_group: req.body.blood_group,
      no_bag: req.body.no_bag,
      entry_date:req.body.entry_date,
      bank: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        res.redirect('/pharma/blood_bank_list')
    }
    else {
      res.render('blood_bank', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})
// death module 
// dashboard userlist ===> show user list and search
pharmaRout.get('/blood_bank_list', pharmaauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Blood.find({
      bank: 1,
      $or: [
        { blood_group: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Blood.find({
      bank: 1,
      $or: [
        { blood_group: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('blood_bank_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.get('/blood_bank_view', pharmaauth.isLogin, async (req, res) => {
  try {
    const userData = await Blood.findById({ _id: req.query.id })
    res.render('blood_bank_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
// edit user by amdin 
pharmaRout.get('/blood_bank_edit', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Blood.findById({ _id: id })
    if (userData) {
      res.render('blood_bank_edit', { user: userData });
    }
    else {
      res.redirect('/pharma/Blood_bank_list')
    }
  } catch (err) {
    console.log(err)
  }
})

pharmaRout.post('/blood_bank_edit', async (req, res) => {
  try {
    const updateData = await Blood.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        blood_group: req.body.blood_group,
        no_bag: req.body.no_bag,
        entry_date:req.body.entry_date,
      }
    });
    res.redirect('/pharma/blood_bank_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
pharmaRout.get('/blood_bank_delete', pharmaauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Blood.deleteOne({ _id: id });
    res.redirect('/pharma/blood_bank_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
pharmaRout.get('/blood_bank_export', pharmaauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Blood_group', key: 'blood_group' },
      { header: 'No_bag', key: 'no_bag' },
      { header: 'entry_date', key: 'entry_date' },
    ];


    let counter = 1;
    const userData = await Blood.find({blood_bank: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})








module.exports = pharmaRout;







