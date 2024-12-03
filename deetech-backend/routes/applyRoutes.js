const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/applyModel');
const Users = require('../models/userModel');
const router = express.Router();


// Route to create a new user
router.post('/apply-user', async (req, res) => {
  const { username, email, title, description } = req.body;

  try {
      // Check if a matching record already exists
      const existingUser = await User.findOne({ username, email, title, description });
  
      if (existingUser) {
          // If the user already applied, return an error response
          return res.status(400).send('You have already applied for this job.');
      }
  
      // If no matching record exists, proceed with creation
      const user = new User({ username, email, title, description });
      await user.save();
      res.status(201).send('User created successfully');
  } catch (error) {
      res.status(500).send(error.message); // Changed to 500 for server-side errors
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // This retrieves all user documents from the database
    res.status(200).json(users); // Respond with the user data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Validate input
  if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      // Find user by email
      const user = await Users.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      // Compare old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Current password is incorrect." });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;