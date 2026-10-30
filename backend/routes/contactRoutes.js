const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo,
  testEmailConfig,
  testWhatsAppConfig
} = require('../controllers/contactController');

router.route('/')
  .get(getContactInfo)
  .put(updateContactInfo);

router.post('/test-email', testEmailConfig);
router.post('/test-whatsapp', testWhatsAppConfig);

module.exports = router;
