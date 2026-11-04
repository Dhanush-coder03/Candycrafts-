import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Eye, 
  Star, 
  Package, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatPrice } from '../../utils/formatters';

export const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct, categories, loading } = useProducts();

  const product = getProductById(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Handmade Bouquets',
    description: '',
    featured: false,
    available: true,
    rating: 0,
    materials: '',
    dimensions: '',
    craftTime: '4-6 hours handcrafted',
    care: ''
  });

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync form data whenever product becomes available
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price !== undefined ? String(product.price) : '',
        originalPrice: product.originalPrice !== undefined && product.originalPrice !== null ? String(product.originalPrice) : '',
        category: product.category || categories[0]?.name || 'Handmade Bouquets',
        description: product.description || '',
        featured: Boolean(product.featured),
        available: product.available !== undefined ? Boolean(product.available) : true,
        rating: product.rating !== undefined ? product.rating : 0,
        materials: product.details?.materials || '',
        dimensions: product.details?.dimensions || '',
        craftTime: product.details?.craftTime || '4-6 hours handcrafted',
        care: product.details?.care || ''
      });
      setImages(product.images || []);
    }
  }, [product, categories]);

  // Loading state
  if (loading?.products && !product) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-terracotta-500 animate-spin mx-auto" />
        <p className="text-xs text-walnut-500 font-medium">Fetching craft details from database...</p>
      </div>
    );
  }

  // Not found state
  if (!product && !loading?.products) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-walnut-900">Craft Product Not Found</h2>
        <p className="text-sm text-walnut-600">The product you are trying to edit does not exist or was removed.</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-terracotta-500 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Back to Products List
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
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
      await updateProduct(product.id, {
        name: formData.name.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        description: formData.description.trim(),
        images: images,
        featured: formData.featured,
        available: formData.available,
        rating: product.rating !== undefined ? product.rating : 0,
        reviewsCount: product.reviewsCount !== undefined ? product.reviewsCount : 0,
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
      setErrorMsg(err.message || 'Failed to update product in database.');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      navigate('/admin/products');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete product from database.');
      setShowDeleteModal(false);
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
            <h2 className="font-serif text-2xl font-bold text-walnut-900">
              Edit Craft Details
            </h2>
            <span className="text-xs text-walnut-500">
              Editing #{product.id} • Saves directly to MongoDB database
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/product/${product.id}`}
            target="_blank"
            className="px-4 py-2 rounded-full border border-cream-300 text-xs font-semibold text-walnut-700 hover:bg-cream-100 transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Essential Info & Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Attributes Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-5">
            <h3 className="font-serif text-lg font-bold text-walnut-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-terracotta-500" />
              <span>Core Craft Information</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                Piece Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                  Original / Strikethrough Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                Collection Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                Artisan Story / Description
              </label>
              <textarea
                rows="5"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 resize-y"
              />
            </div>
          </div>

          {/* Detailed Specs Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-5">
            <h3 className="font-serif text-lg font-bold text-walnut-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-terracotta-500" />
              <span>Artisan Specifications & Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                  Materials Used
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="e.g. Italian Crepe, wire, linen wrap"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g. 14 in (H) x 8 in (W)"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                  Handcrafting Time
                </label>
                <input
                  type="text"
                  value={formData.craftTime}
                  onChange={(e) => setFormData({ ...formData, craftTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-walnut-700 mb-1.5">
                  Care Instructions
                </label>
                <input
                  type="text"
                  value={formData.care}
                  onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                  placeholder="e.g. Keep dry, dust gently"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Photography & Display Flags */}
        <div className="space-y-6">

          {/* Image Uploader */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-walnut-900">
              Product Photography
            </h3>
            <p className="text-xs text-walnut-500">
              Upload local craft photos or enter image URLs. The first image will be the primary cover.
            </p>

            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>

          {/* Visibility and Flags */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-walnut-900">
              Visibility & Highlights
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500 border-cream-300"
                />
                <div>
                  <span className="text-xs font-semibold text-walnut-900 block">In Stock / Available</span>
                  <span className="text-[11px] text-walnut-500 block">Show as ready for immediate studio order</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500 border-cream-300"
                />
                <div>
                  <span className="text-xs font-semibold text-walnut-900 block">Feature on Homepage</span>
                  <span className="text-[11px] text-walnut-500 block">Display in the Curated Highlights section</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <Link
              to="/admin/products"
              className="w-full py-3 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-700 font-semibold text-xs uppercase tracking-wider transition block text-center"
            >
              Cancel
            </Link>
          </div>

        </div>

      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Craft Product"
        message={`Are you sure you want to permanently remove "${product.name}" from your store database?`}
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

    </div>
  );
};
