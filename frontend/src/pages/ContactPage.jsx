import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { 
  generateOwnerInquiryEmail, 
  generateCustomerInquiryConfirmationEmail, 
  generateWhatsAppInquiryUrl 
} from '../utils/emailService';

export const ContactPage = () => {
  const { showToast, contactInfo, addInquiry } = useProducts();
  const { setIsCustomOrderOpen } = useCartWishlist();
  const [submittedInquiry, setSubmittedInquiry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    // Save message to inquiries store in localStorage so Admin can view it
    const newInquiry = addInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim() || 'General Atelier Inquiry',
      message: formData.message.trim(),
      type: 'Contact Form Message'
    });

    setSubmittedInquiry(newInquiry);
    showToast('Your inquiry has been sent! We will contact you soon.', 'success');

    // Automatically trigger owner email mailto
    const mailtoUrl = generateOwnerInquiryEmail(newInquiry, ownerEmail);
    try {
      window.location.href = mailtoUrl;
    } catch {}
  };

  const handleResetForm = () => {
    setSubmittedInquiry(null);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-terracotta-600 font-semibold block">
          Connect With Us
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-walnut-900">
          Get in Touch with our Atelier
        </h1>
        <p className="text-sm sm:text-base text-walnut-600 font-light">
          Have an inquiry about an existing craft, custom wedding arrangements, or studio visits? We would love to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Contact Info & Atelier Details (Managed dynamically by Admin) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-cream-50/80 p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-walnut-900">
                {contactInfo.brandName || 'Candy Crafts'} Studio
              </h2>
              <span className="text-xs text-terracotta-600 font-medium">
                {contactInfo.tagline || 'Artisan Studio & Workshop'}
              </span>
            </div>

            <div className="space-y-5 text-sm text-walnut-700">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-walnut-900">Artisan Studio & Workshop</span>
                  <span className="text-walnut-600 text-xs leading-relaxed whitespace-pre-line">
                    {contactInfo.address || 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-walnut-900">Email Inquiries</span>
                  <a href={`mailto:${contactInfo.email}`} className="text-walnut-600 hover:text-terracotta-600 text-xs transition">
                    {contactInfo.email || 'candycraftssstudio@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-walnut-900">Concierge Phone / WhatsApp</span>
                  <a href={`tel:${contactInfo.phone?.replace(/[^0-9+]/g, '')}`} className="text-walnut-600 hover:text-terracotta-600 text-xs transition">
                    {contactInfo.phone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              {contactInfo.instagramUrl && (
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5 flex items-center justify-center">
                    <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold block text-walnut-900">Official Instagram</span>
                    <a 
                      href={contactInfo.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-terracotta-600 hover:underline text-xs font-medium"
                    >
                      {contactInfo.instagramHandle || '@candycrafts2026'} ↗
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.hours && (
                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-walnut-900">Studio Hours</span>
                    <span className="text-walnut-600 text-xs">{contactInfo.hours}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Custom Order Box */}
          <div className="p-6 rounded-3xl bg-terracotta-50 border border-terracotta-200 space-y-3">
            <div className="flex items-center gap-2 text-terracotta-600 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Looking for Bespoke Commissions?</span>
            </div>
            <p className="text-xs text-walnut-600 leading-relaxed">
              If you need customized bridal florals or commemorative idol sculptures, you can directly launch our custom craft inquiry form.
            </p>
            <button
              onClick={() => setIsCustomOrderOpen(true)}
              className="text-xs font-bold uppercase tracking-wider text-terracotta-700 hover:text-terracotta-800 underline"
            >
              Open Custom Craft Form →
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-soft">
          {submittedInquiry ? (
            <div className="py-8 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-sage-50 text-sage-600 border border-sage-200 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block mb-1">
                  Enquiry Received & Directed to Owner
                </span>
                <h3 className="font-serif text-2xl font-bold text-walnut-900">
                  Your inquiry has been sent! We will contact you soon.
                </h3>
                <p className="text-xs text-walnut-600 max-w-md mx-auto leading-relaxed">
                  Our artisan atelier has received your message. An email notification has been prepared for the store owner ({ownerEmail}) and a confirmation copy is ready for your email ({submittedInquiry.email}).
                </p>
              </div>

              {/* Inquiry Details Recap Card */}
              <div className="bg-cream-50/80 p-4 rounded-2xl border border-cream-200 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="font-semibold text-walnut-900 border-b border-cream-200 pb-1.5 flex items-center justify-between">
                  <span>Inquiry Summary</span>
                  <span className="text-terracotta-600 font-mono text-[11px]">#{submittedInquiry.id}</span>
                </div>
                <div className="text-[11px] text-walnut-700 space-y-1">
                  <div><strong>From:</strong> {submittedInquiry.name}</div>
                  <div><strong>Email:</strong> {submittedInquiry.email}</div>
                  {submittedInquiry.phone && <div><strong>Phone:</strong> {submittedInquiry.phone}</div>}
                  <div><strong>Subject:</strong> {submittedInquiry.subject}</div>
                  <div className="pt-1 text-walnut-600 italic bg-white p-2 rounded-xl border border-cream-200">
                    "{submittedInquiry.message}"
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 max-w-md mx-auto pt-2">
                {/* 1. Send / Re-trigger mail to Owner */}
                <a
                  href={generateOwnerInquiryEmail(submittedInquiry, ownerEmail)}
                  className="w-full py-3 px-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-soft transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Enquiry to Owner ({ownerEmail})</span>
                </a>

                {/* 2. Send confirmation to Customer */}
                <a
                  href={generateCustomerInquiryConfirmationEmail(submittedInquiry, ownerEmail)}
                  className="w-full py-2.5 px-4 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-800 font-medium text-xs border border-cream-300 transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-terracotta-600" />
                  <span>Send Confirmation to My Email ({submittedInquiry.email})</span>
                </a>

                {/* 3. WhatsApp Studio */}
                {contactInfo?.phone && (
                  <a
                    href={generateWhatsAppInquiryUrl(submittedInquiry, contactInfo.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Inquiry on WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-cream-100 text-walnut-600 text-xs font-semibold transition border border-cream-200"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-serif text-2xl font-bold text-walnut-900 mb-2">
                Send a Note to Our Studio
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sen"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiry regarding Floral Bouquet"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm transition shadow-soft flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
