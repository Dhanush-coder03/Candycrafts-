const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo
} = require('../controllers/contactController');

router.route('/')
  .get(getContactInfo)
  .put(updateContactInfo);

module.exports = router;
