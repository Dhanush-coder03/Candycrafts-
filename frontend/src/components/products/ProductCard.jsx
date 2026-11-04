import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Star, Sparkles, MessageCircle } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';
import { generateDirectProductWhatsAppUrl } from '../../utils/emailService';

export const ProductCard = ({ product }) => {
  const { setQuickViewProduct, openOrderModal } = useCartWishlist();
  const { contactInfo } = useProducts();

  if (!product) return null;

  const targetWhatsApp = contactInfo?.whatsappNumber || contactInfo?.phone || '6382091475';
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

        {/* Hover Quick View & Order Now Buttons */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 flex gap-2">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 py-2 px-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-walnut-800 text-[11px] font-semibold shadow-soft border border-cream-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Quick view"
          >
            <Eye className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openOrderModal(product, 1);
            }}
            className="flex-1 py-2 px-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold shadow-soft flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Order now on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
            <span>Order Now</span>
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
            {product.reviewsCount > 0 ? (
              <div className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
                <span className="text-[11px] text-walnut-400 font-normal">({product.reviewsCount})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-walnut-400 text-[11px]">
                <Star className="w-3 h-3 text-cream-300" />
                <span>0 reviews</span>
              </div>
            )}
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
            <span className="font-sans text-lg font-bold text-walnut-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-walnut-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openOrderModal(product, 1);
              }}
              className="py-1.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Order now (Name, Phone & Address)"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
              <span>Order Now</span>
            </button>

            <Link
              to={`/product/${product.id}`}
              className="text-xs font-semibold text-walnut-500 hover:text-terracotta-600 transition"
              title="View craft details"
            >
              Details →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
