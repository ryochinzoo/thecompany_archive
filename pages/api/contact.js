import 'dotenv/config'

const emailPasswordBooking = process.env.mailPassword
const emailPasswordMailingList = process.env.mailPassword

export default function ContactApi(req, res) {
    let nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
        port: req.body.newMailInfo.port,
        host: req.body.newMailInfo.host,
        auth: {
            user: req.body.newMailInfo.email,
            pass: req.body.emailSignUp ? emailPasswordMailingList : emailPasswordBooking,
        },
        secure: true,
    })
    const mailData = req.body.emailSignUp ? {
        from: req.body.email,
        to: req.body.newMailInfo.email,
        subject: `Subscriptoin Request`,
        text: `Subscriptoin Request from ${req.body.emailSignUp}`,
        html: `<div>Subscriptoin Request from: ${req.body.emailSignUp}</div>`
    }
    :
    {
        from: req.body.email,
        to: req.body.newMailInfo.email,
        subject: `Booking Request From ${req.body.lastName} ${req.body.firstName}`,
        text: req.body.message,
        html: `<div>${req.body.message}</div><p>Sent from: ${req.body.email}</p><p>Phone Number: ${req.body.phoneNumber}</p>`
    }

    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info)
    })
    res.status(200).json({data: req.body})
}