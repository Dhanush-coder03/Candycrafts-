import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Scissors, 
  Box, 
  ArrowLeft, 
  ChevronRight,
  Share2
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductOrderModal } from '../components/products/ProductOrderModal';
import { formatPrice } from '../utils/formatters';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, getProductById, showToast } = useProducts();

  const product = getProductById(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-walnut-900">Craft Not Found</h2>
        <p className="text-sm text-walnut-600">The craft piece you are searching for might have been retired or updated.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta-500 text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'
  ];

  // You may also like: products from same category or random products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-walnut-500">
        <Link to="/" className="hover:text-terracotta-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-terracotta-600 transition">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-walnut-400">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-walnut-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Gallery & Large Image Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-cream-50 border border-cream-200 shadow-soft">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {product.featured && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-terracotta-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs border border-cream-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                Featured Selection
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-terracotta-500 shadow-md ring-2 ring-terracotta-200'
                      : 'border-cream-300 opacity-70 hover:opacity-100 hover:border-cream-400'
                  }`}
                >
                  <img src={img} alt={`Gallery thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full">
                {product.category}
              </span>

              <button
                onClick={handleShare}
                className="p-2 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
                title="Share craft link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-cream-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-walnut-500 font-medium">
                {product.rating || '4.9'} ({product.reviewsCount || 34} verified patron reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-bold text-walnut-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-walnut-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-semibold text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-sm text-walnut-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Availability and Craft Time badges */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-walnut-500 font-medium">Availability:</span>
              <span className={`font-semibold flex items-center gap-1.5 ${product.available ? 'text-sage-600' : 'text-terracotta-600'}`}>
                <span className={`w-2 h-2 rounded-full ${product.available ? 'bg-sage-500' : 'bg-terracotta-500'}`} />
                {product.available ? 'In Stock & Ready for Packaging' : 'Made to Order (3-5 Days)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-walnut-500">
              <span>Handcraft Duration:</span>
              <span className="text-walnut-800 font-medium">{product.details?.craftTime || '4-6 hours handcrafted'}</span>
            </div>
          </div>

          {/* Main Action: Order Query / Buy Now */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full py-4 px-8 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-base shadow-soft hover:shadow-soft-md transition active:scale-[0.98] flex items-center justify-center gap-2.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order Query / Buy Now</span>
            </button>
            <p className="text-center text-xs text-walnut-500">
              Direct artisan enquiry & fast response from Candy Crafts studio
            </p>
          </div>

          {/* Guarantees List */}
          <div className="pt-6 border-t border-cream-200/80 grid grid-cols-2 gap-3 text-xs text-walnut-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage-500 shrink-0" />
              <span>Eco-friendly non-toxic materials</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-terracotta-500 shrink-0" />
              <span>Complimentary insured shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-terracotta-500 shrink-0" />
              <span>100% Artisan handcrafted</span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-sage-500 shrink-0" />
              <span>Custom gift-ready unboxing</span>
            </div>
          </div>

        </div>

      </div>

      {/* Craft Specifications Tabs */}
      <div className="border border-cream-200 rounded-3xl p-6 sm:p-8 bg-white shadow-soft space-y-6">
        <div className="flex border-b border-cream-200 gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'description'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-walnut-500 hover:text-walnut-800'
            }`}
          >
            Craft Details & Story
          </button>
          <button
            onClick={() => setActiveTab('craft')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'craft'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-walnut-500 hover:text-walnut-800'
            }`}
          >
            Materials & Dimensions
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'care'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-walnut-500 hover:text-walnut-800'
            }`}
          >
            Care Instructions
          </button>
        </div>

        <div className="text-sm text-walnut-600 leading-relaxed max-w-3xl">
          {activeTab === 'description' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              <p>
                Unlike mass-manufactured artificial flowers or synthetic decor, our artisans carefully sculpt, wrinkle, dye, and assemble each floral layer using traditional techniques. Designed to withstand time while retaining authentic botanical tenderness.
              </p>
            </div>
          )}

          {activeTab === 'craft' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-cream-50 rounded-2xl">
                <span className="text-xs uppercase font-semibold text-walnut-500 block mb-1">Materials</span>
                <span className="font-medium text-walnut-900">{product.details?.materials || 'Artisanal paper, organic dyes, wire core, satin ribbon'}</span>
              </div>
              <div className="p-4 bg-cream-50 rounded-2xl">
                <span className="text-xs uppercase font-semibold text-walnut-500 block mb-1">Dimensions</span>
                <span className="font-medium text-walnut-900">{product.details?.dimensions || 'Standard boutique arrangement'}</span>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="p-4 bg-cream-50 rounded-2xl space-y-2">
              <span className="text-xs uppercase font-semibold text-walnut-500 block mb-1">Everlasting Care Guidelines</span>
              <p>{product.details?.care || 'Keep away from excessive moisture or direct water. Dust occasionally using a soft dry makeup or feather brush.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold mb-1 block">
                Complementary Pieces
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900">
                You May Also Like
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
            >
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Direct Order Query Modal */}
      <ProductOrderModal
        product={product}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialQuantity={1}
      />

    </div>
  );
};
