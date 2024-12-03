const mongoose = require('mongoose');

const Profile = new mongoose.Schema({
    fullName: String,
    username: String,
    address: String,
    mobile: String,
    email: String,
    country: String,
    tenth: String,
    twelfth: String,
    graduation: String,
    postGraduation: String,
    phd: String,
    resumeUrl: String, // Store the URL from Cloudinary
});

const Resume = mongoose.model('UserResumeProfile', Profile);
module.exports = Resume; 