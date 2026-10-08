import React, { useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

export const SearchModal = ({ isOpen, onClose, query, setQuery, results }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-soft-lg border border-cream-200 overflow-hidden">
        {/* Input bar */}
        <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center gap-3 bg-cream-50/50">
          <Search className="w-5 h-5 text-terracotta-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handmade bouquets, paper flowers, idols, gifts..."
            className="w-full bg-transparent border-none text-walnut-900 text-base placeholder-walnut-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-walnut-400 hover:text-walnut-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-200 text-walnut-700 hover:bg-cream-300 transition"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center space-y-3">
              <span className="text-xs uppercase font-semibold text-walnut-400 tracking-wider">
                Popular Searches
              </span>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {['Paper Peonies', 'Terracotta Ganesha', 'Lavender Bouquet', 'Anniversary Box', 'Sunflower'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full text-xs bg-cream-100 text-walnut-700 hover:bg-terracotta-50 hover:text-terracotta-600 transition border border-cream-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="font-serif text-base text-walnut-800">No crafts found for "{query}"</p>
              <p className="text-xs text-walnut-500">
                Try searching for "Bouquet", "Flower", "Idol", or "Gift"
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="px-3 py-1 text-xs text-walnut-400 font-medium">
                Found {results.length} handcrafted pieces
              </div>
              {results.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-cream-50 transition border border-transparent hover:border-cream-200 group"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-cream-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-walnut-900 group-hover:text-terracotta-600 truncate transition">
                      {product.name}
                    </h4>
                    <span className="text-xs text-walnut-500">{product.category}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-walnut-900 block">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[11px] text-terracotta-500 font-medium flex items-center gap-0.5 justify-end">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
