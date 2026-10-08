const Inquiry = require('../models/Inquiry');
const { sendInquiryEmails } = require('../utils/emailService');

// @desc    Get all inquiries
// @route   GET /api/inquiries
exports.getInquiries = async (req, res) => {
  try {
    const { unread, type } = req.query;
    let query = {};

    if (unread === 'true') {
      query.read = false;
    }
    if (type && type !== 'All') {
      query.type = type;
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new inquiry
// @route   POST /api/inquiries
exports.createInquiry = async (req, res) => {
  try {
    const inquiryData = req.body;
    if (!inquiryData.id) {
      inquiryData.id = 'inq_' + Date.now();
    }

    const newInquiry = await Inquiry.create(inquiryData);

    // Send notification emails
    try {
      await sendInquiryEmails(newInquiry);
    } catch (err) {
      console.warn('Inquiry email notice:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been sent! We will contact you soon.',
      data: newInquiry
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Toggle read status of an inquiry
// @route   PATCH /api/inquiries/:id/read
exports.toggleInquiryRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ id: req.params.id });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inquiry.read = !inquiry.read;
    await inquiry.save();

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOneAndDelete({ id: req.params.id });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
