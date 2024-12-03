const express = require('express');
const mongoose = require('mongoose');
const Job = require('../models/jobDescription'); // Import the Job model
const cloudinary = require('cloudinary').v2;
const upload = require('../middleware/multer'); // Multer middleware

const app = express();
app.use(express.json());

cloudinary.config({
    cloud_name: 'dst6pndiq',
    api_key: '477749874817638',
    api_secret: 'QEP6Ky9gXM2xI0Osy3e9i87pltY'
});

const jobpost = (req, res) => {
    console.log("Received request:", req.body); // Log incoming data

    if (!req.file) {
        console.log('No logo uploaded.');
        return res.status(400).json({ message: 'No logo uploaded.' });
    }

    console.log('File uploaded, starting Cloudinary upload...');
    cloudinary.uploader.upload(req.file.path, { folder: 'job-logos' }, (err, result) => {
        if (err) {
            console.error("Cloudinary upload error:", err);
            return res.status(500).json({ message: 'Error uploading logo to Cloudinary', error: err.message });
        }

        console.log('Cloudinary upload successful:', result);
        const logoUrl = result.secure_url; // Get the Cloudinary URL

        // Prepare the job details from request body and Cloudinary logo URL
        const jobDetails = {

            title: req.body.title,
            numberOfPosts: req.body.numberOfPosts,
            description: req.body.description,
            qualification: req.body.qualification,
            experience: req.body.experience,
            specialization: req.body.specialization,
            lastDate: req.body.lastDate,
            salary: req.body.salary,
            jobType: req.body.jobType,
            company: req.body.company,
            companyLogo: logoUrl, // Make sure this field matches the schema
            website: req.body.website,
            email: req.body.email,
            country: req.body.country,
            state: req.body.state
        };

        console.log('Job details prepared:', jobDetails);

        const newJob = new Job(jobDetails);

        // Save job to the database
        newJob.save()
            .then(() => {
                console.log('Job saved successfully.');
                res.status(201).json({ message: 'Job posted successfully', job: newJob });
            })
            .catch((saveErr) => {
                console.error("Error saving job to database:", saveErr);
                res.status(500).json({ message: 'Error saving job to database', error: saveErr.message });
            });
    });
};



// Get all jobs function
const getAllJobs = async (req, res) => {
    try {
        // Fetch all jobs from the database
        const jobs = await Job.find(); 
        res.status(200).json(jobs); // Respond with the array of job data
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
    }
};
// In controllers/jobController.js


const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user?.id; // Extract userId from the authenticated request (e.g., from middleware)

        if (!jobId || !userId) {
            return res.status(400).json({ message: 'Invalid job or user ID' });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(200).json({ alreadyApplied: true, message: 'You have already applied for this job.' });
        }

        // Create a new application if none exists
        const application = new Application({ jobId, userId });
        await application.save();

        res.status(201).json({ alreadyApplied: false, message: 'Job applied successfully.' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Failed to apply for job', error: error.message });
    }
};


// Route definition






const getOneJob = async (req, res) => {
    try {
        // Fetch job by ID from the database
        const id = req.params.id;
        const job = await Job.findById(id);
        
        if (job) {
            res.status(200).json(job); // Respond with the job data
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch job', error: error.message });
    }
};

// Corrected route


// Update a job by ID function
const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id; // Get job ID from URL parameters
        const updates = req.body; // Fields to update from the request body

        // Validate jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ error: 'Invalid job ID format.' });
        }

        // Validate lastDate if it's updated
        if (updates.lastDate && isNaN(Date.parse(updates.lastDate))) {
            return res.status(400).json({ error: 'Last date must be a valid date.' });
        }

        // Optionally, add additional validation for other fields (e.g., job title, description, etc.)
        // Example: 
        // if (!updates.jobTitle) {
        //     return res.status(400).json({ error: 'Job title is required.' });
        // }

        // Find the job by ID and update with new data
        const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(updatedJob); // Return the updated job data
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to update job', error: 'Internal Server Error' });
    }
};

// Delete Job API
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id; // Get job ID from URL parameters

        // Validate jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ error: 'Invalid job ID format.' });
        }

        // Find the job by ID and delete it
        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to delete job', error: 'Internal Server Error' });
    }
};

module.exports = { jobpost, deleteJob, updateJob, getAllJobs,getOneJob,applyForJob };
