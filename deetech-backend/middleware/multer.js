const multer = require('multer');
const path = require('path');

// Define storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define the folder where the file will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
    }
});

// Define Multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB per file
}).single('companyLogo'); // Handles single file uploads for 'companyLogo'

// Export the upload middleware
module.exports = upload;
