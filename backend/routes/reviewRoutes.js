const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  deleteReview,
  createReview,
  getProductReviews
} = require('../controllers/reviewController');

// Routes mounted at /api/reviews
router.route('/')
  .get(getAllReviews)
  .post(createReview);

router.route('/:id')
  .delete(deleteReview);

router.route('/product/:productId')
  .get(getProductReviews)
  .post(createReview);

module.exports = router;
