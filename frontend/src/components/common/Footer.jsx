import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, MapPin, Phone } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const Footer = () => {
  const { categories, contactInfo } = useProducts();

  const brandName = contactInfo?.brandName || 'Candy Crafts';
  const address = contactInfo?.address || 'Craft Sanctuary 42, Blossom Lane, Heritage District';
  const email = contactInfo?.email || 'candycraftssstudio@gmail.com';
  const phone = contactInfo?.phone || '+91 98765 43210';
  const instagramUrl = contactInfo?.instagramUrl || 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy';

  return (
    <footer className="bg-walnut-900 text-walnut-100 pt-16 pb-12 border-t border-walnut-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter / Boutique Greeting */}
        <div className="pb-12 mb-12 border-b border-walnut-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-widest text-terracotta-400 font-semibold mb-2 block">
              Handcrafted Letters & Private Drops
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-cream-100 font-normal">
              Subscribe to our studio dispatch for new seasonal blooms and exclusive bespoke slots.
            </h3>
          </div>
          <div className="lg:col-span-5">
            <form onSubmit={(e) => { e.preventDefault(); alert(`Thank you for subscribing to ${brandName} studio updates!`); }} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full px-5 py-3 rounded-full bg-walnut-800/80 border border-walnut-700 text-cream-100 placeholder-walnut-400 focus:outline-none focus:border-terracotta-400 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm transition shrink-0 active:scale-95 shadow-sm"
              >
                Join Studio
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-terracotta-500/20 border border-terracotta-500/40 flex items-center justify-center text-terracotta-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-100">
                {brandName}
              </span>
            </Link>
            <p className="text-sm text-walnut-300 leading-relaxed max-w-sm">
              We craft thoughtful, everlasting floral sculptures and artisanal keepsakes that transform simple everyday moments into unforgettable memories. Meticulously made by hand, petal by petal.
            </p>
            {/* Social SVGs */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-walnut-800 flex items-center justify-center text-walnut-300 hover:text-terracotta-400 hover:bg-walnut-700 transition" 
                aria-label={`${brandName} Instagram`}
              >
                <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-walnut-800 flex items-center justify-center text-walnut-300 hover:text-terracotta-400 hover:bg-walnut-700 transition" aria-label="Facebook">
                <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#pinterest" className="w-9 h-9 rounded-full bg-walnut-800 flex items-center justify-center text-walnut-300 hover:text-terracotta-400 hover:bg-walnut-700 transition" aria-label="Pinterest">
                <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                  <line x1="12" y1="18" x2="12" y2="22"/>
                  <circle cx="12" cy="10" r="7"/>
                  <path d="m9 15 3-5 3 5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base text-cream-100 mb-4 font-semibold">Explore</h4>
            <ul className="space-y-2.5 text-sm text-walnut-300">
              <li>
                <Link to="/" className="hover:text-cream-100 transition">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-cream-100 transition">All Crafts Catalog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cream-100 transition">Our Artisan Story</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cream-100 transition">Contact & Atelier</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-base text-cream-100 mb-4 font-semibold">Collections</h4>
            <ul className="space-y-2.5 text-sm text-walnut-300">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link to={`/shop/${cat.slug}`} className="hover:text-cream-100 transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact (Dynamic from Admin) */}
          <div>
            <h4 className="font-serif text-base text-cream-100 mb-4 font-semibold">Artisan Atelier</h4>
            <ul className="space-y-3 text-sm text-walnut-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-terracotta-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-cream-100 transition">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-terracotta-400 shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-cream-100 transition">
                  {phone}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-walnut-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-walnut-400 gap-4">
          <p>© {new Date().getFullYear()} {brandName} Atelier. All handcrafted rights reserved.</p>
          <div className="flex items-center gap-1 text-walnut-300">
            <span>Designed & crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rosewood-400 fill-rosewood-400" />
            <span>for timeless celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
