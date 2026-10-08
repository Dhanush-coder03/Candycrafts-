const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo,
  testEmailConfig
} = require('../controllers/contactController');

router.route('/')
  .get(getContactInfo)
  .put(updateContactInfo);

router.post('/test-email', testEmailConfig);

module.exports = router;
