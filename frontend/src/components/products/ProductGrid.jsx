import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles, PackageOpen } from 'lucide-react';

export const ProductGrid = ({ products, emptyMessage = "No handcrafted pieces found.", onResetFilter }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-3xl bg-cream-50/80 border border-cream-200 my-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-200/60 flex items-center justify-center text-walnut-400">
          <PackageOpen className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="font-serif text-xl font-medium text-walnut-800 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-sm text-walnut-500 max-w-md mx-auto mb-6">
          We couldn't find any crafts matching your exact selection. Try clearing filters or exploring our other floral collections.
        </p>
        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className="px-6 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
