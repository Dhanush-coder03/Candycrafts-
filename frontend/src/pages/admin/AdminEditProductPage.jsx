import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Sparkles, Package, Star } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { formatPrice } from '../../utils/formatters';

export const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, categories } = useProducts();

  const product = getProductById(id);

  // Initialize state directly from product (avoids cascading render warning)
  const [formData, setFormData] = useState(() => ({
    name: product?.name || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    category: product?.category || categories[0]?.name || 'Handmade Bouquets',
    description: product?.description || '',
    featured: Boolean(product?.featured),
    available: product?.available !== undefined ? Boolean(product.available) : true,
    rating: product?.rating || 5.0,
    materials: product?.details?.materials || '',
    dimensions: product?.details?.dimensions || '',
    craftTime: product?.details?.craftTime || '4-6 hours handcrafted',
    care: product?.details?.care || ''
  }));

  const [images, setImages] = useState(() => product?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-walnut-900">Craft Product Not Found</h2>
        <p className="text-sm text-walnut-600">The product you are trying to edit does not exist in localStorage.</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-terracotta-500 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Back to Products List
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Product name cannot be empty.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('Please specify a valid price.');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Please provide at least one product image.');
      return;
    }

    setSubmitting(true);

    try {
      updateProduct(product.id, {
        name: formData.name.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        description: formData.description.trim(),
        images: images,
        featured: formData.featured,
        available: formData.available,
        rating: Number(formData.rating) || product.rating || 5.0,
        details: {
          materials: formData.materials,
          dimensions: formData.dimensions,
          craftTime: formData.craftTime,
          care: formData.care
        }
      });

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update product in localStorage.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-walnut-600 hover:text-walnut-900 rounded-full hover:bg-cream-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900">
              Edit Handcrafted Product
            </h2>
            <p className="text-xs text-walnut-500">
              Update photos, price, availability, or artisan description. Updates immediately in localStorage.
            </p>
          </div>
        </div>

        <Link
          to={`/product/${product.id}`}
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-800 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View on Public Store</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Form + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft">
          
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2">
              Product Overview
            </h3>

            <div>
              <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                Artisan Story & Description
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2 flex items-center justify-between">
              <span>Product Photography Gallery</span>
              <span className="text-xs font-normal text-walnut-500">Base64 Images in LocalStorage</span>
            </h3>

            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={6}
            />
          </div>

          {/* Craft Specifications */}
          <div className="space-y-4 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2">
              Craft Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Materials Used
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>
          </div>

          {/* Visibility and Availability */}
          <div className="space-y-3 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2">
              Visibility & Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-cream-200 bg-cream-50/50 cursor-pointer hover:bg-cream-50 transition">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded text-terracotta-500 focus:ring-terracotta-400 accent-terracotta-500"
                />
                <div>
                  <span className="text-sm font-semibold text-walnut-900 block">Featured on Homepage</span>
                  <span className="text-xs text-walnut-500">Showcases in top artisan selection</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-cream-200 bg-cream-50/50 cursor-pointer hover:bg-cream-50 transition">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 rounded text-terracotta-500 focus:ring-terracotta-400 accent-terracotta-500"
                />
                <div>
                  <span className="text-sm font-semibold text-walnut-900 block">In Stock & Ready</span>
                  <span className="text-xs text-walnut-500">Uncheck for custom made-to-order</span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-cream-200 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-6 py-3 rounded-full text-xs font-semibold text-walnut-700 bg-cream-100 hover:bg-cream-200 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-walnut-300 text-white text-xs font-semibold uppercase tracking-wider shadow-soft transition flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Update Product'}</span>
            </button>
          </div>

        </form>

        {/* Right Live Preview */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-walnut-500">
            <Eye className="w-4 h-4 text-terracotta-500" />
            <span>Updated Store Card Preview</span>
          </div>

          <div className="bg-white rounded-3xl border border-cream-200 shadow-soft-lg overflow-hidden flex flex-col">
            <div className="relative aspect-square bg-cream-100 overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt="Live Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-walnut-400 p-6 text-center">
                  <Package className="w-10 h-10 stroke-[1.5] mb-2" />
                  <span className="text-xs">No image provided</span>
                </div>
              )}

              {formData.featured && (
                <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md text-terracotta-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-cream-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider font-semibold text-[11px] text-terracotta-600">
                  {formData.category}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {formData.rating || 5.0}
                </span>
              </div>

              <h4 className="font-serif text-base font-bold text-walnut-900 line-clamp-1">
                {formData.name || 'Craft Product Name'}
              </h4>

              <div className="flex items-baseline gap-2 pt-2 border-t border-cream-100">
                <span className="font-serif text-lg font-bold text-walnut-900">
                  {formData.price ? formatPrice(formData.price) : '₹0'}
                </span>
                {formData.originalPrice && (
                  <span className="text-xs text-walnut-400 line-through">
                    {formatPrice(formData.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
