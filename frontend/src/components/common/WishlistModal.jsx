import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';

export const WishlistModal = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useCartWishlist();
  const { products } = useProducts();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-soft-lg border border-cream-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rosewood-50 flex items-center justify-center text-rosewood-500">
              <Heart className="w-4 h-4 fill-rosewood-500" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-walnut-900">Saved Crafts</h2>
              <span className="text-xs text-walnut-500 font-medium">
                {savedProducts.length} items saved for later
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-rosewood-50 flex items-center justify-center text-rosewood-400">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="font-serif text-base text-walnut-800">Your wishlist is currently empty</p>
              <p className="text-xs text-walnut-500 max-w-xs mx-auto">
                Tap the heart on any handmade craft to keep track of your favorites.
              </p>
            </div>
          ) : (
            savedProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-cream-50/60 border border-cream-200"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-cream-200"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="font-serif text-sm font-semibold text-walnut-900 hover:text-terracotta-600 line-clamp-1 block transition"
                  >
                    {product.name}
                  </Link>
                  <span className="text-xs text-walnut-500">{product.category}</span>
                  <div className="font-semibold text-sm text-walnut-900 mt-0.5">
                    {formatPrice(product.price)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                    }}
                    className="px-3 py-1.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-1.5 text-walnut-400 hover:text-red-500 transition rounded-lg hover:bg-white"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="p-4 border-t border-cream-200 bg-cream-50/40 flex justify-end">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="px-5 py-2 rounded-full text-xs font-semibold text-walnut-700 bg-cream-200 hover:bg-cream-300 transition"
            >
              Continue Browsing
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
