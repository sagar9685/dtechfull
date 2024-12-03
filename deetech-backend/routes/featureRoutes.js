const express = require('express');
const router = express.Router();
const Contact = require('../models/contactus');
const ContactUs = require("../controller/FeaturesController")

router.post('/contact',ContactUs.ContactUs);
router.get('/countuser',ContactUs.countUser);
router.get('/countjobs', ContactUs.countJobs);
router.get('/getalluser', ContactUs.getalluser);
router.get('/contactUsData', ContactUs.contactUsData);
router.delete('/contactusdelete/:id', ContactUs.deletecontactlist);
router.get('/countapply',ContactUs.countapply);
router.get('/countcontact',ContactUs.countcontact);

module.exports=router;