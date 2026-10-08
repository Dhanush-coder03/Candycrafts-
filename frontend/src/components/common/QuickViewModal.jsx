import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Star, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { formatPrice } from '../../utils/formatters';
import { ProductOrderModal } from '../products/ProductOrderModal';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct } = useCartWishlist();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-soft-lg border border-cream-200 overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 text-walnut-400 hover:text-walnut-800 bg-white/80 hover:bg-cream-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Image */}
        <div className="md:w-1/2 p-6 bg-cream-50 flex flex-col justify-between">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-inner-soft mb-3">
            <img
              src={images[selectedImgIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImgIndex === idx ? 'border-terracotta-500 shadow-sm' : 'border-cream-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-terracotta-600 font-semibold bg-terracotta-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              {product.featured && (
                <span className="text-[11px] font-semibold text-rosewood-600 bg-rosewood-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl font-bold text-walnut-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-cream-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-walnut-500 font-medium">
                {product.rating || '4.9'} ({product.reviewsCount || 12} artisan reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif text-2xl font-bold text-walnut-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-walnut-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-sm text-walnut-600 leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-cream-200">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full py-3.5 px-6 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-soft transition active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Query / Buy Now</span>
            </button>

            <Link
              to={`/product/${product.id}`}
              onClick={() => setQuickViewProduct(null)}
              className="w-full py-2.5 px-4 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-700 font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>View Full Craft Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      <ProductOrderModal
        product={product}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setQuickViewProduct(null);
        }}
        initialQuantity={1}
      />
    </div>
  );
};
