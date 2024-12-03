const express = require('express');
const multer = require('multer');
const jobs = require('../controller/userProfileController');  // Import the controller
const router = express.Router();

// Multer setup to handle file uploads
const storage = multer.memoryStorage();  // Store file in memory (ideal for Cloudinary uploads)
const upload = multer({ storage: storage }); // Using multer memory storage

// Route to handle resume upload and profile creation
router.post('/profile', upload.single('resume'), jobs.createProfile);

// Route for retrieving all profiles
router.get('/profiles', jobs.getAllProfiles);  // You can implement this in your controller
router.get('/profilesbyemail', jobs.getProfileByEmail);  // You can implement this in your controller

// Route for retrieving a specific profile by ID
router.put('/profile/:id', jobs.editProfile);  // Implement this function as needed

module.exports = router;
