const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    if (!categoryData.id) {
      categoryData.id = 'cat_' + Date.now();
    }
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = await Category.create(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const updateData = req.body;
    const oldCategory = await Category.findOne({
      $or: [
        { id: req.params.id },
        { slug: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }
      ]
    });

    if (!oldCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const oldName = oldCategory.name;

    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: oldCategory._id },
      updateData,
      { new: true, runValidators: true }
    );

    // If category name changed, update products that belong to this category
    if (updateData.name && updateData.name !== oldName) {
      await Product.updateMany(
        { category: oldName },
        { category: updateData.name }
      );
    }

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      $or: [
        { id: req.params.id },
        { slug: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }
      ]
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
