const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,      
  },
  email: {
    type: String,
    lowercase: true, 
    trim: true,      
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true, 
});

const User = mongoose.model('applydata', userSchema);

module.exports = User;
