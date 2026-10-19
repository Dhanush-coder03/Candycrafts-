const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * Helper to recalculate and update a product's rating and reviewsCount
 */
const syncProductRating = async (productId) => {
  try {
    const product = await Product.findOne({
      $or: [
        { id: productId },
        { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }
      ]
    });

    if (!product) return null;

    // Find all reviews matching this product's string id or mongo _id string
    const reviews = await Review.find({
      $or: [
        { productId: product.id },
        { productId: product._id.toString() }
      ]
    });

    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
      : 0;

    product.rating = avgRating;
    product.reviewsCount = reviewsCount;
    await product.save();

    return { product, avgRating, reviewsCount };
  } catch (err) {
    console.error('Error syncing product rating:', err.message);
    return null;
  }
};

// @desc    Get all reviews for a specific product
// @route   GET /api/products/:productId/reviews
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if productId matches string id or _id
    const product = await Product.findOne({
      $or: [
        { id: productId },
        { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }
      ]
    });

    const queryIds = [productId];
    if (product) {
      if (product.id && !queryIds.includes(product.id)) queryIds.push(product.id);
      if (product._id && !queryIds.includes(product._id.toString())) queryIds.push(product._id.toString());
    }

    const reviews = await Review.find({ productId: { $in: queryIds } }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new customer review for a product
// @route   POST /api/products/:productId/reviews or POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const productId = req.params.productId || req.body.productId;
    const { customerName, rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Review comment is required' });
    }

    // Lookup product to attach name and verify existence
    const product = await Product.findOne({
      $or: [
        { id: productId },
        { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }
      ]
    });

    const targetProductId = product ? product.id : productId;
    const productName = product ? product.name : (req.body.productName || 'Artisan Craft Piece');

    const newReview = await Review.create({
      productId: targetProductId,
      productName,
      customerName: customerName.trim(),
      rating: numericRating,
      comment: comment.trim()
    });

    // Recalculate product rating & reviewsCount dynamically
    const syncResult = await syncProductRating(targetProductId);

    res.status(201).json({
      success: true,
      data: newReview,
      productStats: syncResult ? {
        rating: syncResult.avgRating,
        reviewsCount: syncResult.reviewsCount
      } : { rating: numericRating, reviewsCount: 1 }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews across all products (for Admin Console)
// @route   GET /api/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review by ID (Admin moderation)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating after deletion
    const syncResult = await syncProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
      productId,
      productStats: syncResult ? {
        rating: syncResult.avgRating,
        reviewsCount: syncResult.reviewsCount
      } : { rating: 0, reviewsCount: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
