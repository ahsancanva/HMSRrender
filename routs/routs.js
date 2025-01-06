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
const paymentSchema = require('../model/paymentSchema');
const Payment = require('../model/paymentSchema');
const blogSchema = require('../model/blogSchema');
const Blog = require('../model/blogSchema');
// autentication
const auth = require('../middleware/auth');
// router
// const router = express.Router();
const router = express();
//  middleware
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(session({
    secret: 'keyboard cat'
}))

// view engine for user
router.set('view engine', 'ejs');
router.set('views', './views/userfile')


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
// sendmail
const sendResetPasswordMail = async (name, email, token) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
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
            html: `Hii ${name}, Please Click Here to <a href="http://localhost:3000/reset-password?token=${token}">Reset</a> Your password.
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
// sendVerifymail
const contactMail = async (name, email, subject, message, user_id) => {
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
            subject: `Contact Mail >>> ${subject}  ✔`, // Subject line
            text: `WELL COME ${name}`,
            html: `Hii ${name},
           Email ${email}
           Subject ${subject}
           message ${message}`
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

// Userdashboard link
router.get('/Userdashboard', auth.isLogin, async (req, res) => {
    try {
        const userData = await Register.findById({ _id: req.session.user_id })
        res.render('Userdashboard', { user: userData })
    } catch (err) {
        console.log(err)
    }
})

// userprofile link

router.get('/', auth.isLogout, async (req, res) => {
    try {
      const userData = await Blog.find({})
        res.render('home',{ user: userData })
    } catch (err) {
        console.log(err)
    }
})

router.get('/home', auth.isLogout, async (req, res) => {
    try {
      const userData = await Blog.find({})
        res.render('home',{ user: userData })
    } catch (err) {
        console.log(err)
    }
})

router.get('/detail_post', auth.isLogout, async (req, res) => {
    try {
      const userData = await Blog.findById({_id:req.query.id})
        res.render('detail_post',{ user: userData })
    } catch (err) {
        console.log(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const User = new Newsletter({
            email: req.body.email,
            newsletter: 1,
        });

        const UserSave = await User.save();

        if (UserSave) {
            res.render('thanksNewsletter', { message: 'Thanks For Newsletter' })
        }
        else {
            res.render('thanksNewsletter', { message: 'Thanks For Newsletter' })
        }
    } catch (err) {
        console.log(err)
    }
})


router.post('/home', async (req, res) => {
    try {
        const User = new Newsletter({
            email: req.body.email,
            newsletter: 1,
        });

        const UserSave = await User.save();

        if (UserSave) {
            res.render('thanksNewsletter', { message: 'Thanks For Newsletter' })
        }
        else {
            res.render('thanksNewsletter', { message: 'Thanks For Newsletter' })
        }
    } catch (err) {
        console.log(err)
    }
})
router.get('/thanksNewsletter', auth.isLogout, async (req, res) => {
    try {
        res.render('thanksNewsletter')
    } catch (err) {
        console.log(err)
    }
})

router.get('/about', auth.isLogout, (req, res) => {
    res.render('about')

})
router.get('/gallery', auth.isLogout, (req, res) => {
    res.render('gallery')

})
router.get('/contact', auth.isLogout, (req, res) => {
    res.render('contact')

})

router.post('/contact', async (req, res) => {
    try {
        const User = new Contact({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
            contact: 1,
        });

        const UserSave = await User.save();
        if (UserSave) {
            contactMail(req.body.name, req.body.email, req.body.subject, req.body.message, UserSave._id);
            res.render('contact_thanks', { message: 'your Contact has been successfull. Please wait to back responce' })
        }
        else {
            res.render('contact', { message: 'you could not contact.... Please enter correct information' })
        }
    } catch (err) {
        console.log(err)
    }
})

router.get('/contact_thanks', auth.isLogout, (req, res) => {
    res.render('contact_thanks')

})
router.get('/account', auth.isLogout, (req, res) => {
    res.render('account')

})


router.get('/blog', auth.isLogout, async (req, res) => {
    try {
      const userData = await Blog.find({})
        res.render('blog',{ user: userData })
    } catch (err) {
        console.log(err)
    }
})
router.get('/job', auth.isLogout, (req, res) => {
    res.render('job')

})
router.get('/news', auth.isLogout, (req, res) => {
    res.render('news')

})
router.get('/notifications', auth.isLogout, (req, res) => {
    res.render('notifications')

})
router.get('/dash_notifi', auth.isLogin, (req, res) => {
    res.render('dash_notifi')

})


router.get('/finddoctor', auth.isLogin, async (req, res) => {
    try {
        const userData = await Department.find({ doctor: 1 })
        res.render('finddoctor', { user: userData })

    } catch (err) {
        console.log(err)
    }

})
router.get('/bookAppointment', auth.isLogin, async (req, res) => {
    try {
        const userData = await Department.findById({ _id:req.query.id })
        res.render('bookAppointment', { user: userData })

    } catch (err) {
        console.log(err)
    }

})
// ===============================================================
router.get('/payment', auth.isLogin, async (req, res) => {
    try {
        const userData = await Department.findById({ _id:req.query.id })
        res.render('payment', { user: userData })
    } catch (err) {
        console.log(err)
    }

})
router.post('/payment', async (req, res) => {
    try {
      const User = new Payment({
        fullname: req.body.fullname,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        cardname: req.body.cardname,
        cardnumber: req.body.cardnumber,
        expmonth: req.body.expmonth,
        expyear: req.body.expyear,
        cvv: req.body.cvv,
        payment: 1,
      });
  
      const UserSave = await User.save();
      if (UserSave) {
        res.redirect('/thanks')
      }
      else {
        res.render('payment', { message: 'Something Went Wrong' })
      }
    } catch (err) {
      console.log(err)
    }
  })
  
  



// ==========================================================
router.get('/thanks', auth.isLogin, (req, res) => {
    res.render('thanks')

})

router.get('/profile', auth.isLogin, async (req, res) => {
    try {
        const userData = await Register.findById({ _id: req.session.user_id })
        res.render('profile', { user: userData })
    } catch (err) {
        console.log(err)
    }
})

router.get('/SignIn', auth.isLogout, (req, res) => {
    res.render('SignIn')

})

router.get('/register', auth.isLogout, (req, res) => {
    res.render('register')

})

router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const spassword = await securepassword(req.body.password);
        const User = new Register({
            name: req.body.name,
            mobile: req.body.mobile,
            image: req.file.filename,
            email: req.body.email,
            password: spassword,
            is_admin: 0
        });

        const UserSave = await User.save();
        if (UserSave) {
            sendVerifyMail(req.body.name, req.body.email, UserSave._id);
            res.render('login', { message: 'your registraion has been successfull. Please verify your mail' })
        }
        else {
            res.render('register', { message: 'your registraion has been failed' })
        }
    } catch (err) {
        console.log(err)
    }
})

router.get('/verify', async (req, res) => {
    try {
        const update = await Register.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
        console.log(update);
        res.render('verify')
    } catch (err) {
        console.log(err)
    }
})


router.get('/login', auth.isLogout, async (req, res) => {
    try {
        res.render('login')
    } catch (err) {
        console.log(err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await Register.findOne({ email: email });
        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password);
            if (isMatch) {
                if (userData.is_verified == 0) {
                    res.render('login', { message: 'Plese verify your email' })

                }
                else {
                    req.session.user_id = userData._id;
                    res.redirect('/finddoctor')
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

router.get('/logout', auth.isLogin, async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
})



// ====================================================================
// forget password
router.get('/forget', auth.isLogout, async (req, res) => {
    try {
        res.render('forget')
    } catch (err) {
        console.log(err)
    }
})


router.post('/forget', auth.isLogout, async (req, res) => {
    try {
        const email = req.body.email;
        const forgetData = await Register.findOne({ email });
        if (forgetData) {
            if (forgetData.is_verified == 0) {
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
router.get('/reset-password', auth.isLogout, async (req, res) => {
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

router.post('/reset-password', async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securepassword(password);
        const updatedData = await Register.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
})

//Mail Verification
router.get('/verification', auth.isLogout, async (req, res) => {
    try {
        res.render('verification')
    } catch (err) {
        console.log(err)
    }
})


router.post('/verification', async (req, res) => {
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

//user edit
router.get('/edit', auth.isLogin, async (req, res) => {
    try {
        // const id = req.query.id;
        const editData = await Register.findById({ _id: req.query.id });
        if (editData) {
            res.render('edit', { user: editData })
        }
        else {
            res.redirect('/home')
        }
    } catch (err) {
        console.log(err)
    }
})

// update
router.post('/edit', upload.single('image'), async (req, res) => {
    try {
        const updateData = await Register.findByIdAndUpdate({ _id: req.body.user_id }, {
            $set: {
                name: req.body.name,
                mobile: req.body.mobile,
                image: req.file.filename,
                email: req.body.email,
            }
        });
        res.redirect('/profile')
    } catch (err) {
        console.log(err)
    }
})


// router.get('*',auth.isLogout, async (req, res) => {
//     try {
//         res.redirect('/')
//     } catch (err) {
//         console.log(err)
//     }
//   })


module.exports = router;