import 'dotenv/config'

const emailPasswordBooking = process.env.NEXT_PUBLIC_MAIL_PASSWORD
const emailPasswordMailingList = process.env.NEXT_PUBLIC_MAILINGLIST

export default function ContactApi(req, res) {
    let nodemailer = require('nodemailer')
    let usage = ""
    if (req.body.newMailInfo.usage === "BookingRequest") {
        usage = "Booking Request"
    } else {
        usage = "Message"
    }
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
        subject: `${usage} From ${req.body.lastName} ${req.body.firstName}`,
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