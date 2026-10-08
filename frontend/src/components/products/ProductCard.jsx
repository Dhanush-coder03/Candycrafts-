import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Star, Sparkles } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { formatPrice } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const { setQuickViewProduct } = useCartWishlist();

  if (!product) return null;

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80';
  const secondaryImage = product.images?.[1] || primaryImage;

  return (
    <div className="group relative bg-white rounded-3xl border border-cream-200 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container with Badges & Quick Actions */}
      <div className="relative aspect-[4/4] overflow-hidden bg-cream-50">
        
        {/* Images with hover crossfade/zoom */}
        <Link to={`/product/${product.id}`} className="block w-full h-full overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-terracotta-600 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-cream-200">
              <Sparkles className="w-3 h-3 text-terracotta-500" />
              Featured
            </span>
          )}
          {!product.available && (
            <span className="bg-walnut-800 text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs">
              Made to Order
            </span>
          )}
        </div>

        {/* Hover Quick View Button */}
        <div className="absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="w-full py-2.5 px-4 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-walnut-800 text-xs font-semibold shadow-soft border border-cream-200 flex items-center justify-center gap-2 transition active:scale-95"
            title="Quick view & order"
          >
            <Eye className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Quick View & Order</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-walnut-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-terracotta-600">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-terracotta-600 transition">
            <h3 className="font-serif text-base font-semibold text-walnut-900 leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-walnut-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-walnut-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition flex items-center gap-1"
          >
            Order / Details →
          </Link>
        </div>

      </div>
    </div>
  );
};
