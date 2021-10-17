const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Server is ready to receive messages');
    }
});

router.post('/send', (req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const message = req.body.message
    const content = `name: ${name} \n phone: ${phone} \n email: ${email} \n message: ${message}`

    const mail = {
        from: name,
        to: process.env.EMAIL,
        subject: 'New Contact Form',
        text: content
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })
        }
    })
})

const PORT = process.env.PORT || 3000;

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})