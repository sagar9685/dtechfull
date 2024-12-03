const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let generatedOtp;  // Store OTP temporarily in memory for demo purposes

// Nodemailer transporter setup (use your email credentials or environment variables)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your email service provider
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword',
    },
});

// Route to send OTP
app.post('/send-otp', (req, res) => {
    const { email } = req.body;

    // Generate a 6-digit OTP
    generatedOtp = Math.floor(100000 + Math.random() * 900000);

    // Set up email options
    const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${generatedOtp}`,
    };

    // Send email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending OTP', error });
        }
        res.status(200).json({ message: 'OTP sent successfully!' });
    });
});

// Route to verify OTP
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;

    // Check if the OTP matches
    if (parseInt(otp) === generatedOtp) {
        return res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
