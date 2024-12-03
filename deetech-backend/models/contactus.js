// models/contactModel.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/, // Example regex for a 10-digit phone number, adjust as necessary
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    programType: {
        type: String,
        enum: ['job', 'training'], // Allowed options for the dropdown
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
