const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "sagargupta7067@gmail.com",
        pass: "elbqqjehbzxjvaab"
    }
});

// Function to generate a random OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Step 1: Check if a fully registered user already exists with this email
        const existingUser = await User.findOne({ email, username: { $exists: true, $ne: null } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Step 2: Generate OTP and calculate expiry time
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Step 3: Send OTP email
        await transporter.sendMail({
            from: "sagargupta7067@gmail.com",
            to: email,
            subject: 'Account Verification - OTP',
            text: `Your OTP for registration is ${otp}. It is valid for 10 minutes.`
        });

        console.log("Generated OTP:", otp); // Debugging - Remove this in production

        // Step 4: Upsert user document with OTP details
        await User.updateOne(
            { email }, // Match by email only
            {
                email: email,
                otp: hashedOtp,
                otpExpiry: otpExpiry
            },
            { upsert: true } // Create a new document if no match is found
        );

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
}




async function registerUser(req, res) {
    const { username, name, email, password, otp } = req.body;

    if (!username || !name || !email || !password || !otp) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Step 1: Find unregistered user with the email
        const user = await User.findOne({ email, username: null });

        if (!user) {
            return res.status(400).json({ success: false, message: "No registration in progress for this email" });
        }

        if (!user.otp) {
            return res.status(400).json({ success: false, message: "OTP not sent" });
        }

        // Step 2: Check if OTP is expired
        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        // Step 3: Compare entered OTP with stored hashed OTP
        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Step 4: Hash the password and complete registration
        const hashedPassword = await bcrypt.hash(password, 10);
        user.username = username;
        user.name = name;
        user.password = hashedPassword;
        user.role = 'User'; // Default role

        // Step 5: Clear OTP fields and save the user
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
}




async function login(req, res) {
    const { email, password, role } = req.body;

    console.log("Request body:", req.body); // Add this line for debugging

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.role !== role) {
            return res.status(400).json({ message: 'Role mismatch' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}




module.exports = { sendOtpEmail, registerUser, login };