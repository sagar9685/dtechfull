const express = require('express');
const crypto = require('crypto'); // For generating OTP
const nodemailer = require('nodemailer'); // To send emails
const bcrypt = require('bcrypt'); // To hash passwords
const User = require('../models/userModel'); // Your User model

const router = express.Router();

// Email configuration (update with your SMTP details)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: 'sagargupta7067@gmail.com', // Your email
        pass: 'elbqqjehbzxjvaab', // Your email password
    },
});

// Generate and send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate OTP and expiry
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Save OTP and expiry to user document
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        await transporter.sendMail({
            from: 'no-rply@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is: ${otp}`,
        });

        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP', error });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify OTP and expiry
        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (Date.now() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear OTP fields
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password', error });
    }
});

router.post('/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare current password with hashed password in DB
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
});

module.exports=router;