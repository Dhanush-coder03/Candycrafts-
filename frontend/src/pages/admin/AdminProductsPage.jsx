import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Eye
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatPrice, formatDate } from '../../utils/formatters';

export const AdminProductsPage = () => {
  const { products, deleteProduct, toggleFeatured, toggleAvailability, categories } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-walnut-900">
            Craft Catalog Management
          </h2>
          <p className="text-xs text-walnut-500">
            Manage your store inventory, upload new Base64 photography, and adjust featured highlights.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="px-5 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-walnut-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by craft title or category..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-walnut-900 placeholder-walnut-400 focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-walnut-600">
            <span>Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-walnut-800 font-medium focus:outline-none focus:border-terracotta-500 cursor-pointer"
            >
              <option value="All">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({products.filter(p => p.category === c.name).length})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-semibold text-walnut-500 bg-cream-100 px-3 py-1.5 rounded-xl border border-cream-200 shrink-0">
            {filteredProducts.length} Results
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-50/70 border-b border-cream-200 text-[11px] font-semibold uppercase tracking-wider text-walnut-500">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Featured</th>
                <th className="py-4 px-4">Added On</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-walnut-500 text-sm">
                    No products matched your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50/40 transition">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-cream-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-walnut-900 block truncate max-w-xs">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-walnut-400">
                            {product.images?.length || 1} {product.images?.length === 1 ? 'image' : 'images'} • ID: {product.id.slice(0, 14)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-cream-100 border border-cream-200 text-walnut-700">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs font-bold text-walnut-900">
                      {formatPrice(product.price)}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAvailability(product.id)}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 ${
                          product.available
                            ? 'bg-sage-50 text-sage-600 border-sage-200'
                            : 'bg-walnut-100 text-walnut-500 border-walnut-300'
                        }`}
                        title="Click to toggle in-stock / made-to-order"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.available ? 'bg-sage-500' : 'bg-walnut-400'}`} />
                        {product.available ? 'In Stock' : 'Made to Order'}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition ${
                          product.featured
                            ? 'bg-rosewood-50 text-rosewood-600 border-rosewood-200'
                            : 'bg-cream-50 text-walnut-400 border-cream-200 hover:border-walnut-400'
                        }`}
                        title="Click to toggle featured status"
                      >
                        {product.featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-xs text-walnut-500">
                      {formatDate(product.createdAt)}
                    </td>

                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/product/${product.id}`}
                          target="_blank"
                          className="p-2 text-walnut-400 hover:text-walnut-800 rounded-lg hover:bg-cream-100 transition"
                          title="View on store"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-walnut-400 hover:text-terracotta-600 rounded-lg hover:bg-cream-100 transition"
                          title="Edit craft"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 text-walnut-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete craft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Craft Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action will remove it permanently from localStorage and immediately update the public website.`}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />

    </div>
  );
};
