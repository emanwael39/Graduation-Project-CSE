const jwt = require("jsonwebtoken");
const User = require("../Models/user");
require('dotenv').config();

const authadmine = async (req, res, next) => {
    const token = req?.cookies["acsses-token"];
    // console.log(token + "this is exist token");

    if (!token) {
        return res.status(401).send("Token is required");
    }
    

    let secretKey = process.env.ACCESS_TOKEN_SECRET;
    let decode = jwt.verify(token, secretKey);

    const user = await User.findOne({ _id: decode._id, tokens: token })
    // console.log(user.password)
    if (user.email == 'admine@gmail.com' && user.password == '$2a$10$iRIrEk.YPze4EODdWTjAwued0dgZhgqmfBs0JJ9ZfL5ypN0LPgALu') {

        req.user = user
        req.token = token
        next()
    } else {
        res.status(400).json('For Admine only');
    }


    //    catch(e){
    //   res.status(401).send({error:'Please authenticate'})
    // }

};

module.exports = authadmine;






// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// // ... other required imports

// // Step 2: Set up transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or your email service
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-password'
//   }
// });

// // Step 3: Password reset request route
// app.post('/forgot-password', (req, res) => {
//   // Generate token and save it with the user's data in your database
//   const token = crypto.randomBytes(20).toString('hex');
//   // ... save token logic

//   // Step 5: Send email
//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: req.body.email,
//     subject: 'Password Reset',
//     text: Please click on the following link, or paste this into your browser to complete the process: http://${req.headers.host}/reset-password/${token}
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Email sent: ' + info.response);
//     res.status(200).send('A password reset email has been sent.');
//   });
// });

// // Step 6: Password reset form submission route
// app.post('/reset-password/:token', (req, res) => {
//   // Verify token and allow user to reset password
//   // ... token verification and password reset logic
// });