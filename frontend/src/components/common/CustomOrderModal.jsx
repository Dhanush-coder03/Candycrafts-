import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useProducts } from '../../context/ProductContext';
import { 
  generateOwnerInquiryEmail, 
  generateCustomerInquiryConfirmationEmail, 
  generateWhatsAppInquiryUrl 
} from '../../utils/emailService';
import confetti from 'canvas-confetti';

export const CustomOrderModal = () => {
  const { isCustomOrderOpen, setIsCustomOrderOpen } = useCartWishlist();
  const { showToast, addInquiry, contactInfo } = useProducts();

  const [submittedInquiry, setSubmittedInquiry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    craftType: 'Handmade Bridal Bouquet',
    dateNeeded: '',
    budget: '₹1,500 - ₹3,000',
    notes: ''
  });

  if (!isCustomOrderOpen) return null;

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please provide your name and phone number.', 'error');
      return;
    }

    // Save to customer inquiries in localStorage so Admin can view it
    const newInquiry = addInquiry({
      name: formData.name.trim(),
      email: formData.email.trim() || 'candycraftssstudio@gmail.com',
      phone: formData.phone.trim(),
      subject: `Custom Craft: ${formData.craftType} (${formData.budget})`,
      message: `Preferred Date: ${formData.dateNeeded || 'Flexible'}\nBudget: ${formData.budget}\nNotes: ${formData.notes.trim() || 'Bespoke custom creation request'}`,
      type: 'Custom Craft Request'
    });

    setSubmittedInquiry(newInquiry);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {}

    showToast('Your custom craft inquiry has been sent! We will contact you soon.', 'success');
  };

  const handleResetAndClose = () => {
    setSubmittedInquiry(null);
    setIsCustomOrderOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      craftType: 'Handmade Bridal Bouquet',
      dateNeeded: '',
      budget: '₹1,500 - ₹3,000',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-soft-lg border border-cream-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-walnut-400 hover:text-walnut-800 p-1 rounded-full hover:bg-cream-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedInquiry ? (
          <div className="p-6 sm:p-8 text-center space-y-4 my-auto overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-sage-50 text-sage-600 border border-sage-200 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sage-700 bg-sage-50 px-3 py-1 rounded-full border border-sage-200 inline-block mb-1">
                ✓ Inquiry Received
              </span>
              <h3 className="font-serif text-2xl font-bold text-walnut-900">
                Your custom craft inquiry has been sent! We will contact you soon.
              </h3>
              <p className="text-xs text-walnut-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{submittedInquiry.name}</strong>! An automated email notification has been dispatched to <strong>{ownerEmail}</strong>. Our studio team will call or message you on <strong>{submittedInquiry.phone}</strong> shortly!
              </p>
            </div>

            {/* Recap Card */}
            <div className="bg-cream-50/80 p-4 rounded-2xl border border-cream-200 text-left text-xs space-y-1.5 text-walnut-700">
              <div className="font-semibold text-walnut-900 border-b border-cream-200 pb-1 flex justify-between">
                <span>{formData.craftType}</span>
                <span className="text-terracotta-600">{formData.budget}</span>
              </div>
              <div><strong>Name:</strong> {submittedInquiry.name}</div>
              <div><strong>Phone:</strong> {submittedInquiry.phone}</div>
              {submittedInquiry.email && <div><strong>Email:</strong> {submittedInquiry.email}</div>}
              {formData.notes && (
                <div className="pt-1 text-walnut-600 italic bg-white p-2 rounded-xl border border-cream-200">
                  "{formData.notes}"
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3.5 px-6 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-soft transition active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done & Continue Browsing</span>
              </button>

              {contactInfo?.phone && (
                <a
                  href={generateWhatsAppInquiryUrl(submittedInquiry, contactInfo.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs border border-emerald-200 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat on WhatsApp (Optional)</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-terracotta-50 flex items-center justify-center text-terracotta-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-walnut-900">
                  Request a Custom Craft
                </h3>
                <p className="text-xs text-walnut-500">
                  Tailored color palettes, heirloom paper sculptures & bespoke gift creations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Diya Nair"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Gmail / Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. diya@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Date Needed (Optional)
                </label>
                <input
                  type="date"
                  value={formData.dateNeeded}
                  onChange={(e) => setFormData({ ...formData, dateNeeded: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Creation Type
                </label>
                <select
                  value={formData.craftType}
                  onChange={(e) => setFormData({ ...formData, craftType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-white"
                >
                  <option>Handmade Bridal Bouquet</option>
                  <option>Paper Flowers in Glass Dome</option>
                  <option>Custom Handcrafted Idol</option>
                  <option>Anniversary Keepsake Box</option>
                  <option>Bespoke Living Room Arrangement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Estimated Budget
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500 bg-white"
                >
                  <option>Under ₹1,500</option>
                  <option>₹1,500 - ₹3,000</option>
                  <option>₹3,000 - ₹6,000</option>
                  <option>₹6,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                Describe Your Vision or Colors
              </label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Share your favorite flowers, theme colors (e.g. blush pink & terracotta), or specific occasion details..."
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm rounded-full shadow-soft flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Bespoke Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

