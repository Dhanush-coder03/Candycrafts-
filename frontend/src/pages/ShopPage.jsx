import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  ChevronDown, 
  Grid3X3, 
  LayoutGrid, 
  Filter 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductGrid } from '../components/products/ProductGrid';

export const ShopPage = () => {
  const { categorySlug } = useParams();
  const { products, categories } = useProducts();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'price-low' | 'price-high' | 'rating'
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync route param with category filter
  useEffect(() => {
    if (categorySlug) {
      const matchedCat = categories.find(c => c.slug === categorySlug);
      if (matchedCat) {
        setSelectedCategory(matchedCat.name);
      } else {
        // Fallback title formatting
        const formatted = categorySlug.replace(/-/g, ' ');
        const found = categories.find(c => c.name.toLowerCase() === formatted.toLowerCase());
        if (found) setSelectedCategory(found.name);
      }
    } else {
      setSelectedCategory('All');
    }
  }, [categorySlug, categories]);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Search query filter
      const matchesSearch = 
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // In stock filter
      const matchesStock = !inStockOnly || p.available;

      return matchesCategory && matchesSearch && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-high') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      }
      // 'latest' default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('latest');
    setInStockOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-cream-200/60 rounded-3xl p-8 sm:p-12 border border-cream-300/80 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold mb-2 block">
            Artisan Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-walnut-900 mb-3">
            {selectedCategory === 'All' ? 'All Handcrafted Creations' : selectedCategory}
          </h1>
          <p className="text-sm sm:text-base text-walnut-600 font-light leading-relaxed">
            Every piece is made with intention, patience, and love. Explore everlasting paper florals, natural clay idols, and bespoke gift arrangements.
          </p>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="space-y-4">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'All'
                ? 'bg-terracotta-500 text-white shadow-xs'
                : 'bg-white border border-cream-300 text-walnut-700 hover:bg-cream-100'
            }`}
          >
            All Crafts ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-terracotta-500 text-white shadow-xs'
                    : 'bg-white border border-cream-300 text-walnut-700 hover:bg-cream-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-terracotta-600 text-white' : 'bg-cream-200 text-walnut-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort and Stock Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-walnut-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by craft name or material..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-cream-50/70 border border-cream-200 text-xs text-walnut-900 placeholder-walnut-400 focus:outline-none focus:border-terracotta-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-walnut-400 hover:text-walnut-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Actions: Sort, Stock Filter, Count */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-walnut-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-terracotta-500 focus:ring-terracotta-400 accent-terracotta-500"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 text-xs text-walnut-600">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-walnut-800 font-medium focus:outline-none focus:border-terracotta-500 cursor-pointer"
              >
                <option value="latest">Latest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>

            {/* Count badge */}
            <span className="text-xs font-semibold text-walnut-500 bg-cream-100 px-3 py-1.5 rounded-xl border border-cream-200">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Craft' : 'Crafts'}
            </span>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        emptyMessage={`No crafts found matching your filter.`}
        onResetFilter={handleResetFilters}
      />

    </div>
  );
};
