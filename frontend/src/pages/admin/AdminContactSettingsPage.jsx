import React, { useState } from 'react';
import { Save, MapPin, Mail, Phone, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const AdminContactSettingsPage = () => {
  const { contactInfo, updateContactInfo } = useProducts();

  const [formData, setFormData] = useState({
    brandName: contactInfo.brandName || 'Candy Crafts',
    tagline: contactInfo.tagline || 'Artisan Studio & Workshop',
    address: contactInfo.address || '',
    email: contactInfo.email || 'candycraftssstudio@gmail.com',
    ownerEmail: contactInfo.ownerEmail || 'candycraftssstudio@gmail.com',
    phone: contactInfo.phone || '',
    hours: contactInfo.hours || '',
    instagramUrl: contactInfo.instagramUrl || '',
    instagramHandle: contactInfo.instagramHandle || ''
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContactInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-walnut-900">
          Studio Contact & Social Information
        </h2>
        <p className="text-xs text-walnut-500">
          Update your store's phone number, email, address, working hours, and Instagram link. Any changes saved here update the public Contact page and Footer immediately in localStorage.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-sage-50 text-sage-700 border border-sage-200 rounded-2xl text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
          <span>Contact information saved successfully and updated live across the website!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
        
        {/* Studio Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
              Studio Brand Name
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Contact Numbers and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-100">
          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Contact Phone / WhatsApp *</span>
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210 (10 AM - 7 PM IST)"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Concierge Email *</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="candycraftssstudio@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Dedicated Owner Order Receiving & Sender Email Configuration */}
        <div className="p-4 sm:p-5 rounded-2xl bg-terracotta-50/70 border border-terracotta-200 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-terracotta-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-walnut-900">
              Owner Order Query & Dispatch Email (ஆர்டர் வர வேண்டிய Owner Mail)
            </span>
          </div>
          <p className="text-xs text-walnut-600 leading-relaxed">
            வாடிக்கையாளர்கள் Website-ல் Order Query போடும் போது, அந்த Order விவரங்கள் இந்த Mail முகவரிக்கு தான் வந்து சேரும். மேலும் Customer-களுக்கு அனுப்பப்படும் Confirmation Mail இந்த முகவரியைக் கொண்டு அனுப்பப்படும்.
          </p>
          <div>
            <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1">
              Owner Order Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.ownerEmail}
              onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              placeholder="candycraftssstudio@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-terracotta-500 font-medium text-walnut-900"
            />
            <span className="text-[11px] text-walnut-500 mt-1 block">
              Default: candycraftssstudio@gmail.com (You can change this anytime)
            </span>
          </div>
        </div>

        {/* Physical Address */}
        <div className="pt-2 border-t border-cream-100">
          <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Studio Physical Address *</span>
          </label>
          <textarea
            rows="2"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Studio location / Workshop street address..."
            className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Studio Hours */}
        <div className="pt-2 border-t border-cream-100">
          <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Operating / Studio Hours</span>
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            placeholder="e.g. Monday – Saturday, 10:00 AM – 6:30 PM"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Social: Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-100">
          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
              <span>Instagram Profile URL *</span>
            </label>
            <input
              type="url"
              required
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              placeholder="https://www.instagram.com/candycrafts2026?..."
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
              Instagram Handle
            </label>
            <input
              type="text"
              value={formData.instagramHandle}
              onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              placeholder="@candycrafts2026"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-soft transition flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact Information</span>
          </button>
        </div>

      </form>
    </div>
  );
};
