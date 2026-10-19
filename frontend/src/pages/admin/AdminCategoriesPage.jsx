import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Plus, Sparkles, ExternalLink, Edit, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminCategoriesPage = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProducts();

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Add Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catImages, setCatImages] = useState([]);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImages, setEditImages] = useState([]);

  // Open Edit Modal
  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name || '');
    setEditTagline(cat.tagline || '');
    setEditDesc(cat.description || '');
    setEditImages(cat.image ? [cat.image] : []);
  };

  // Submit Create Category
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

  // Submit Update Category
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    updateCategory(editingCategory.id || editingCategory.slug, {
      name: editName.trim(),
      tagline: editTagline.trim() || 'Artisanal Collection',
      description: editDesc.trim(),
      image: editImages[0] || editingCategory.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'
    });

    setEditingCategory(null);
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id || categoryToDelete.slug);
      setCategoryToDelete(null);
    }
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
            Edit, create, or delete boutique categories. Changes immediately reflect across public store navigation, filters, and products.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition flex items-center gap-2 active:scale-95"
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
              key={cat.id || cat.slug}
              className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-soft-md transition duration-200"
            >
              {/* Cover Image & Badges */}
              <div className="relative aspect-[16/9] overflow-hidden bg-cream-100 group">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-walnut-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs border border-cream-200">
                  {count} {count === 1 ? 'Product' : 'Products'}
                </span>

                {/* Quick overlay actions */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-90 hover:opacity-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-walnut-900/80 text-cream-100 backdrop-blur-sm">
                    /{cat.slug}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-terracotta-600 font-semibold block">
                    {cat.tagline || 'Artisan Series'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-walnut-900 mt-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-walnut-600 line-clamp-2 mt-1 font-light leading-relaxed">
                    {cat.description || 'Artisan handcrafted collection.'}
                  </p>
                </div>

                {/* Action Buttons: Edit, Delete, View */}
                <div className="pt-3 border-t border-cream-200/80 flex items-center justify-between">
                  <Link
                    to={`/shop/${cat.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-walnut-600 hover:text-terracotta-600 transition flex items-center gap-1"
                    title="Preview on live store"
                  >
                    <span>View Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Category Button */}
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-walnut-800 text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                      title="Edit Category Details"
                    >
                      <Edit className="w-3.5 h-3.5 text-terracotta-600" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Category Button */}
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1.5 rounded-xl hover:bg-rosewood-50 text-walnut-400 hover:text-rosewood-600 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-lg border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-walnut-900">
                  Edit Category
                </h3>
                <span className="text-xs text-walnut-400">
                  Editing "{editingCategory.name}"
                </span>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1.5 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Handmade Bouquets"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-hidden focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="e.g. Everlasting Floral Arrangements"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-hidden focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Describe this craft collection..."
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-hidden focus:border-terracotta-500 bg-cream-50/50 focus:bg-white resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Cover Photo (Upload Base64 or enter image URL)
                </label>
                <ImageUploader
                  images={editImages}
                  onChange={setEditImages}
                  maxImages={1}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-walnut-700 bg-cream-100 hover:bg-cream-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-terracotta-500 hover:bg-terracotta-600 shadow-sm transition active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-lg border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-200">
              <h3 className="font-serif text-xl font-bold text-walnut-900">
                Add New Category
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                  placeholder="e.g. Miniature Clay Sculptures"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-hidden focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-hidden focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description of this craft collection..."
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-hidden focus:border-terracotta-500 bg-cream-50/50 focus:bg-white resize-y"
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
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-walnut-700 bg-cream-100 hover:bg-cream-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-terracotta-500 hover:bg-terracotta-600 shadow-sm transition active:scale-95"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title="Delete Category Collection"
        message={`Are you sure you want to delete the "${categoryToDelete?.name}" collection? ${
          products.filter(p => p.category === categoryToDelete?.name).length > 0
            ? `Note: There are currently ${products.filter(p => p.category === categoryToDelete?.name).length} products in this category.`
            : ''
        }`}
        confirmText="Yes, Delete Category"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryToDelete(null)}
      />

    </div>
  );
};
