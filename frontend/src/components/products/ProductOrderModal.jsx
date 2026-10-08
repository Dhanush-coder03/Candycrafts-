import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';
import { 
  generateOwnerOrderEmail, 
  generateCustomerConfirmationEmail, 
  generateWhatsAppOrderUrl 
} from '../../utils/emailService';

export const ProductOrderModal = ({ product, isOpen, onClose, initialQuantity = 1 }) => {
  const { placeOrder, contactInfo } = useProducts();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';
  const totalPrice = (product.price || 0) * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      alert('Please fill in your Name, Phone Number, and Gmail address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order query to persistent store (instantly visible in Admin Panel)
      // and triggers backend Nodemailer email automatically in background
      const newOrder = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: shippingAddress.trim() || 'To be confirmed on call',
        notes: notes.trim(),
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
            category: product.category
          }
        ],
        totalAmount: totalPrice,
        type: 'Direct Product Order Query'
      });

      setSubmittedOrder(newOrder);

      // Confetti celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (err) {
      console.error('Order query error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setShippingAddress('');
    setNotes('');
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-cream-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cream-200 bg-cream-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-walnut-900">
                {submittedOrder ? 'Order Query Confirmed' : 'Place Product Order Query'}
              </h3>
              <span className="text-xs text-walnut-500">
                {submittedOrder ? 'We have received your enquiry' : 'Direct artisan enquiry & fast studio response'}
              </span>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {submittedOrder ? (
            /* Clean Success View - Automated email already sent */
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-sage-50 text-sage-600 border border-sage-200 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sage-700 bg-sage-50 px-3 py-1 rounded-full border border-sage-200 inline-block mb-1">
                  ✓ Order Query Received
                </span>
                <h4 className="font-serif text-2xl font-bold text-walnut-900">
                  Your order query has been sent! We will contact you soon.
                </h4>
                <p className="text-xs text-walnut-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submittedOrder.customerName}</strong>! An automated email notification has been dispatched to <strong>{ownerEmail}</strong>, and a confirmation copy has been sent to your Gmail (<strong>{submittedOrder.customerEmail}</strong>). We will contact you at <strong>{submittedOrder.customerPhone}</strong> shortly!
                </p>
              </div>

              {/* Order Query Recap Card */}
              <div className="bg-cream-50/80 p-4 rounded-2xl border border-cream-200 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                  <span className="font-mono text-xs font-bold text-terracotta-600">
                    Order Ref: #{submittedOrder.id}
                  </span>
                  <span className="font-serif font-bold text-walnut-900 text-sm">
                    {formatPrice(submittedOrder.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-cream-200 shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-walnut-900 block text-sm">{product.name}</span>
                    <span className="text-walnut-500 text-[11px] block">{product.category} • Quantity: {quantity}</span>
                    <span className="text-sage-600 text-[11px] font-medium">Free Artisanal Packaging</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-cream-200 space-y-1 text-[11px] text-walnut-700">
                  <div className="flex items-center gap-2">
                    <span className="text-walnut-400 w-16">Customer:</span>
                    <span className="font-semibold text-walnut-900">{submittedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-walnut-400 w-16">Phone:</span>
                    <span className="font-medium text-walnut-900">{submittedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-walnut-400 w-16">Gmail:</span>
                    <span className="font-medium text-walnut-900">{submittedOrder.customerEmail}</span>
                  </div>
                  {submittedOrder.shippingAddress && (
                    <div className="flex items-start gap-2 pt-0.5">
                      <span className="text-walnut-400 w-16 shrink-0">Delivery:</span>
                      <span className="text-walnut-800">{submittedOrder.shippingAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Clean Done Button & Optional WhatsApp */}
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
                    href={generateWhatsAppOrderUrl(submittedOrder, contactInfo.phone)}
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
            /* Order Query Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Preview Card with Quantity Selector */}
              <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-cream-200">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-cream-200 shrink-0"
                  />
                  <div>
                    <span className="font-serif text-sm font-bold text-walnut-900 block truncate max-w-[200px]">
                      {product.name}
                    </span>
                    <span className="text-xs text-terracotta-600 font-semibold block">
                      {formatPrice(product.price)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center border border-cream-300 rounded-full px-2.5 py-1 bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-1.5 text-walnut-600 hover:text-walnut-950 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold text-walnut-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-1.5 text-walnut-600 hover:text-walnut-950 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                      Contact Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                      Email / Gmail Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Delivery Address / City & PIN code *
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House / Flat No, Street name, City, State & PIN code..."
                    className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Custom Ribbon Card Note / Craft Requests (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Special gift card message, preferred flower shades, or urgent delivery date..."
                    className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-1">
                <div className="flex justify-between text-walnut-600">
                  <span>Product Total ({quantity}x):</span>
                  <span className="font-medium text-walnut-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-walnut-600">
                  <span>Artisanal Packaging:</span>
                  <span className="text-sage-600 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-cream-200 font-serif text-sm font-bold text-walnut-900">
                  <span>Estimated Total:</span>
                  <span className="text-terracotta-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-walnut-400 text-white font-medium text-sm shadow-soft transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Order Query...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Submit Order Query ({formatPrice(totalPrice)})</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
