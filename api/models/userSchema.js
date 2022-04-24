const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Please Enter a valid email'],
  },

  phoneNumber: {
    type: Number,
    required: true,
    min: 11,
    max: 14,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

module.exports = mongoose.model('User', userSchema);
