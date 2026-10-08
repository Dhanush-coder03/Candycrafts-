import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCard = ({ category, actualProductCount }) => {
  const count = actualProductCount !== undefined ? actualProductCount : (category.itemCount || 0);

  return (
    <Link
      to={`/shop/${category.slug}`}
      className="group relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] block bg-walnut-800 shadow-soft hover:shadow-soft-lg transition-all duration-500"
    >
      {/* Background Photography with Zoom Effect */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.92] group-hover:brightness-[0.98]"
        loading="lazy"
      />

      {/* Boutique Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-walnut-950/85 via-walnut-950/30 to-transparent transition-opacity group-hover:opacity-90" />

      {/* Decorative Border highlight on hover */}
      <div className="absolute inset-0 rounded-3xl border border-cream-200/20 group-hover:border-terracotta-400/50 transition-colors pointer-events-none" />

      {/* Category Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        {/* Top Tag */}
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
            {count} {count === 1 ? 'Design' : 'Designs'}
          </span>
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transform group-hover:bg-terracotta-500 group-hover:border-terracotta-500 group-hover:rotate-45 transition duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom Details */}
        <div className="space-y-1.5">
          <p className="text-xs text-cream-200 font-medium tracking-wide">
            {category.tagline || 'Artisanal Studio'}
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-terracotta-200 transition duration-300">
            {category.name}
          </h3>
          <p className="text-xs text-cream-100/80 line-clamp-2 hidden sm:block">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
