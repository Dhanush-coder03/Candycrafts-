import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Search, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Package, 
  Filter,
  User,
  Heart
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatDate } from '../../utils/formatters';

export const AdminReviewsPage = () => {
  const { reviews = [], deleteReview, products = [] } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews).toFixed(1)
    : '0.0';
  const fiveStarReviews = reviews.filter((r) => Number(r.rating) === 5).length;
  const uniqueProductsReviewed = new Set(reviews.map((r) => r.productId)).size;

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      !searchQuery.trim() ||
      rev.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.productName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      ratingFilter === 'all' || Number(rev.rating) === Number(ratingFilter);

    const matchesProduct =
      productFilter === 'all' || rev.productId === productFilter;

    return matchesSearch && matchesRating && matchesProduct;
  });

  const handleDeleteConfirm = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete.id || reviewToDelete._id);
      setReviewToDelete(null);
    }
  };

  // Get product image helper
  const getProductImage = (productId) => {
    const prod = products.find((p) => p.id === productId || p._id === productId);
    return (
      prod?.images?.[0] ||
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Description */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-terracotta-600 font-semibold mb-1 block">
            Patron Feedback & Moderation
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900">
            Customer Reviews
          </h2>
          <p className="text-sm text-walnut-600 mt-1 max-w-xl font-light">
            All customer reviews posted across your storefront appear here in real-time. Reviews dynamically recalculate each craft's star rating and review count.
          </p>
        </div>

        <Link
          to="/shop"
          className="px-5 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-800 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 self-start md:self-auto shrink-0 shadow-xs"
        >
          <ExternalLink className="w-4 h-4 text-terracotta-600" />
          <span>View Public Store</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-walnut-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-3xl font-bold text-walnut-900">{totalReviews}</span>
          <p className="text-xs text-walnut-400 mt-1">Submitted by genuine patrons</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-walnut-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Store Average</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl font-bold text-walnut-900">{averageRating}</span>
            <span className="text-xs text-walnut-400">/ 5.0</span>
          </div>
          <p className="text-xs text-walnut-400 mt-1">Across all rated crafts</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-walnut-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">5-Star Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-rosewood-50 text-rosewood-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-3xl font-bold text-walnut-900">{fiveStarReviews}</span>
          <p className="text-xs text-walnut-400 mt-1">
            {totalReviews > 0 ? Math.round((fiveStarReviews / totalReviews) * 100) : 0}% of all feedback
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-walnut-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Crafts Reviewed</span>
            <div className="w-8 h-8 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-3xl font-bold text-walnut-900">{uniqueProductsReviewed}</span>
          <p className="text-xs text-walnut-400 mt-1">Out of {products.length} catalog items</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-cream-200 shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-walnut-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, patrons, crafts..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-cream-300 focus:outline-hidden focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-100 bg-cream-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Rating filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-walnut-500 font-medium">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-cream-300 bg-cream-50/50 focus:outline-hidden focus:border-terracotta-500 font-medium text-walnut-800"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Product filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-walnut-500 font-medium">Craft:</span>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-cream-300 bg-cream-50/50 focus:outline-hidden focus:border-terracotta-500 font-medium text-walnut-800 max-w-[180px] truncate"
            >
              <option value="all">All Crafts</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const initials = rev.customerName
              ? rev.customerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)
              : 'CP';

            const prodImg = getProductImage(rev.productId);

            return (
              <div
                key={rev.id || rev._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-soft hover:shadow-soft-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Product Info & Review Content */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Product Thumbnail */}
                  <Link
                    to={`/product/${rev.productId}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-cream-50 border border-cream-200 shrink-0 group relative"
                    title="View Craft in Store"
                  >
                    <img
                      src={prodImg}
                      alt={rev.productName || 'Product'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-walnut-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </Link>

                  {/* Review Text & Patron */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/product/${rev.productId}`}
                        className="font-serif font-bold text-sm sm:text-base text-walnut-900 hover:text-terracotta-600 transition truncate max-w-sm"
                      >
                        {rev.productName || 'Handcrafted Atelier Piece'}
                      </Link>
                      <span className="text-[11px] text-walnut-400">•</span>
                      <span className="text-xs text-walnut-400">
                        {rev.createdAt ? formatDate(rev.createdAt) : 'Recently submitted'}
                      </span>
                    </div>

                    {/* Patron Name and Rating Stars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-terracotta-100 text-terracotta-700 flex items-center justify-center text-[10px] font-bold">
                          {initials}
                        </div>
                        <span className="text-xs font-semibold text-walnut-800">
                          {rev.customerName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" title="Verified Customer" />
                      </div>

                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= Number(rev.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-cream-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-walnut-700 ml-1.5">
                          {rev.rating}★
                        </span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs sm:text-sm text-walnut-600 font-light leading-relaxed pt-1 bg-cream-50/70 p-3 rounded-2xl border border-cream-200">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Right: Moderation Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Link
                    to={`/product/${rev.productId}`}
                    className="p-2.5 text-walnut-500 hover:text-terracotta-600 hover:bg-cream-100 rounded-xl transition"
                    title="View craft on storefront"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setReviewToDelete(rev)}
                    className="p-2.5 text-walnut-400 hover:text-rosewood-600 hover:bg-rosewood-50 rounded-xl transition"
                    title="Delete customer review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : totalReviews > 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-soft space-y-3">
          <p className="text-sm text-walnut-600">No reviews found matching your search or filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setRatingFilter('all');
              setProductFilter('all');
            }}
            className="text-xs font-semibold text-terracotta-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-cream-200 shadow-soft space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-terracotta-500 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl font-bold text-walnut-900">
              No Customer Reviews Yet
            </h3>
            <p className="text-sm text-walnut-600 font-light">
              All products start cleanly at 0 reviews. As customers purchase and share their reviews under each craft item, they will appear right here for your moderation.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-soft transition active:scale-95"
          >
            <span>Visit Store Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(reviewToDelete)}
        title="Delete Customer Review"
        message={`Are you sure you want to delete the review by "${reviewToDelete?.customerName}" for "${reviewToDelete?.productName}"? The product's average star rating and review count will be recalculated immediately.`}
        confirmText="Yes, Delete Review"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
};
