import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Plus, Sparkles, ExternalLink } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const AdminCategoriesPage = () => {
  const { categories, products, addCategory } = useProducts();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catImages, setCatImages] = useState([]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      tagline: newCatTagline.trim() || 'Artisanal Collection',
      description: newCatDesc.trim() || 'Handmade crafts crafted with care.',
      image: catImages[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'
    });

    setNewCatName('');
    setNewCatTagline('');
    setNewCatDesc('');
    setCatImages([]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-walnut-900">
            Craft Categories & Collections
          </h2>
          <p className="text-xs text-walnut-500">
            Organize crafts into boutique collections. Adding a category immediately reflects on public store dropdowns and filter bars.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter(p => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-cream-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-walnut-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {count} {count === 1 ? 'Product' : 'Products'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-terracotta-600 font-semibold block">
                    {cat.tagline || 'Artisan Series'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-walnut-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-walnut-600 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
                  <span className="text-[11px] text-walnut-400 font-mono">
                    Slug: /{cat.slug}
                  </span>
                  <Link
                    to={`/shop/${cat.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-terracotta-600 hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-lg border border-cream-200">
            <h3 className="font-serif text-xl font-bold text-walnut-900 mb-4">
              Add New Category
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Miniature Clay Miniatures"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newCatTagline}
                  onChange={(e) => setNewCatTagline(e.target.value)}
                  placeholder="e.g. Sculpted by Master Artisans"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description of this craft collection..."
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Cover Photo (Upload Base64 or enter URL)
                </label>
                <ImageUploader
                  images={catImages}
                  onChange={setCatImages}
                  maxImages={1}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-walnut-700 bg-cream-100 hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-terracotta-500 hover:bg-terracotta-600 shadow-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
