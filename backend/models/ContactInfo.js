const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  brandName: {
    type: String,
    default: 'Candy Crafts'
  },
  tagline: {
    type: String,
    default: 'Artisan Studio & Workshop'
  },
  address: {
    type: String,
    default: 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter, New Delhi - 110001'
  },
  email: {
    type: String,
    default: 'candycraftssstudio@gmail.com'
  },
  ownerEmail: {
    type: String,
    default: 'candycraftssstudio@gmail.com'
  },
  emailPass: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  hours: {
    type: String,
    default: 'Monday – Saturday, 10:00 AM – 6:30 PM'
  },
  instagramUrl: {
    type: String,
    default: 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy'
  },
  instagramHandle: {
    type: String,
    default: '@candycrafts2026'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
