const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true }, // Not required initially
    name: { type: String }, // Not required initially
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required initially
    otp: { type: String },
    otpExpiry: { type: Date },
    role: {
        type: String,
        enum: ['Admin', 'User'],
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;