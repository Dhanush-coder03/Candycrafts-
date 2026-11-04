import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree, Plus, ExternalLink, Edit, Trash2, X,
  Image as ImageIcon, RefreshCw, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminCategoriesPage = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    serverStatus
  } = useProducts();

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveError, setSaveError] = useState(null);

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

  // Auto-refresh categories from DB on mount
  useEffect(() => {
    if (refreshCategories) {
      refreshCategories();
    }
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (refreshCategories) await refreshCategories();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Open Edit Modal
  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name || '');
    setEditTagline(cat.tagline || '');
    setEditDesc(cat.description || '');
    setEditImages(cat.image ? [cat.image] : []);
    setSaveError(null);
  };

  // Submit Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      await addCategory({
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
    } catch (err) {
      setSaveError(err?.message || 'Failed to create category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      await updateCategory(editingCategory.id || editingCategory.slug, {
        name: editName.trim(),
        tagline: editTagline.trim() || 'Artisanal Collection',
        description: editDesc.trim(),
        image: editImages[0] || editingCategory.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'
      });

      setEditingCategory(null);
      setSaveError(null);
    } catch (err) {
      setSaveError(err?.message || 'Failed to update category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id || categoryToDelete.slug);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-walnut-900">
            Craft Categories &amp; Collections
          </h2>
          <p className="text-xs text-walnut-500">
            Edit, create, or delete boutique categories. Changes immediately reflect across public store navigation, filters, and products.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-cream-300 bg-white hover:bg-cream-50 text-walnut-700 text-xs font-semibold transition"
            title="Reload categories from MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-terracotta-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
          </button>

          <button
            onClick={() => { setShowAddModal(true); setSaveError(null); }}
            className="px-5 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* DB Status Badge */}
      <div className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl border ${
        serverStatus?.dbConnected
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-amber-50 border-amber-200 text-amber-700'
      }`}>
        {serverStatus?.dbConnected
          ? <CheckCircle2 className="w-3.5 h-3.5" />
          : <AlertCircle className="w-3.5 h-3.5" />
        }
        <span>
          {serverStatus?.checked
            ? (serverStatus?.dbConnected
              ? `Live Cloud Sync Active — MongoDB Atlas Connected. All category changes save directly to the database.`
              : `Offline Mode — Changes saved locally. Connect backend to persist to MongoDB Atlas.`)
            : 'Checking database connection...'}
        </span>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full p-16 text-center space-y-3 bg-white rounded-3xl border border-cream-200">
            <FolderTree className="w-10 h-10 text-walnut-300 mx-auto" />
            <p className="text-walnut-500 text-sm">No categories found. Click "New Category" to add one.</p>
          </div>
        ) : (
          categories.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;

            return (
              <div
                key={cat.id || cat.slug || cat._id}
                className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-soft-md transition duration-200"
              >
                {/* Cover Image & Badges */}
                <div className="relative aspect-[16/9] overflow-hidden bg-cream-100 group">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cream-100">
                      <ImageIcon className="w-10 h-10 text-cream-300" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-walnut-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs border border-cream-200">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>

                  {/* Slug badge */}
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

                  {/* Action Buttons */}
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
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-walnut-800 text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                        title="Edit Category Details"
                      >
                        <Edit className="w-3.5 h-3.5 text-terracotta-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-walnut-400 hover:text-red-600 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-lg border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-walnut-900">Edit Category</h3>
                <span className="text-xs text-walnut-400">Editing "{editingCategory.name}"</span>
              </div>
              <button
                onClick={() => { setEditingCategory(null); setSaveError(null); }}
                className="p-1.5 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 focus:bg-white resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Cover Photo
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
                  onClick={() => { setEditingCategory(null); setSaveError(null); }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-walnut-700 bg-cream-100 hover:bg-cream-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-terracotta-500 hover:bg-terracotta-600 shadow-sm transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
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
              <h3 className="font-serif text-xl font-bold text-walnut-900">Add New Category</h3>
              <button
                onClick={() => { setShowAddModal(false); setSaveError(null); }}
                className="p-1.5 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 focus:bg-white"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-cream-50/50 focus:bg-white resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Cover Photo
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
                  onClick={() => { setShowAddModal(false); setSaveError(null); }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-walnut-700 bg-cream-100 hover:bg-cream-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-terracotta-500 hover:bg-terracotta-600 shadow-sm transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Category</span>
                  )}
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
