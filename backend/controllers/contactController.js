const ContactInfo = require('../models/ContactInfo');
const { verifyAndTestEmail } = require('../utils/emailService');
const { verifyAndTestWhatsApp } = require('../utils/whatsappService');

const DEFAULT_CONTACT_INFO = {
  brandName: 'Candy Crafts',
  tagline: 'Artisan Studio & Workshop',
  address: 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter, New Delhi - 110001',
  email: 'candycraftssstudio@gmail.com',
  ownerEmail: 'candycraftssstudio@gmail.com',
  emailPass: '',
  phone: '+91 98765 43210',
  hours: 'Monday – Saturday, 10:00 AM – 6:30 PM',
  instagramUrl: 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy',
  instagramHandle: '@candycrafts2026',
  whatsappNumber: '+91 98765 43210',
  whatsappToken: '',
  whatsappPhoneNumberId: '',
  whatsappBusinessAccountId: '',
  whatsappEnabled: true
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

// @desc    Test email configuration live & auto-save to database
// @route   POST /api/contact/test-email
exports.testEmailConfig = async (req, res) => {
  try {
    const { email, emailPass } = req.body;
    const result = await verifyAndTestEmail(email, emailPass);

    // Automatically persist verified credentials to MongoDB
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = await ContactInfo.create({
        ...DEFAULT_CONTACT_INFO,
        email: email || DEFAULT_CONTACT_INFO.email,
        ownerEmail: email || DEFAULT_CONTACT_INFO.ownerEmail,
        emailPass: emailPass || ''
      });
    } else {
      if (emailPass !== undefined) contact.emailPass = emailPass;
      if (email) contact.ownerEmail = email;
      await contact.save();
    }

    res.json({
      success: true,
      message: `✅ SMTP verified & saved to database! A test email was delivered to ${result.email}.`,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `❌ Email test failed: ${error.message}`
    });
  }
};

// @desc    Test WhatsApp configuration live & auto-save to database
// @route   POST /api/contact/test-whatsapp
exports.testWhatsAppConfig = async (req, res) => {
  try {
    const { whatsappNumber, whatsappToken, whatsappPhoneNumberId, whatsappBusinessAccountId, whatsappEnabled } = req.body;
    const result = await verifyAndTestWhatsApp(whatsappNumber, whatsappToken, whatsappPhoneNumberId);

    // Automatically persist verified credentials to MongoDB
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = await ContactInfo.create({
        ...DEFAULT_CONTACT_INFO,
        whatsappNumber: whatsappNumber || DEFAULT_CONTACT_INFO.whatsappNumber,
        whatsappToken: whatsappToken || '',
        whatsappPhoneNumberId: whatsappPhoneNumberId || '',
        whatsappBusinessAccountId: whatsappBusinessAccountId || '',
        whatsappEnabled: whatsappEnabled !== undefined ? Boolean(whatsappEnabled) : true
      });
    } else {
      if (whatsappNumber) contact.whatsappNumber = whatsappNumber;
      if (whatsappToken !== undefined) contact.whatsappToken = whatsappToken;
      if (whatsappPhoneNumberId !== undefined) contact.whatsappPhoneNumberId = whatsappPhoneNumberId;
      if (whatsappBusinessAccountId !== undefined) contact.whatsappBusinessAccountId = whatsappBusinessAccountId;
      if (whatsappEnabled !== undefined) contact.whatsappEnabled = Boolean(whatsappEnabled);
      await contact.save();
    }

    res.json({
      success: true,
      message: `✅ WhatsApp Cloud API verified & saved to database! A live test message was successfully dispatched to ${result.phone}.`,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `❌ WhatsApp test failed: ${error.message}`
    });
  }
};

