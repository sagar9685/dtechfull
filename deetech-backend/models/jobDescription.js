const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    numberOfPosts: { type: Number, required: true },
    description: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    specialization: { type: String, required: true },
    lastDate: { type: Date, required: true },
    salary: { type: String, required: true },
    jobType: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String, required: true },  // This is where the logo URL will be stored
    website: { type: String },
    email: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
