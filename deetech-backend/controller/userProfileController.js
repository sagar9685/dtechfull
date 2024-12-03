const cloudinary = require('cloudinary').v2;
const Resume = require('../models/userResumeProfile');  // Adjust path as needed

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dst6pndiq',  // Replace with your Cloudinary cloud name
    api_key: '477749874817638',  // Replace with your Cloudinary API key
    api_secret: 'QEP6Ky9gXM2xI0Osy3e9i87pltY'  // Replace with your Cloudinary API secret
});

const createProfile = (req, res) => {
    console.log("Received request:", req.body); // Log incoming data
    console.log("File uploaded:", req.file);   // Log the file object to check if it exists

    if (!req.file) {
        console.log('No resume uploaded.');
        return res.status(400).json({ message: 'No resume uploaded.' });
    }

    // Process the file upload to Cloudinary
    cloudinary.uploader.upload_stream(
        { 
            folder: 'resumes', 
            resource_type: 'auto' // Let Cloudinary automatically detect the file type
        },
        (err, result) => {
            if (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({ message: 'Error uploading resume to Cloudinary', error: err.message });
            }

            console.log('Cloudinary upload successful:', result);
            const resumeUrl = result.secure_url; // Get the Cloudinary URL

            // Create the profile object
            const profileDetails = {
                fullName: req.body.fullName,
                username: req.body.username,
                address: req.body.address,
                mobile: req.body.mobile,
                email: req.body.email,
                country: req.body.country,
                tenth: req.body.tenth,
                twelfth: req.body.twelfth,
                graduation: req.body.graduation,
                postGraduation: req.body.postGraduation,
                phd: req.body.phd,
                resumeUrl: resumeUrl, // Save the Cloudinary URL in the profile
            };

            // Create new profile in the database
            const newProfile = new Resume(profileDetails);

            newProfile.save()
                .then(() => {
                    console.log('Profile saved successfully.');
                    res.status(201).json({ success: true,message: 'Profile created successfully', profile: newProfile });
                })
                .catch((saveErr) => {
                    console.error("Error saving profile to database:", saveErr);
                    res.status(500).json({ message: 'Error saving profile to database', error: saveErr.message });
                });
        }
    ).end(req.file.buffer); // Upload the file buffer to Cloudinary
};


const getAllProfiles = async (req, res) => {
    try {
        // Fetch all profiles from the database
        const profiles = await Resume.find(); // Find all profiles in the 'userResumeProfile' collection

        if (!profiles.length) {
            return res.status(404).json({ message: 'No profiles found.' });
        }

        // Send back the profiles as the response
        res.status(200).json({ message: 'Profiles retrieved successfully', profiles });
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const { fullName, address, mobile, country, tenth, twelfth, graduation, postGraduation, phd } = req.body;
        const profileId = req.params.id; // Profile ID passed as a route parameter

        // Find the profile by ID
        const profile = await Resume.findById(profileId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // If a new resume is uploaded, upload it to Cloudinary
        let newResumeUrl = profile.resumeUrl;  // Keep existing resume URL by default
        if (req.file) {
            // Upload the new resume to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'resumes',  // Set the folder in Cloudinary where the resumes will be stored
                resource_type: 'auto', // This automatically handles different file types (PDF, DOCX, etc.)
            });

            // Get the new resume URL from Cloudinary
            newResumeUrl = uploadResult.secure_url;  // This is the Cloudinary URL of the uploaded resume
        }

        // Update the profile (excluding username and email)
        profile.fullName = fullName || profile.fullName;
        profile.address = address || profile.address;
        profile.mobile = mobile || profile.mobile;
        profile.country = country || profile.country;
        profile.tenth = tenth || profile.tenth;
        profile.twelfth = twelfth || profile.twelfth;
        profile.graduation = graduation || profile.graduation;
        profile.postGraduation = postGraduation || profile.postGraduation;
        profile.phd = phd || profile.phd;
        profile.resumeUrl = newResumeUrl;  // Update the resume URL in the database

        // Save the updated profile
        const updatedProfile = await profile.save();

        // Return success response
        res.status(200).json({
            message: 'Profile updated successfully',
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};


const getProfileByEmail = async (req, res) => {
    try {
        // Extract the email from the query parameter
        const { email } = req.query;

        // Validate if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Find the user profile in the database based on email
        const profile = await Resume.findOne({ email: email }); // Assuming `email` is the field in your database

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }

        // Send back the profile as the response
        res.status(200).json({ message: 'Profile retrieved successfully', profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};
module.exports = { createProfile , getAllProfiles ,editProfile,getProfileByEmail };
