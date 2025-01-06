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
const receptionauth = require('../middleware/receptionauth');

// router
// const receptionRout = express.Router();
const receptionRout = express();

//  middleware
receptionRout.use(bodyParser.urlencoded({ extended: false }))
receptionRout.use(bodyParser.json())
receptionRout.use(session({
  secret: 'keyboard cat'
}))

// // view engine for reception
receptionRout.set('view engine', 'ejs');
receptionRout.set('views', './views/reception')


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
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/reception/reset-password?token=${token}">Reset</a> Your password.
         <br><br> Please <a href="http://localhost:3000/reception/login">login</a> here....`, // html body
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
         <br><br> Please <a href="http://localhost:3000/login">login</a> here....`, // html body
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
      subject: "reception Add You and Verification Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/verify?id=${user_id}">Verify</a> Your Mail.
         <br><br> Your login Email : ${email}
         <br><br> Your login password : ${password}
        <br><br> Please <a href="http://localhost:3000/login">login</a> here....`, // html body
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
const send_appointment = async (patient_name, doctor_name, appointment_date, email, mobile, user_id) => {
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
         <br> doctor Name : ${doctor_name},
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
const send_birth_report = async (birth_type, patient_name, doctor_name, date, status, email, mobile, user_id) => {
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
         <br> Your Doctor Name: ${doctor_name},
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
const send_death_report = async (death_type, patient_name, doctor_name, date, status, email, mobile, user_id) => {
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
         <br> Your Doctor Name: ${doctor_name},
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

receptionRout.get('/', receptionauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})
receptionRout.get('/login', receptionauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await Department.findOne({ email: email });
    if (userData) {
      const isMatch = await bcrypt.compare(password, userData.password);
      if (isMatch) {
        if (userData.reception == 0) {
          res.render('login', { message: 'Plese verify your email' })

        }
        else {
          req.session.user_id = userData._id;
          res.redirect('/reception/reception_dashboard')
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

receptionRout.get('/logout', receptionauth.isLogin, async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/reception')
  } catch (err) {
    console.log(err)
  }
})



// ====================================================================
// forget password
receptionRout.get('/forget', receptionauth.isLogout, async (req, res) => {
  try {
    res.render('forget')
  } catch (err) {
    console.log(err)
  }
})


receptionRout.post('/forget', receptionauth.isLogout, async (req, res) => {
  try {
    const email = req.body.email;
    const forgetData = await Department.findOne({ email });
    if (forgetData) {
      if (forgetData.reception == 0) {
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
receptionRout.get('/reset-password', receptionauth.isLogout, async (req, res) => {
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

receptionRout.post('/reset-password', async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;

    const secure_password = await securepassword(password);
    const updatedData = await Department.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
    res.redirect('/reception')
  } catch (err) {
    console.log(err)
  }
})


//Mail Verification
receptionRout.get('/verification', receptionauth.isLogout, async (req, res) => {
  try {
    res.render('verification')
  } catch (err) {
    console.log(err)
  }
})


receptionRout.post('/verification', async (req, res) => {
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



// reception dashboard 
receptionRout.get('/reception_dashboard', receptionauth.isLogin, async (req, res) => {
  try {

    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('reception_dashboard', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// // dashboard userlist ===> show user list
// receptionRout.get('/user_list',receptionauth.isLogin,async (req, res) => {
//   try {
//     const userData = await Department.find({reception:0});
//     res.render('user_list',{user:userData})
//   } catch (err) {
//     console.log(err)
//   }
// })

// receptionprofile link
receptionRout.get('/profile', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('profile', { user: userData })
  } catch (err) {
    console.log(err)
  }
})



//reception edit profile
receptionRout.get('/edit', receptionauth.isLogin, async (req, res) => {
  try {
    // const id = req.query.id;
    const editData = await Department.findById({ _id: req.query.id });
    if (editData) {
      res.render('edit', { user: editData })
    }
    else {
      res.redirect('/reception/profile')
    }
  } catch (err) {
    console.log(err)
  }
})


// reception update the profile
receptionRout.post('/edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
      }
    });
    res.redirect('/reception/profile')
  } catch (err) {
    console.log(err)
  }
})


// dashboard userlist ===> show user list and search
receptionRout.get('/user_list', receptionauth.isLogin, async (req, res) => {
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
      reception: 0,
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
      reception: 0,
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


// Add New User through reception
receptionRout.get('/user_add', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('user_add', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


receptionRout.post('/user_add', upload.single('image'), async (req, res) => {
  try {
    const password = randomstring.generate(8);
    const spassword = await securepassword(password);
    const addUser = new Department({
      name: req.body.name,
      mobile: req.body.mobile,
      image: req.file.filename,
      email: req.body.email,
      password: spassword,
      reception: 0,

    });

    const UserSave = await addUser.save();
    if (UserSave) {
      AddNewUser(UserSave.name, UserSave.email, UserSave.password, UserSave._id);
      res.redirect('/reception/user_list')
    }
    else {
      res.render('user_add', { message: 'Something WentWrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.get('/user_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('user_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
receptionRout.get('/user_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('user_edit', { user: userData });
    }
    else {
      res.redirect('/reception/user_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/user_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/user_list')
  } catch (err) {
    console.log(err)
  }
})


// delete user by amdin 
receptionRout.get('/user_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/user_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/user_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Department.find({ reception: 0 });
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

// receptionRout.get('*', receptionauth.isLogout, async (req, res) => {
//   try {
//     res.redirect('/')
//   } catch (err) {
//     console.log(err)
//   }
// })


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

// appointment Module 
// =============================================================
// =============================================================
// =============================================================
// =============================================================

receptionRout.get('/appointment', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('appointment', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
receptionRout.post('/appointment',upload.single('image'), async (req, res) => {
  try {
    const User = new Appointment({
      patient_name: req.body.patient_name,
      doctor_name: req.body.doctor_name,
      image:req.file.filename,
      appointment_date:req.body.appointment_date,
      gender:req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      appointment: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_appointment(UserSave.patient_name, UserSave.doctor_name, UserSave.appointment_date, UserSave.email,UserSave.mobile, UserSave._id);
      res.redirect('/doctor/appointment_list')
    }
    else {
      res.render('appointment', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
receptionRout.get('/appointment_list', receptionauth.isLogin, async (req, res) => {
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
        { doctor_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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
        { doctor_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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

receptionRout.get('/appointment_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Appointment.findById({ _id: req.query.id })
    res.render('appointment_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/appointment_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Appointment.findById({ _id: id })
    if (userData) {
      res.render('appointment_edit', { user: userData });
    }
    else {
      res.redirect('/doctor/appointment_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/appointment_edit',upload.single('image'), async (req, res) => {
  try {
    const updateData = await Appointment.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        patient_name: req.body.patient_name,
        doctor_name: req.body.doctor_name,
        image:req.file.filename,
        appointment_date:req.body.appointment_date,
        gender:req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        appointment: 1,
      }
    });
    res.redirect('/doctor/appointment_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/appointment_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Appointment.deleteOne({ _id: id });
    res.redirect('/doctor/appointment_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/appointment_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'doctor_Name', key: 'doctor_name' },
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

receptionRout.get('/prescription', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('prescription', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
receptionRout.post('/prescription',upload.single('image'), async (req, res) => {
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
      res.redirect('/doctor/prescription_list')
    }
    else {
      res.render('prescription', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
receptionRout.get('/prescription_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/prescription_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Prescription.findById({ _id: req.query.id })
    res.render('prescription_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/prescription_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Prescription.findById({ _id: id })
    if (userData) {
      res.render('Prescription_edit', { user: userData });
    }
    else {
      res.redirect('/doctor/prescription_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/prescription_edit',upload.single('image'), async (req, res) => {
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
    res.redirect('/doctor/prescription_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/prescription_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Prescription.deleteOne({ _id: id });
    res.redirect('/doctor/prescription_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/prescription_export', receptionauth.isLogin, async (req, res) => {
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














// all departement 

receptionRout.get('/department', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('department', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
receptionRout.post('/department', upload.single('image'), async (req, res) => {
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
      doctor: req.body.doctor,
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
      is_admin: 0

    });

    const UserSave = await User.save();
    if (UserSave) {
      sendVerifyMail(req.body.name, req.body.email, UserSave._id);
      AddNewUser(UserSave.name, UserSave.email, UserSave.password, UserSave._id);
      if (UserSave.reception) {
        res.redirect('/reception/reception_list')
      }
      else if (UserSave.doctor) {
        res.redirect('/reception/doctor_list')
      }
      else if (UserSave.nurse) {
        res.redirect('/reception/nurse_list')
      }
      else if (UserSave.patient) {
        res.redirect('/reception/patient_list')
      }
      else if (UserSave.appointment) {
        res.redirect('/reception/appointment_list')
      }
      else if (UserSave.accountant) {
        res.redirect('/reception/accountant_list')
      }
      else if (UserSave.pharmacist) {
        res.redirect('/reception/pharmacist_list')
      }
      else if (UserSave.lab) {
        res.redirect('/reception/lab_list')
      }
      else if (UserSave.bedallotment) {
        res.redirect('/reception/bedallotment_list')
      }
      else {
        res.redirect('/reception/bloodbank_list')
      }
      // res.render('doctor_list', { message: 'your registraion has been successfull. Please verify your mail' })
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
receptionRout.get('/reception_list', receptionauth.isLogin, async (req, res) => {
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
receptionRout.get('/reception_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('reception_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/reception_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('reception_edit', { user: userData });
    }
    else {
      res.redirect('/reception/reception_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/reception_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/reception_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/reception_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/reception_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/reception_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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



//Doctor Module
receptionRout.get('/doctor_list', receptionauth.isLogin, async (req, res) => {
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

// doctor view
receptionRout.get('/doctor_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('doctor_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/doctor_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('doctor_edit', { user: userData });
    }
    else {
      res.redirect('/reception/doctor_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/doctor_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/doctor_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/doctor_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/doctor_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/doctor_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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
receptionRout.get('/nurse_list', receptionauth.isLogin, async (req, res) => {
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


receptionRout.get('/nurse_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('nurse_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/nurse_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('nurse_edit', { user: userData });
    }
    else {
      res.redirect('/reception/nurse_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/nurse_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/nurse_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/nurse_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/nurse_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/nurse_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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
receptionRout.get('/patient_list', receptionauth.isLogin, async (req, res) => {
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


receptionRout.get('/patient_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('patient_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/patient_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('patient_edit', { user: userData });
    }
    else {
      res.redirect('/reception/patient_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/patient_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/patient_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/patient_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/patient_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/patient_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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
receptionRout.get('/accountant_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/accountant_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('accountant_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
receptionRout.get('/accountant_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('accountant_edit', { user: userData });
    }
    else {
      res.redirect('/reception/accountant_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/accountant_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/accountant_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/accountant_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/accountant_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/accountant_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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
receptionRout.get('/pharmacist_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/pharmacist_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('pharmacist_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/pharmacist_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('pharmacist_edit', { user: userData });
    }
    else {
      res.redirect('/reception/pharmacist_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/pharmacist_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/pharmacist_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/pharmacist_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/pharmacist_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
receptionRout.get('/pharmacist_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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
receptionRout.get('/lab_list', receptionauth.isLogin, async (req, res) => {
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


receptionRout.get('/lab_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('lab_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
receptionRout.get('/lab_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('lab_edit', { user: userData });
    }
    else {
      res.redirect('/reception/lab_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/lab_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/reception/lab_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/lab_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/reception/lab_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/lab_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'reception', key: 'reception' },
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

receptionRout.get('/operation', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('operation', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
receptionRout.post('/operation', async (req, res) => {
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
      res.redirect('/reception/operation_list')
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
receptionRout.get('/operation_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/operation_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Operation.findById({ _id: req.query.id })
    res.render('operation_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/operation_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Operation.findById({ _id: id })
    if (userData) {
      res.render('operation_edit', { user: userData });
    }
    else {
      res.redirect('/reception/operation_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/operation_edit', async (req, res) => {
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
    res.redirect('/reception/operation_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/operation_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Operation.deleteOne({ _id: id });
    res.redirect('/reception/operation_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/operation_export', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/birth_report', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('birth_report', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
receptionRout.post('/birth_report', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Birth({
      birth_type: req.body.birth_type,
      patient_name: req.body.patient_name,
      doctor_name: req.body.doctor_name,
      date:req.body.date,
      status:req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      birth_report: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        send_birth_report(UserSave.birth_type, UserSave.patient_name, UserSave.doctor_name, UserSave.date, UserSave.status, UserSave.email,UserSave.mobile, UserSave._id);
        res.redirect('/reception/birth_report_list')
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
receptionRout.get('/birth_report_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/birth_report_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Birth.findById({ _id: req.query.id })
    res.render('birth_report_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
receptionRout.get('/birth_report_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Birth.findById({ _id: id })
    if (userData) {
      res.render('birth_report_edit', { user: userData });
    }
    else {
      res.redirect('/reception/birth_report_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/birth_report_edit', async (req, res) => {
  try {
    const updateData = await Birth.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        birth_type: req.body.birth_type,
        patient_name: req.body.patient_name,
        doctor_name: req.body.doctor_name,
        date:req.body.date,
        status:req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        birth_report: 1,
      }
    });
    res.redirect('/reception/birth_report_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/birth_report_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Birth.deleteOne({ _id: id });
    res.redirect('/reception/birth_report_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/birth_report_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Birth_Type', key: 'birth_type' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'doctor_name', key: 'doctor_name' },
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
receptionRout.get('/death_report', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('death_report', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/death_report', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Death({
      death_type: req.body.death_type,
      patient_name: req.body.patient_name,
      doctor_name: req.body.doctor_name,
      date:req.body.date,
      status:req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      death_report: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        send_death_report(UserSave.birth_type, UserSave.patient_name, UserSave.doctor_name, UserSave.date, UserSave.status, UserSave.email,UserSave.mobile, UserSave._id);
        res.redirect('/reception/death_report_list')
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
receptionRout.get('/death_report_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/death_report_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Death.findById({ _id: req.query.id })
    res.render('death_report_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/death_report_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Death.findById({ _id: id })
    if (userData) {
      res.render('death_report_edit', { user: userData });
    }
    else {
      res.redirect('/reception/death_report_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/death_report_edit', async (req, res) => {
  try {
    const updateData = await Death.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        death_type: req.body.death_type,
        patient_name: req.body.patient_name,
        doctor_name: req.body.doctor_name,
        date:req.body.date,
        status:req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        death_report: 1,
      }
    });
    res.redirect('/reception/death_report_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/death_report_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Death.deleteOne({ _id: id });
    res.redirect('/reception/death_report_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/death_report_export', receptionauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Death_Type', key: 'death_type' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'doctor_name', key: 'doctor_name' },
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
receptionRout.get('/bed_allotment', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('bed_allotment', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/bed_allotment', async (req, res) => {
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
        res.redirect('/reception/bed_allotment_list')
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
receptionRout.get('/bed_allotment_list', receptionauth.isLogin, async (req, res) => {
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

receptionRout.get('/bed_allotment_view', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Bed.findById({ _id: req.query.id })
    res.render('bed_allotment_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
receptionRout.get('/bed_allotment_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Bed.findById({ _id: id })
    if (userData) {
      res.render('bed_allotment_edit', { user: userData });
    }
    else {
      res.redirect('/reception/bed_allotment_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/bed_allotment_edit', async (req, res) => {
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
    res.redirect('/reception/bed_allotment_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/bed_allotment_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Bed.deleteOne({ _id: id });
    res.redirect('/reception/bed_allotment_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/bed_allotment_export', receptionauth.isLogin, async (req, res) => {
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




// Bed_allotment module 
// =========================================================================
receptionRout.get('/blood_bank', receptionauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.session.user_id })
    res.render('blood_bank', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/blood_bank', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Blood({
      blood_group: req.body.blood_group,
      no_bag: req.body.no_bag,
      entry_date:req.body.entry_date,
      bank: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
        res.redirect('/reception/blood_bank_list')
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
receptionRout.get('/blood_bank_list', receptionauth.isLogin, async (req, res) => {
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


// edit user by amdin 
receptionRout.get('/blood_bank_edit', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Blood.findById({ _id: id })
    if (userData) {
      res.render('blood_bank_edit', { user: userData });
    }
    else {
      res.redirect('/reception/Blood_bank_list')
    }
  } catch (err) {
    console.log(err)
  }
})

receptionRout.post('/blood_bank_edit', async (req, res) => {
  try {
    const updateData = await Blood.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        blood_group: req.body.blood_group,
        no_bag: req.body.no_bag,
        entry_date:req.body.entry_date,
      }
    });
    res.redirect('/reception/blood_bank_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
receptionRout.get('/blood_bank_delete', receptionauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Blood.deleteOne({ _id: id });
    res.redirect('/reception/blood_bank_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
receptionRout.get('/blood_bank_export', receptionauth.isLogin, async (req, res) => {
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








module.exports = receptionRout;







