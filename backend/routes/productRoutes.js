const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getProductReviews,
  createReview
} = require('../controllers/reviewController');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(createReview);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;

