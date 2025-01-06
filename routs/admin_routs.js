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
const departmentSchema = require('../model/department')
const appointmentSchema = require('../model/appointmentSchema')
const Appointment = require('../model/appointmentSchema')
const prescriptionSchema = require('../model/prescriptionSchema')
const Prescription = require('../model/prescriptionSchema')
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
const contactSchema = require('../model/contactSchema');
const Contact = require('../model/contactSchema');
const newsletterSchema = require('../model/newsletterSchema');
const Newsletter = require('../model/newsletterSchema');
const blogSchema = require('../model/blogSchema');
const Blog = require('../model/blogSchema');
const emergencySchema = require('../model/emergencySchema');
const Emergency = require('../model/emergencySchema');
const opdSchema = require('../model/opdSchema');
const Opd = require('../model/opdSchema');
const newinvoiceSchema = require('../model/newinvoiceSchema')
const Newinvoice = require('../model/newinvoiceSchema')
// authentication
const adminauth = require('../middleware/adminauth');

// router
// const adminRout = express.Router();
const adminRout = express();

//  middleware
adminRout.use(bodyParser.urlencoded({ extended: false }))
adminRout.use(bodyParser.json())
adminRout.use(session({
  secret: 'keyboard cat'
}))

// // view engine for admin
adminRout.set('view engine', 'ejs');
adminRout.set('views', './views/admin')


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
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/admin/reset-password?token=${token}">Reset</a> Your password.
         <br><br> Please <a href="http://localhost:3000/admin/login">login</a> here....`, // html body
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
      subject: "Admin Add You and Verification Mail ✔", // Subject line
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
//send appointment mail
// send_operation_report
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
      subject: "Appointment Mail ✔", // Subject line
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
const send_emergency = async (date, name, email, id_card, bed_no, user_id) => {
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
      subject: "Emergency Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name},.
      <br> Appointment Date : ${date},
      <br>  Name : ${name},
      <br>  Id_card : ${id_card},
      <br>  bed_no : ${bed_no},
         <br> Your Email : ${email}
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
adminRout.get('/', adminauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/login', adminauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await Register.findOne({ email: email });
    if (userData) {
      const isMatch = await bcrypt.compare(password, userData.password);
      if (isMatch) {
        if (userData.is_admin == 0) {
          res.render('login', { message: 'Plese verify your email' })

        }
        else {
          req.session.user_id = userData._id;
          res.redirect('/admin/admindashboard')
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

adminRout.get('/logout', adminauth.isLogin, async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
  }
})



// ====================================================================
// forget password
adminRout.get('/forget', adminauth.isLogout, async (req, res) => {
  try {
    res.render('forget')
  } catch (err) {
    console.log(err)
  }
})


adminRout.post('/forget', adminauth.isLogout, async (req, res) => {
  try {
    const email = req.body.email;
    const forgetData = await Register.findOne({ email });
    if (forgetData) {
      if (forgetData.is_admin == 0) {
        res.render('forget', { message: 'Please Verify Your mail' })
      }
      else {
        const randomString = randomstring.generate();
        const updateData = await Register.updateOne({ email }, { $set: { token: randomString } });
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
adminRout.get('/reset-password', adminauth.isLogout, async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await Register.findOne({ token });
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

adminRout.post('/reset-password', async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;

    const secure_password = await securepassword(password);
    const updatedData = await Register.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
  }
})

//Mail Verification
adminRout.get('/verification', adminauth.isLogout, async (req, res) => {
  try {
    res.render('verification')
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/verification', async (req, res) => {
  try {
    const email = req.body.email;
    const MailVeri = await Register.findOne({ email });
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



// admin dashboard 
adminRout.get('/admindashboard', adminauth.isLogin, async (req, res) => {
  try {

    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('admindashboard', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// // dashboard userlist ===> show user list
// adminRout.get('/user_list',adminauth.isLogin,async (req, res) => {
//   try {
//     const userData = await Register.find({is_admin:0});
//     res.render('user_list',{user:userData})
//   } catch (err) {
//     console.log(err)
//   }
// })

// adminprofile link
adminRout.get('/profile', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('profile', { user: userData })
  } catch (err) {
    console.log(err)
  }
})



//admin edit profile
adminRout.get('/edit', adminauth.isLogin, async (req, res) => {
  try {
    // const id = req.query.id;
    const editData = await Register.findById({ _id: req.query.id });
    if (editData) {
      res.render('edit', { user: editData })
    }
    else {
      res.redirect('/admin/profile')
    }
  } catch (err) {
    console.log(err)
  }
})


// admin update the profile
adminRout.post('/edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Register.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
      }
    });
    res.redirect('/admin/profile')
  } catch (err) {
    console.log(err)
  }
})


// dashboard userlist ===> show user list and search
adminRout.get('/user_list', adminauth.isLogin, async (req, res) => {
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


    const userData = await Register.find({
      is_admin: 0,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Register.find({
      is_admin: 0,
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


// Add New User through Admin
adminRout.get('/user_add', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('user_add', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


adminRout.post('/user_add', upload.single('image'), async (req, res) => {
  try {
    const password = randomstring.generate(8);
    const spassword = await securepassword(password);
    const addUser = new Register({
      name: req.body.name,
      mobile: req.body.mobile,
      image: req.file.filename,
      email: req.body.email,
      password: spassword,
      is_admin: 0
    });

    const UserSave = await addUser.save();
    if (UserSave) {
      AddNewUser(UserSave.name, UserSave.email, UserSave.password, UserSave._id);
      res.redirect('/admin/user_list')
    }
    else {
      res.render('user_add', { message: 'Something WentWrong' })
    }
  } catch (err) {
    console.log(err)
  }
})


adminRout.get('/user_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.query.id })
    res.render('user_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
adminRout.get('/user_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Register.findById({ _id: id })
    if (userData) {
      res.render('user_edit', { user: userData });
    }
    else {
      res.redirect('/admin/user_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/user_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Register.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        is_verified: req.body.verify,
        image: req.file.filename,
        email: req.body.email

      }
    });
    res.redirect('/admin/user_list')
  } catch (err) {
    console.log(err)
  }
})


// delete user by amdin 
adminRout.get('/user_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Register.deleteOne({ _id: id });
    res.redirect('/admin/user_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/user_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Register.find({ is_admin: 0 });
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

// adminRout.get('*', adminauth.isLogout, async (req, res) => {
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
// all departement 

adminRout.get('/department', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('department', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/department', upload.single('image'), async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Department({
      name: req.body.name,
      mobile: req.body.mobile,
      image: req.file.filename,
      gender: req.body.gender,
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
        res.redirect('/admin/reception_list')
      }
      else if (UserSave.doctor) {
        res.redirect('/admin/doctor_list')
      }
      else if (UserSave.nurse) {
        res.redirect('/admin/nurse_list')
      }
      else if (UserSave.patient) {
        res.redirect('/admin/patient_list')
      }
      else if (UserSave.appointment) {
        res.redirect('/admin/appointment_list')
      }
      else if (UserSave.accountant) {
        res.redirect('/admin/accountant_list')
      }
      else if (UserSave.pharmacist) {
        res.redirect('/admin/pharmacist_list')
      }
      else if (UserSave.lab) {
        res.redirect('/admin/lab_list')
      }
      else if (UserSave.bedallotment) {
        res.redirect('/admin/bedallotment_list')
      }
      else {
        res.redirect('/admin/bloodbank_list')
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
adminRout.get('/reception_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/reception_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('reception_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
adminRout.get('/reception_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('reception_edit', { user: userData });
    }
    else {
      res.redirect('/admin/reception_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/reception_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/reception_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/reception_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/reception_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/reception_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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
adminRout.get('/doctor_list', adminauth.isLogin, async (req, res) => {
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
adminRout.get('/doctor_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('doctor_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/doctor_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('doctor_edit', { user: userData });
    }
    else {
      res.redirect('/admin/doctor_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/doctor_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/doctor_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/doctor_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/doctor_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/doctor_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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
adminRout.get('/nurse_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/nurse_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('nurse_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/nurse_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('nurse_edit', { user: userData });
    }
    else {
      res.redirect('/admin/nurse_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/nurse_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/nurse_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/nurse_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/nurse_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/nurse_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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
adminRout.get('/patient_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/patient_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('patient_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/patient_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('patient_edit', { user: userData });
    }
    else {
      res.redirect('/admin/patient_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/patient_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/patient_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/patient_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/patient_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/patient_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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
adminRout.get('/accountant_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/accountant_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('accountant_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
adminRout.get('/accountant_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('accountant_edit', { user: userData });
    }
    else {
      res.redirect('/admin/accountant_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/accountant_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/accountant_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/accountant_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/accountant_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/accountant_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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
adminRout.get('/pharmacist_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/pharmacist_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('pharmacist_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/pharmacist_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('pharmacist_edit', { user: userData });
    }
    else {
      res.redirect('/admin/pharmacist_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/pharmacist_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/pharmacist_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/pharmacist_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/pharmacist_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/pharmacist_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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
adminRout.get('/lab_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/lab_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('lab_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/lab_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('lab_edit', { user: userData });
    }
    else {
      res.redirect('/admin/lab_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/lab_edit', upload.single('image'), async (req, res) => {
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
    res.redirect('/admin/lab_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/lab_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/lab_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/lab_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
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







// appointment Module 
// =============================================================

adminRout.get('/appointment', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('appointment', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/appointment', upload.single('image'), async (req, res) => {
  try {
    const User = new Appointment({
      patient_name: req.body.patient_name,
      doctor_name: req.body.doctor_name,
      image: req.file.filename,
      appointment_date: req.body.appointment_date,
      time: req.body.time,
      amount: req.body.amount,
      gender: req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      appointment: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_appointment(UserSave.patient_name, UserSave.doctor_name, UserSave.appointment_date, UserSave.email, UserSave.mobile, UserSave._id);
      res.redirect('/admin/appointment_list')
    }
    else {
      res.render('appointment', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/appointment_list', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/appointment_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Appointment.findById({ _id: req.query.id })
    res.render('appointment_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/appointment_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Appointment.findById({ _id: id })
    if (userData) {
      res.render('appointment_edit', { user: userData });
    }
    else {
      res.redirect('/admin/appointment_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/appointment_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Appointment.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        patient_name: req.body.patient_name,
        doctor_name: req.body.doctor_name,
        image: req.file.filename,
        appointment_date: req.body.appointment_date,
        time: req.body.time,
        amount: req.body.amount,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        appointment: 1,
      }
    });
    res.redirect('/admin/appointment_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/appointment_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Appointment.deleteOne({ _id: id });
    res.redirect('/admin/appointment_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/appointment_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'patient_name', key: 'patient_name' },
      { header: 'doctor_Name', key: 'doctor_name' },
      { header: 'appointmentdate', key: 'appointmentdate' },
      { header: 'time', key: 'time' },
      { header: 'amount', key: 'amount' },
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





// operation Module 
// =============================================================

adminRout.get('/operation', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('operation', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/operation', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Operation({
      operation_name: req.body.operation_name,
      patient_name: req.body.patient_name,
      sarjan_name: req.body.sarjan_name,
      status: req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      date: req.body.date,
      operation: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_operation_report(UserSave.operation_name, UserSave.patient_name, UserSave.sarjan_name, UserSave.date, UserSave.status, UserSave.email, UserSave.mobile, UserSave._id);
      res.redirect('/admin/operation_list')
    }
    else {
      res.render('operation', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/operation_list', adminauth.isLogin, async (req, res) => {
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
        { operation_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { sarjan_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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
        { operation_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { sarjan_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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

adminRout.get('/operation_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Operation.findById({ _id: req.query.id })
    res.render('operation_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/operation_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Operation.findById({ _id: id })
    if (userData) {
      res.render('operation_edit', { user: userData });
    }
    else {
      res.redirect('/admin/operation_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/operation_edit', async (req, res) => {
  try {
    const updateData = await Operation.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        operation_name: req.body.operation_name,
        patient_name: req.body.patient_name,
        sarjan_name: req.body.sarjan_name,
        status: req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        date: req.body.date,
        operation: 1,
      }
    });
    res.redirect('/admin/operation_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/operation_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Operation.deleteOne({ _id: id });
    res.redirect('/admin/operation_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/operation_export', adminauth.isLogin, async (req, res) => {
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

adminRout.get('/birth_report', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('birth_report', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/birth_report', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Birth({
      birth_type: req.body.birth_type,
      patient_name: req.body.patient_name,
      doctor_name: req.body.doctor_name,
      date: req.body.date,
      status: req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      birth_report: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_birth_report(UserSave.birth_type, UserSave.patient_name, UserSave.doctor_name, UserSave.date, UserSave.status, UserSave.email, UserSave.mobile, UserSave._id);
      res.redirect('/admin/birth_report_list')
    }
    else {
      res.render('birth_report', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/birth_report_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Birth.findById({ _id: req.query.id })
    res.render('birth_report_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// birth module 
// dashboard userlist ===> show user list and search
adminRout.get('/birth_report_list', adminauth.isLogin, async (req, res) => {
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
        { birth_type: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { doctor_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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
        { birth_type: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { doctor_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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


// edit user by amdin 
adminRout.get('/birth_report_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Birth.findById({ _id: id })
    if (userData) {
      res.render('birth_report_edit', { user: userData });
    }
    else {
      res.redirect('/admin/birth_report_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/birth_report_edit', async (req, res) => {
  try {
    const updateData = await Birth.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        birth_type: req.body.birth_type,
        patient_name: req.body.patient_name,
        doctor_name: req.body.doctor_name,
        date: req.body.date,
        status: req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        birth_report: 1,
      }
    });
    res.redirect('/admin/birth_report_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/birth_report_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Birth.deleteOne({ _id: id });
    res.redirect('/admin/birth_report_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/birth_report_export', adminauth.isLogin, async (req, res) => {
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
adminRout.get('/death_report', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('death_report', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/death_report', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Death({
      death_type: req.body.death_type,
      patient_name: req.body.patient_name,
      doctor_name: req.body.doctor_name,
      date: req.body.date,
      status: req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      death_report: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_death_report(UserSave.birth_type, UserSave.patient_name, UserSave.doctor_name, UserSave.date, UserSave.status, UserSave.email, UserSave.mobile, UserSave._id);
      res.redirect('/admin/death_report_list')
    }
    else {
      res.render('death_report', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})


adminRout.get('/death_report_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Death.findById({ _id: req.query.id })
    res.render('death_report_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/death_report_list', adminauth.isLogin, async (req, res) => {
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
        { death_type: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { doctor_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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
        { death_type: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { doctor_name: { $regex: '.*' + search + '.*', $options: 'i' } },
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


// edit user by amdin 
adminRout.get('/death_report_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Death.findById({ _id: id })
    if (userData) {
      res.render('death_report_edit', { user: userData });
    }
    else {
      res.redirect('/admin/death_report_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/death_report_edit', async (req, res) => {
  try {
    const updateData = await Death.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        death_type: req.body.death_type,
        patient_name: req.body.patient_name,
        doctor_name: req.body.doctor_name,
        date: req.body.date,
        status: req.body.status,
        email: req.body.email,
        mobile: req.body.mobile,
        death_report: 1,
      }
    });
    res.redirect('/admin/death_report_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/death_report_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Death.deleteOne({ _id: id });
    res.redirect('/admin/death_report_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/death_report_export', adminauth.isLogin, async (req, res) => {
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
adminRout.get('/bed_allotment', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('bed_allotment', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/bed_allotment', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Bed({
      bed_no: req.body.bed_no,
      patient_name: req.body.patient_name,
      bed_type: req.body.bed_type,
      allotment_date: req.body.allotment_date,
      status: req.body.status,
      discharge_date: req.body.discharge_date,
      email: req.body.email,
      mobile: req.body.mobile,
      bed_allotment: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_bed_allotment(UserSave.bed_type, UserSave.patient_name, UserSave.bed_type, UserSave.allotment_date, UserSave.status, UserSave.discharge_date, UserSave.email, UserSave.mobile, UserSave._id);
      res.redirect('/admin/bed_allotment_list')
    }
    else {
      res.render('bed_allotment', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/bed_allotment_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Bed.findById({ _id: req.query.id })
    res.render('bed_allotment_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/bed_allotment_list', adminauth.isLogin, async (req, res) => {
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
        { bed_no: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { bed_type: { $regex: '.*' + search + '.*', $options: 'i' } },
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
        { bed_no: { $regex: '.*' + search + '.*', $options: 'i' } },
        { patient_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { bed_type: { $regex: '.*' + search + '.*', $options: 'i' } },
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


// edit user by amdin 
adminRout.get('/bed_allotment_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Bed.findById({ _id: id })
    if (userData) {
      res.render('bed_allotment_edit', { user: userData });
    }
    else {
      res.redirect('/admin/bed_allotment_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/bed_allotment_edit', async (req, res) => {
  try {
    const updateData = await Bed.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        bed_no: req.body.bed_no,
        patient_name: req.body.patient_name,
        bed_type: req.body.bed_type,
        allotment_date: req.body.allotment_date,
        status: req.body.status,
        discharge_date: req.body.discharge_date,
        email: req.body.email,
        mobile: req.body.mobile,
        bed_allotment: 1,
      }
    });
    res.redirect('/admin/bed_allotment_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/bed_allotment_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Bed.deleteOne({ _id: id });
    res.redirect('/admin/bed_allotment_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/bed_allotment_export', adminauth.isLogin, async (req, res) => {
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
    const userData = await Bed.find({ bed_allotment: 1 });
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
adminRout.get('/blood_bank', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('blood_bank', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/blood_bank', async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Blood({
      blood_group: req.body.blood_group,
      no_bag: req.body.no_bag,
      entry_date: req.body.entry_date,
      bank: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/admin/blood_bank_list')
    }
    else {
      res.render('blood_bank', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/blood_bank_list', adminauth.isLogin, async (req, res) => {
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
adminRout.get('/blood_bank_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Blood.findById({ _id: id })
    if (userData) {
      res.render('blood_bank_edit', { user: userData });
    }
    else {
      res.redirect('/admin/Blood_bank_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/blood_bank_edit', async (req, res) => {
  try {
    const updateData = await Blood.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        blood_group: req.body.blood_group,
        no_bag: req.body.no_bag,
        entry_date: req.body.entry_date,
      }
    });
    res.redirect('/admin/blood_bank_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/blood_bank_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Blood.deleteOne({ _id: id });
    res.redirect('/admin/blood_bank_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/blood_bank_export', adminauth.isLogin, async (req, res) => {
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
    const userData = await Blood.find({ blood_bank: 1 });
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






// blog Module 
// =============================================================

adminRout.get('/blog', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('blog', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/blog', upload.single('image'), async (req, res) => {
  try {
    const User = new Blog({
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      blog: 1
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/admin/blog_list')
    }
    else {
      res.render('blog', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/blog_list', adminauth.isLogin, async (req, res) => {
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


    const userData = await Blog.find({
      blog: 1,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Blog.find({
      blog: 1,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('blog_list', {
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

adminRout.get('/blog_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Blog.findById({ _id: req.query.id })
    res.render('blog_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/blog_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Blog.findById({ _id: id })
    if (userData) {
      res.render('blog_edit', { user: userData });
    }
    else {
      res.redirect('/admin/blog_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/blog_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Blog.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        image: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        blog: 1
      }
    });
    res.redirect('/admin/blog_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/blog_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Blog.deleteOne({ _id: id });
    res.redirect('/admin/blog_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/blog_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'title', key: 'title' },
      { header: 'description', key: 'description' },
      { header: 'date', key: 'date' },
    ];


    let counter = 1;
    const userData = await Blog.find({ blog: 1 });
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




// emergency Module 
// =============================================================

adminRout.get('/emergency', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('emergency', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/emergency', upload.single('image'), async (req, res) => {
  try {
    const User = new Emergency({
      date: req.body.date,
      name: req.body.name,
      lastname: req.body.lastname,
      id_card: req.body.id_card,
      dob: req.body.dob,
      image: req.file.filename,
      gender: req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      relation: req.body.relation,
      address: req.body.address,
      heart_rate: req.body.heart_rate,
      blood_pressure: req.body.blood_pressure,
      respiratory_rate: req.body.respiratory_rate,
      temperature: req.body.temperature,
      oxigen: req.body.oxigen,
      height: req.body.height,
      weight: req.body.weight,
      disease: req.body. disease,
      death: req.body.death,
      bed_no: req.body.bed_no,
      alergies: req.body.alergies,
      emergency: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      send_emergency(UserSave.date, UserSave.name, UserSave.id_card, UserSave.bed_no, UserSave.email, UserSave._id);
      res.redirect('/admin/emergency_list')
    }
    else {
      res.render('emergency', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/emergency_list', adminauth.isLogin, async (req, res) => {
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


    const userData = await Emergency.find({
      emergency: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Emergency.find({
      emergency: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('emergency_list', {
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

adminRout.get('/emergency_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Emergency.findById({ _id: req.query.id })
    res.render('emergency_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/emergency_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Emergency.findById({ _id: id })
    if (userData) {
      res.render('emergency_edit', { user: userData });
    }
    else {
      res.redirect('/admin/emergency_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/emergency_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Emergency.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        date: req.body.date,
        name: req.body.name,
        lastname: req.body.lastname,
        id_card: req.body.id_card,
        dob: req.body.dob,
        image: req.file.filename,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        relation: req.body.relation,
        address: req.body.address,
        heart_rate: req.body.heart_rate,
        blood_pressure: req.body.blood_pressure,
        respiratory_rate: req.body.respiratory_rate,
        temperature: req.body.temperature,
        oxigen: req.body.oxigen,
        height: req.body.height,
        weight: req.body.weight,
        disease: req.body. disease,
        death: req.body.death,
        bed_no: req.body.bed_no,
        alergies: req.body.alergies,
        emergency: 1,
      }
    });
    res.redirect('/admin/emergency_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/emergency_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Emergency.deleteOne({ _id: id });
    res.redirect('/admin/emergency_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/emergency_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'date', key: 'date' },
      { header: 'name', key: 'name' },
      { header: 'lastname', key: 'lastname' },
      { header: 'id_card', key: 'id_card' },
      { header: 'dob', key: 'dob' },
      { header: 'image', key: 'image' },
      { header: 'gender', key: 'gender' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
      { header: 'relation', key: 'relation' },
      { header: 'address', key: 'address' },
      { header: 'heart_rate', key: 'heart_rate' },
      { header: 'blood_pressure', key: 'blood_pressure' },
      { header: 'respiratory_rate', key: 'respiratory_rate' },
      { header: 'temperature', key: 'temperature' },
      { header: 'oxigen', key: 'oxigen' },
      { header: 'height', key: 'height' },
      { header: 'weight', key: 'weight' },
      { header: 'disease', key: 'disease' },
      { header: 'death', key: 'death' },
      { header: 'bed_no', key: 'bed_no' },
      { header: 'alergies', key: 'alergies' },

    ];


    let counter = 1;
    const userData = await Emergency.find({ emergency: 1 });
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





// opdm Module 
// =============================================================

adminRout.get('/opd', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('opd', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/opd', async (req, res) => {
  try {
    const User = new Opd({
      name: req.body.name,
      dob: req.body.dob,
      address: req.body.address,
      fathername: req.body.fathername,
      id_card: req.body.id_card,
      email: req.body.email,
      mobile: req.body.mobile,
      gender: req.body.gender,
      clinic: req.body.clinic,
      visit: req.body.visit,
      education: req.body.education,
      date: req.body.date,
      opd: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/admin/opd_list')
    }
    else {
      res.render('opd', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/opd_list', adminauth.isLogin, async (req, res) => {
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


    const userData = await Opd.find({
      opd: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Opd.find({
      opd: 1,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('opd_list', {
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

adminRout.get('/opd_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Opd.findById({ _id: req.query.id })
    res.render('opd_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/opd_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Opd.findById({ _id: id })
    if (userData) {
      res.render('opd_edit', { user: userData });
    }
    else {
      res.redirect('/admin/opd_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/opd_edit',  async (req, res) => {
  try {
    const updateData = await Opd.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        dob: req.body.dob,
        address: req.body.address,
        fathername: req.body.fathername,
        id_card: req.body.id_card,
        email: req.body.email,
        mobile: req.body.mobile,
        gender: req.body.gender,
        clinic: req.body.clinic,
        visit: req.body.visit,
        education: req.body.education,
        date: req.body.date,
        opd: 1,

      }
    });
    res.redirect('/admin/opd_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/opd_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Opd.deleteOne({ _id: id });
    res.redirect('/admin/opd_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/opd_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'name', key: 'name' },
      { header: 'dob', key: 'dob' },
      { header: 'address', key: 'address' },
      { header: 'fathername', key: 'fathername' },
      { header: 'id_card', key: 'id_card' },
      { header: 'email', key: 'email' },
      { header: 'mobile', key: 'mobile' },
      { header: 'gender', key: 'gender' },
      { header: 'clinic', key: 'clinic' },
      { header: 'visit', key: 'visit' },
      { header: 'education', key: 'education' },
      { header: 'date', key: 'date' },

    ];


    let counter = 1;
    const userData = await Opt.find({ opt: 1 });
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






// invoice Module 
// =============================================================
// =============================================================
// =============================================================
// =============================================================

adminRout.get('/newinvoice', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('newinvoice', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/newinvoice', async (req, res) => {
  try {
    const User = new Newinvoice({
      date: req.body.date,
      name: req.body.name,
      fathername: req.body.fathername,
      id_card: req.body.id_card,
      product_name: req.body.product_name,
      unit: req.body.unit,
      price: req.body.price,
      amount: req.body.amount,
      total: req.body.total,
      newinvoice: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/admin/newinvoice_list')
    }
    else {
      res.render('newinvoice', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/newinvoice_list', adminauth.isLogin, async (req, res) => {
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


    const userData = await Newinvoice.find({
      newinvoice: 1,
      $or: [
        { product_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Newinvoice.find({
      newinvoice: 1,
      $or: [
        { product_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('newinvoice_list', {
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

adminRout.get('/newinvoice_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Newinvoice.findById({ _id: req.query.id })
    res.render('newinvoice_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/newinvoice_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Newinvoice.findById({ _id: id })
    if (userData) {
      res.render('newinvoice_edit', { user: userData });
    }
    else {
      res.redirect('/admin/newinvoice_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/newinvoice_edit', async (req, res) => {
  try {
    const updateData = await Newinvoice.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        date: req.body.date,
        name: req.body.name,
        fathername: req.body.fathername,
        id_card: req.body.id_card,
        product_name: req.body.product_name,
        unit: req.body.unit,
        price: req.body.price,
        amount: req.body.amount,
        total: req.body.total,
        newinvoice: 1,
      }
    });
    res.redirect('/admin/newinvoice_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/newinvoice_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Newinvoice.deleteOne({ _id: id });
    res.redirect('/admin/newinvoice_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/newinvoice_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'date', key: 'date' },
      { header: 'name', key: 'name' },
      { header: 'fathername', key: 'fathername' },
      { header: 'id_card', key: 'id_card' },
      { header: 'product_name', key: 'product_name' },
      { header: 'unit', key: 'unit' },
      { header: 'price', key: 'price' },
      { header: 'amount', key: 'amount' },
    ];


    let counter = 1;
    const userData = await Newinvoice.find({ newinvoice: 1 });
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




module.exports = adminRout;







