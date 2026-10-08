import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Scissors, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const AboutPage = () => {
  const { setIsCustomOrderOpen } = useCartWishlist();

  return (
    <div className="space-y-20 sm:space-y-24 pb-20">
      
      {/* Hero Editorial Header */}
      <section className="bg-cream-200/50 py-16 sm:py-24 border-b border-cream-300/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-50 border border-cream-300 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-terracotta-600">
              The Candy Crafts Atelier Story
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-walnut-900 leading-tight">
            "We create thoughtfully handcrafted pieces that turn simple moments into beautiful memories."
          </h1>

          <p className="text-base sm:text-lg text-walnut-600 max-w-2xl mx-auto leading-relaxed font-light">
            Founded with a passion for slow artistry, natural textures, and lasting celebrations. Each creation is born from pure patience and human touch.
          </p>
        </div>
      </section>

      {/* Main Philosophy & Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold block">
              Slow Craft vs. Fast Mass Production
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-900 leading-snug">
              Every petal tells a quiet story of patience and devotion.
            </h2>
            <p className="text-sm sm:text-base text-walnut-600 leading-relaxed font-light">
              In a world flooded with disposable plastic goods, Candy Crafts was established to honor tactile craftsmanship. We work with heavy archival crepe papers imported from Italy, hand-dyed cotton fabrics, and natural sun-cured river clay.
            </p>
            <p className="text-sm sm:text-base text-walnut-600 leading-relaxed font-light">
              Unlike fresh cut flowers that wither away in days, our handmade floral arrangements preserve the magic of life’s milestone celebrations forever. From bridal vows and birthdays to quiet morning tea corners, our crafts bring serene poetry to any space.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setIsCustomOrderOpen(true)}
                className="px-6 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider transition shadow-soft"
              >
                Commission a Custom Piece
              </button>
              <Link
                to="/shop"
                className="px-6 py-3 rounded-full bg-white border border-cream-300 text-walnut-800 text-xs font-semibold uppercase tracking-wider hover:bg-cream-100 transition"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-soft aspect-[3/4] bg-cream-200">
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80"
                  alt="Crepe paper floral art"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 rounded-3xl bg-cream-50 border border-cream-200 text-center">
                <span className="font-serif text-3xl font-bold text-walnut-900 block">5000+</span>
                <span className="text-xs text-walnut-500">Petals hand-shaped monthly</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-5 rounded-3xl bg-terracotta-50 border border-terracotta-200 text-center">
                <span className="font-serif text-3xl font-bold text-terracotta-600 block">100%</span>
                <span className="text-xs text-walnut-600">Zero Plastic Botanicals</span>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-soft aspect-[3/4] bg-cream-200">
                <img
                  src="https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80"
                  alt="Handmade terracotta idol"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Pillars of Craftsmanship */}
      <section className="bg-cream-100 py-16 border-t border-cream-300/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-walnut-900">
              Our Core Craft Pillars
            </h3>
            <p className="text-xs sm:text-sm text-walnut-500 mt-2">
              The values that inspire every single piece in our studio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Scissors,
                title: "Artisanal Integrity",
                desc: "Each curve and crinkle is manually shaped with traditional floral tools."
              },
              {
                icon: Leaf,
                title: "Conscious Materials",
                desc: "FSC-certified paper, non-toxic water pigments, and biodegradable packaging."
              },
              {
                icon: Heart,
                title: "Soulful Customization",
                desc: "We work directly with you to craft bespoke gifts matched to your memory."
              },
              {
                icon: ShieldCheck,
                title: "Everlasting Longevity",
                desc: "Engineered to keep colors vibrant and forms intact through the years."
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-500 flex items-center justify-center mb-4">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-walnut-900 mb-1">{pillar.title}</h4>
                <p className="text-xs text-walnut-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
