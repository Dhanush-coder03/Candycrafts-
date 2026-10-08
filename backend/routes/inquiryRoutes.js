const express = require('express');
const router = express.Router();
const {
  getInquiries,
  createInquiry,
  toggleInquiryRead,
  deleteInquiry
} = require('../controllers/inquiryController');

router.route('/')
  .get(getInquiries)
  .post(createInquiry);

router.route('/:id')
  .delete(deleteInquiry);

router.route('/:id/read')
  .patch(toggleInquiryRead);

module.exports = router;
