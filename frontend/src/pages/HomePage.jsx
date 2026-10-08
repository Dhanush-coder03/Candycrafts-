import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Scissors, 
  PackageCheck, 
  Palette, 
  CheckCircle2 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { CategoryCard } from '../components/products/CategoryCard';
import { ProductCard } from '../components/products/ProductCard';

export const HomePage = () => {
  const { products, categories } = useProducts();
  const { setIsCustomOrderOpen } = useCartWishlist();

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  const whyChooseUsFeatures = [
    {
      icon: Scissors,
      title: "Handmade Quality",
      description: "Each delicate petal, stem, and idol is individually crafted with high-grade imported papers and organic terracotta."
    },
    {
      icon: Palette,
      title: "Unique Designs",
      description: "No mass factories. Every arrangement is an artistic original with nuanced natural textures that never wither."
    },
    {
      icon: Heart,
      title: "Custom Orders",
      description: "Commission tailored color palettes, bridal flower keepsakes, or bespoke memory gift boxes for your loved ones."
    },
    {
      icon: PackageCheck,
      title: "Carefully Packed",
      description: "Every delicate craft is encased in custom protective shock-absorbent packaging with signature satin ribbons."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-12 sm:pb-20">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-terracotta-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-[350px] h-[350px] bg-rosewood-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-50/90 border border-cream-300 shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-terracotta-600">
                  HANDMADE WITH LOVE
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-walnut-900 font-bold leading-[1.15] tracking-tight">
                Beautiful Crafts, Made to Make Every Moment Special
              </h1>

              <p className="text-base sm:text-lg text-walnut-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover our curated boutique of everlasting crepe paper floral bouquets, artisanal decorative idols, and hand-bound gift creations that bring enduring warmth and botanical poetry to your home.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm sm:text-base shadow-soft hover:shadow-soft-md transition flex items-center justify-center gap-2 active:scale-95 group"
                >
                  <span>Shop Crafts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#categories"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-cream-50 text-walnut-800 border border-cream-300 font-medium text-sm sm:text-base shadow-soft transition flex items-center justify-center gap-2"
                >
                  <span>Explore Collections</span>
                </a>
              </div>

              <div className="pt-6 border-t border-cream-200/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900 block">
                    100%
                  </span>
                  <span className="text-xs text-walnut-500">Handcrafted</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900 block">
                    4.9 ★
                  </span>
                  <span className="text-xs text-walnut-500">Artisan Rating</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900 block">
                    Everlasting
                  </span>
                  <span className="text-xs text-walnut-500">Zero Wilting</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-soft-lg aspect-[4/5] bg-cream-200">
                  <img
                    src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1000&auto=format&fit=crop&q=85"
                    alt="Handmade Pure Ivory Floral Bouquet"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-walnut-900/40 via-transparent to-transparent" />
                </div>

                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-soft border border-cream-200 animate-float hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center text-terracotta-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-walnut-900 block">Petal-by-Petal</span>
                    <span className="text-[11px] text-walnut-500">Pure Handmade Art</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-soft border border-cream-200 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-walnut-900 block">Eco-Conscious</span>
                    <span className="text-[11px] text-walnut-500">Plastic-Free Packaging</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section id="categories" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold mb-2 block">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-walnut-900 font-bold">
              Shop by Craft Category
            </h2>
            <p className="text-sm sm:text-base text-walnut-600 mt-3 font-light">
              From everlasting bridal paper bouquets to soothing terracotta idols and personalized gift arrangements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat) => {
              const actualCount = products.filter(p => p.category === cat.name).length;
              return (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  actualProductCount={actualCount || cat.itemCount}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
            <div>
              <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold mb-1 block">
                Artisan Favorites
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-walnut-900 font-bold">
                Featured Handmade Creations
              </h2>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 group transition"
            >
              <span>Explore All Products ({products.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT STORYTELLING SECTION */}
      <section className="bg-cream-200/50 py-16 sm:py-24 border-y border-cream-300/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] border-4 border-white shadow-soft-lg">
                  <img
                    src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=900&auto=format&fit=crop&q=80"
                    alt="Artisan assembling paper flower petals"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-soft border border-cream-200">
                  <p className="font-serif italic text-sm text-walnut-800 leading-snug">
                    "Every fold, petal curve, and stitch is guided by patience, bringing life to stillness."
                  </p>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-terracotta-600 mt-2 block">
                    — Candy Crafts Artisans
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold block">
                Our Artisan Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-walnut-900 font-bold leading-tight">
                "We create thoughtfully handcrafted pieces that turn simple moments into beautiful memories."
              </h2>
              <p className="text-sm sm:text-base text-walnut-600 leading-relaxed font-light">
                Candy Crafts began as a quiet atelier dream: to preserve the delicate, ephemeral grace of freshly blossomed flora into permanent handcrafted heirlooms. Unlike synthetic plastic decor or quickly wilting flowers, our pieces celebrate the timeless charm of human craftsmanship.
              </p>
              <p className="text-sm sm:text-base text-walnut-600 leading-relaxed font-light">
                From sculpted Italian crepe paper peonies to natural terracotta clay idols curing under the warm sun, every piece is created by skilled hands that treat each craft as an intimate tribute to nature.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-walnut-800 hover:bg-walnut-900 text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm"
                >
                  <span>Read Our Artisan Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold mb-2 block">
              The Artisan Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-walnut-900 font-bold">
              Why Choose Candy Crafts
            </h2>
            <p className="text-sm sm:text-base text-walnut-600 mt-2 font-light">
              We uphold uncompromising dedication to sustainable materials, artistic integrity, and secure packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUsFeatures.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-soft hover:shadow-soft-md transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center text-terracotta-500 mb-5 group-hover:bg-terracotta-500 group-hover:text-white transition duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-walnut-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-walnut-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOM ORDER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-walnut-900 via-walnut-800 to-terracotta-700 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-soft-lg">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-terracotta-500/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-rosewood-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-terracotta-300 font-semibold mb-2 block">
              Bespoke Studio Commissions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Have something special in mind?
            </h2>
            <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed mb-8 font-light">
              Whether you desire a personalized bridal bouquet tailored to your ceremony palette, an auspicious hand-sculpted temple idol, or custom anniversary keepsake boxes, our artisans will bring your vision to life.
            </p>

            <button
              onClick={() => setIsCustomOrderOpen(true)}
              className="px-8 py-4 rounded-full bg-terracotta-500 hover:bg-terracotta-400 text-white font-medium text-sm sm:text-base shadow-soft transition active:scale-95 inline-flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request a Custom Craft</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
