import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, User, Sparkles, Send, ThumbsUp, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatDate } from '../../utils/formatters';

export const ProductReviewsSection = ({ product }) => {
  const { reviews, addReview, showToast } = useProducts();

  // Get all reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id || r.productId === product._id
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState('all');

  const totalReviews = productReviews.length;
  const averageRating = totalReviews > 0
    ? Number((productReviews.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews).toFixed(1))
    : 0;

  // Star breakdown counts
  const starCounts = {
    5: productReviews.filter((r) => Number(r.rating) === 5).length,
    4: productReviews.filter((r) => Number(r.rating) === 4).length,
    3: productReviews.filter((r) => Number(r.rating) === 3).length,
    2: productReviews.filter((r) => Number(r.rating) === 2).length,
    1: productReviews.filter((r) => Number(r.rating) === 1).length,
  };

  const filteredReviews = productReviews.filter((r) => {
    if (filterRating === 'all') return true;
    return Number(r.rating) === Number(filterRating);
  });

  const ratingLabels = {
    1: 'Needs Improvement',
    2: 'Fair Craftsmanship',
    3: 'Charming & Good',
    4: 'Very Beautiful Quality',
    5: 'Exceptional & Masterpiece!',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please enter your name.', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please share your thoughts or review comment.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await addReview(product.id, {
        customerName: customerName.trim(),
        rating,
        comment: comment.trim(),
        productName: product.name,
      });

      // Reset form
      setCustomerName('');
      setComment('');
      setRating(5);
      setIsFormOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews-section" className="space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-cream-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            Verified Patron Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900">
            Customer Reviews
          </h2>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-soft hover:shadow-soft-md transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isFormOpen ? 'Close Form' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Review Submission Form (Expandable) */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-terracotta-200 shadow-soft-lg transition-all animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-walnut-900">
                Share Your Experience
              </h3>
              <p className="text-xs text-walnut-500 mt-0.5">
                Reviewing <span className="font-semibold text-walnut-800 font-serif">"{product.name}"</span>
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-sage-50 text-sage-700 border border-sage-200 font-medium hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
              Verified Patron Review
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Interactive Rating Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-2">
                Your Rating:
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= (hoverRating || rating);
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                        title={`${starVal} Star`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-cream-300 stroke-[1.5]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full ml-2">
                  {ratingLabels[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Patron Name Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1.5">
                Your Name <span className="text-terracotta-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-walnut-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Sundaram"
                  maxLength={70}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-100 transition"
                />
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700">
                  Your Review / Experience <span className="text-terracotta-500">*</span>
                </label>
                <span className="text-[11px] text-walnut-400">
                  {comment.length}/1000 characters
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the craftsmanship, colors, packaging, and unboxing experience..."
                maxLength={1000}
                className="w-full p-3.5 text-sm rounded-xl border border-cream-300 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-100 transition resize-y"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-walnut-600 hover:text-walnut-900 hover:bg-cream-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider shadow-soft hover:shadow-soft-md transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Post Customer Review'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ratings Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Big Rating & Star Visual */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-cream-200/80">
          <span className="font-serif text-5xl sm:text-6xl font-bold text-walnut-900 tracking-tight">
            {totalReviews > 0 ? averageRating.toFixed(1) : '0.0'}
          </span>
          
          <div className="flex items-center text-amber-500 mt-2 mb-1.5 gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  totalReviews > 0 && star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-cream-300'
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-medium text-walnut-600">
            {totalReviews > 0
              ? `Based on ${totalReviews} patron ${totalReviews === 1 ? 'review' : 'reviews'}`
              : '0 customer reviews yet'}
          </p>
          <span className="text-[11px] text-terracotta-600 mt-1">
            {totalReviews > 0 ? '100% verified customer ratings' : 'Ratings increase as patrons post reviews'}
          </span>
        </div>

        {/* Right Column: Rating Distribution Bars */}
        <div className="md:col-span-8 space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setFilterRating(filterRating === String(star) ? 'all' : String(star))}
                  className={`w-12 text-left font-medium flex items-center gap-1 transition ${
                    filterRating === String(star) ? 'text-terracotta-600 font-bold' : 'text-walnut-600 hover:text-walnut-900'
                  }`}
                >
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </button>

                <div className="flex-1 h-2.5 bg-cream-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-terracotta-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-14 text-right text-walnut-400 font-medium">
                  {percentage}% <span className="text-walnut-300">({count})</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Filter Tabs if there are reviews */}
      {totalReviews > 0 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-walnut-500 font-semibold mr-1">Filter by:</span>
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1.5 rounded-full transition font-medium ${
                filterRating === 'all'
                  ? 'bg-walnut-900 text-white'
                  : 'bg-cream-100 text-walnut-600 hover:bg-cream-200'
              }`}
            >
              All ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(String(star))}
                className={`px-3 py-1.5 rounded-full transition font-medium flex items-center gap-1 ${
                  filterRating === String(star)
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-cream-100 text-walnut-600 hover:bg-cream-200'
                }`}
              >
                <span>{star} ★</span>
                <span className="text-[11px] opacity-80">({starCounts[star]})</span>
              </button>
            ))}
          </div>

          <span className="text-xs text-walnut-500">
            Showing {filteredReviews.length} of {totalReviews} reviews
          </span>
        </div>
      )}

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

            return (
              <div
                key={rev.id || rev._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-soft hover:shadow-soft-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-400 to-rosewood-500 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-walnut-900">
                          {rev.customerName}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sage-700 bg-sage-50 border border-sage-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-sage-600" />
                          Verified Patron
                        </span>
                      </div>
                      <span className="text-xs text-walnut-400">
                        {rev.createdAt ? formatDate(rev.createdAt) : 'Recently submitted'}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Number(rev.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-cream-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-walnut-700 leading-relaxed font-light pl-13 pt-1">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      ) : totalReviews > 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-cream-200 shadow-soft space-y-3">
          <p className="text-sm text-walnut-600">No reviews found matching the selected rating filter.</p>
          <button
            onClick={() => setFilterRating('all')}
            className="text-xs font-semibold text-terracotta-600 hover:underline"
          >
            Clear filter
          </button>
        </div>
      ) : (
        /* Empty State (0 reviews) */
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-cream-200 shadow-soft space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-terracotta-500 flex items-center justify-center mx-auto shadow-inner-soft">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-xl font-bold text-walnut-900">
              No Reviews Yet for this Handcrafted Piece
            </h3>
            <p className="text-sm text-walnut-600 font-light max-w-md mx-auto">
              Every creation starts fresh! Be the very first patron to review "{product.name}" and share your thoughts with fellow craft enthusiasts.
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-soft hover:shadow-soft-md transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Be the First to Review</span>
          </button>
        </div>
      )}
    </section>
  );
};
