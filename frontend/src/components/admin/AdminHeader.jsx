import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, ExternalLink, HardDriveDownload, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const AdminHeader = ({ onToggleMobileSidebar, title = "Admin Dashboard" }) => {
  const { products } = useProducts();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-cream-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-walnut-700 hover:bg-cream-100 rounded-xl"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-walnut-900 leading-tight">
            {title}
          </h1>
          <p className="text-xs text-walnut-500 hidden sm:block">
            Browser LocalStorage Mode • Live Store Sync Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Storage status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 text-walnut-600 border border-cream-200 text-xs">
          <HardDriveDownload className="w-3.5 h-3.5 text-sage-500" />
          <span>{products.length} Products in Storage</span>
        </div>

        {/* Quick Add Product Button */}
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>

        {/* Website Preview Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-walnut-600 hover:text-terracotta-600 hover:bg-cream-100 rounded-full transition"
          title="Open Public Website in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
