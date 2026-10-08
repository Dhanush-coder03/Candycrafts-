import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Toast } from '../components/common/Toast';
import { CustomOrderModal } from '../components/common/CustomOrderModal';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SearchModal } from '../components/products/SearchBar';
import { useProducts } from '../context/ProductContext';

export const PublicLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProducts();

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-walnut-800 subtle-grain">
      {/* Sticky boutique navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <CustomOrderModal />
      <QuickViewModal />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
        results={searchResults}
      />
      <Toast />
    </div>
  );
};
