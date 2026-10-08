import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useProducts } from '../../context/ProductContext';

export const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const { setIsCustomOrderOpen } = useCartWishlist();
  const { categories } = useProducts();
  const location = useLocation();

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-cream-50/95 backdrop-blur-md shadow-soft border-b border-cream-200 py-3' 
          : 'bg-cream-100/90 backdrop-blur-sm border-b border-cream-200/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-walnut-700 hover:text-terracotta-600 rounded-lg hover:bg-cream-200 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-500 group-hover:bg-terracotta-500 group-hover:text-white transition duration-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-walnut-900 group-hover:text-terracotta-600 transition">
                Candy Crafts
              </span>
              <span className="text-[10px] tracking-widest uppercase text-walnut-500 font-medium -mt-1">
                Handmade Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                    isActive
                      ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                      : 'text-walnut-700 hover:text-terracotta-500 hover:bg-cream-200/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                className="px-4 py-2 rounded-full text-sm font-medium text-walnut-700 hover:text-terracotta-500 hover:bg-cream-200/60 transition flex items-center gap-1.5"
              >
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-terracotta-500' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div 
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-lg border border-cream-200 p-2 mt-1 z-50 animate-fade-in"
                >
                  <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-walnut-400 uppercase border-b border-cream-100">
                    Artisan Collections
                  </div>
                  <div className="py-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop/${cat.slug}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-sm text-walnut-700 hover:text-terracotta-600 hover:bg-cream-50 rounded-xl transition group"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-walnut-400 group-hover:text-terracotta-500">→</span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 border-t border-cream-100">
                    <Link
                      to="/shop"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block text-center text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 py-1"
                    >
                      View All Creations
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-walnut-700 hover:text-terracotta-600 hover:bg-cream-200/60 rounded-full transition"
              title="Search crafts"
              aria-label="Search crafts"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Custom Order / Bespoke Inquiry */}
            <button
              onClick={() => setIsCustomOrderOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-600 font-medium text-xs border border-terracotta-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Custom Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50/98 px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                    isActive
                      ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                      : 'text-walnut-700 hover:bg-cream-200/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-cream-200">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-walnut-400 mb-2">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-walnut-700 bg-white/70 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg border border-cream-200 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-cream-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCustomOrderOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Custom Order</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
