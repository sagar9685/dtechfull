const express = require("express");
const {registerUser,sendOtpEmail,login} = require("../controller/authController")

const router = express.Router();

//routes
router.post("/register", registerUser);
router.post('/send-otp', sendOtpEmail);
router.post("/login", login);


module.exports = router;