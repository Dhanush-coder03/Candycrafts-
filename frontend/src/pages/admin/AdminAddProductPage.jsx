import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Package, 
  Info, 
  Check, 
  Eye, 
  Star 
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { formatPrice } from '../../utils/formatters';

export const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct, categories } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: categories[0]?.name || 'Handmade Bouquets',
    description: '',
    featured: false,
    available: true,
    rating: 5.0,
    materials: '',
    dimensions: '',
    craftTime: '4-6 hours handcrafted',
    care: 'Keep away from excessive moisture; dust gently with a soft dry brush.'
  });

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please specify a product name.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Please upload at least one product photo (local file or URL).');
      return;
    }

    setSubmitting(true);

    try {
      const newProduct = addProduct({
        name: formData.name.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        description: formData.description.trim() || 'A delicately handcrafted piece designed with mindful passion and slow artistry.',
        images: images,
        featured: formData.featured,
        available: formData.available,
        rating: Number(formData.rating) || 5.0,
        reviewsCount: 1,
        details: {
          materials: formData.materials || 'Artisanal paper, organic dyes, wire core, satin ribbon',
          dimensions: formData.dimensions || 'Standard handcrafted boutique dimensions',
          craftTime: formData.craftTime,
          care: formData.care
        }
      });

      // Navigate to admin products list
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while saving the product to localStorage.');
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
              Add New Handcrafted Product
            </h2>
            <p className="text-xs text-walnut-500">
              Upload local photos (auto-compressed to Base64) and create a new catalog item.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft">
          
          {/* 1. Basic Information */}
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
                placeholder="e.g. Lavender Blush Crepe Paper Bouquet"
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
                  placeholder="899"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Original Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="1199"
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
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the inspiration, petal composition, and tactile experience..."
                className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </div>

          {/* 2. Photo Uploads (Local Base64 & Drag Drop) */}
          <div className="space-y-4 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2 flex items-center justify-between">
              <span>Product Photography</span>
              <span className="text-xs font-normal text-walnut-500">Supports Multi-Image Base64</span>
            </h3>

            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={6}
            />
          </div>

          {/* 3. Craft Specifications */}
          <div className="space-y-4 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2">
              Craft Details (Optional)
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
                  placeholder="e.g. 180g Italian crepe paper, floral wire, satin"
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
                  placeholder="e.g. 35 cm height x 24 cm diameter"
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Toggles: Featured & Availability */}
          <div className="space-y-3 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-walnut-900 border-b border-cream-200 pb-2">
              Visibility & Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Featured toggle */}
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-cream-200 bg-cream-50/50 cursor-pointer hover:bg-cream-50 transition">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded text-terracotta-500 focus:ring-terracotta-400 accent-terracotta-500"
                />
                <div>
                  <span className="text-sm font-semibold text-walnut-900 block">Featured on Homepage</span>
                  <span className="text-xs text-walnut-500">Showcases in the top curated gallery</span>
                </div>
              </label>

              {/* In stock toggle */}
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

          {/* Submit Row */}
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
              <span>{submitting ? 'Saving to LocalStorage...' : 'Save & Publish Product'}</span>
            </button>
          </div>

        </form>

        {/* Right Live Preview Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-walnut-500">
            <Eye className="w-4 h-4 text-terracotta-500" />
            <span>Live Store Card Preview</span>
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
                  <span className="text-xs">Upload an image to see live preview</span>
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
                  5.0
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
