const express = require('express');
const mongoose = require('mongoose');
const Job = require('../models/jobDescription'); // Import the Job model
const jobs = require("../controller/jobDescriptionController")
const multer = require('multer');


const router = express.Router();
router.use(express.json()); // Middleware to parse JSON requests
const upload = multer({ dest: 'uploads/' });

router.post('/create', upload.single('companyLogo'), (req, res, next) => {
    try {
        jobs.jobpost(req, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});
router.get('/alljobs',jobs.getAllJobs);
router.put('/edit/:id',jobs.updateJob);
router.delete('/delete/:id',jobs.deleteJob);
router.get('/singlejob/:id', jobs.getOneJob);
router.post('/apply/:id', jobs.applyForJob);


module.exports=router;