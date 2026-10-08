import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = "terracotta" }) => {
  const colorStyles = {
    terracotta: {
      bg: 'bg-terracotta-50',
      text: 'text-terracotta-600',
      border: 'border-terracotta-200'
    },
    sage: {
      bg: 'bg-sage-50',
      text: 'text-sage-600',
      border: 'border-sage-200'
    },
    rosewood: {
      bg: 'bg-rosewood-50',
      text: 'text-rosewood-600',
      border: 'border-rosewood-200'
    },
    walnut: {
      bg: 'bg-cream-100',
      text: 'text-walnut-700',
      border: 'border-cream-300'
    }
  };

  const style = colorStyles[color] || colorStyles.terracotta;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cream-200 shadow-soft hover:shadow-soft-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-walnut-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl ${style.bg} border ${style.border} ${style.text} flex items-center justify-center shrink-0`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900 mb-1">
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-walnut-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};
