const express = require('express');
const router = express.Router();
const Contact = require('../models/contactus');
const User = require('../models/userModel');
const Users = require('../models/applyModel');
const Userss = require('../models/contactus');
const nodemailer = require('nodemailer');
const Job = require('../models/jobDescription');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "sagargupta7067@gmail.com",  // Admin email
        pass: "wlqseovgfuwzwtro"     // App password or actual password (use environment variable for security)
    }
});


async function ContactUs(req, res){
    const { name, phone, email, programType, subject, message } = req.body;

    // Validation for required fields
    if (!name || !phone || !email || !programType || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Save the contact form data to the database
        const contact = new Contact({
            name,
            phone,
            email,
            programType,
            subject,
            message
        });

        await contact.save();

        // Send an email to the admin
        const mailOptions = {
            from: "no-reply@deetech.com",  // Sender address
            to: "sagargupta7067@gmail.com",   // Admin email to receive contact form details
            subject: `New Contact Us Submission: ${subject}`,
            text: `You have a new contact request.\n\n
                   Name: ${name}\n
                   Phone: ${phone}\n
                   Email: ${email}\n
                   Program Type: ${programType}\n
                   Subject: ${subject}\n
                   Message: ${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'Your message has been received. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Error saving contact form or sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to submit your message. Please try again later.' });
    }
}

async function countUser(req, res){
    try {
        console.log('Attempting to count users'); // Debugging log
        const userCount = await User.countDocuments();
        console.log('User count:', userCount-1); // Log the count
        res.json({ count: (userCount-1) });
    } catch (error) {
        console.error('Error fetching user count:', error); // More specific error logging
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
}


async function countJobs(req, res) {
    try {
        console.log('Attempting to count jobs'); // Debugging log
        const jobCount = await Job.countDocuments(); // Counts the total number of jobs
        console.log('Job count:', jobCount); // Log the count
        res.json({ count: jobCount }); // Send the count as a response
    } catch (error) {
        console.error('Error fetching job count:', error); // More specific error logging
        res.status(500).json({ error: 'Failed to fetch job count' }); // Send error if fetching fails
    }
}

async function getalluser(req, res) {
    try {
        // Fetch all users with role 'User' from the database
        const users = await User.find({ role: 'User' });
        
        // Return the list of users as a response
        res.json({ users });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}

async function contactUsData(req, res) {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.find();

        // Return the list of contacts as a response
        res.json({ contacts });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch contact data' });
    }
}

async function deletecontactlist(req, res) {
    try {
        const contactId = req.params.id;
        await Contact.findByIdAndDelete(contactId);
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contact' });
    }
}

async function countapply(req, res){
    try {
        console.log('Attempting to count users'); // Debugging log
        const userCount = await Users.countDocuments();
        console.log('User count:', userCount); // Log the count
        res.json({ count: (userCount) });
    } catch (error) {
        console.error('Error fetching user count:', error); // More specific error logging
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
}

async function countcontact(req, res){
    try {
        console.log('Attempting to count users'); // Debugging log
        const userCount = await Userss.countDocuments();
        console.log('User count:', userCount); // Log the count
        res.json({ count: (userCount) });
    } catch (error) {
        console.error('Error fetching user count:', error); // More specific error logging
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
}

module.exports = {ContactUs,countUser,countJobs,getalluser,contactUsData,deletecontactlist,countapply,countcontact} ;