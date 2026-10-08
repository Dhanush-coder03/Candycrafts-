const ContactInfo = require('../models/ContactInfo');

const DEFAULT_CONTACT_INFO = {
  brandName: 'Candy Crafts',
  tagline: 'Artisan Studio & Workshop',
  address: 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter, New Delhi - 110001',
  email: 'candycraftssstudio@gmail.com',
  ownerEmail: 'candycraftssstudio@gmail.com',
  phone: '+91 98765 43210',
  hours: 'Monday – Saturday, 10:00 AM – 6:30 PM',
  instagramUrl: 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy',
  instagramHandle: '@candycrafts2026'
};

// @desc    Get studio contact info
// @route   GET /api/contact
exports.getContactInfo = async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = await ContactInfo.create(DEFAULT_CONTACT_INFO);
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update studio contact info
// @route   PUT /api/contact
exports.updateContactInfo = async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();

    if (!contact) {
      contact = await ContactInfo.create({ ...DEFAULT_CONTACT_INFO, ...req.body });
    } else {
      contact = await ContactInfo.findByIdAndUpdate(
        contact._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
