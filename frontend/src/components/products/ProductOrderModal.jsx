import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  User,
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  ExternalLink,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';
import { generateOwnerWhatsAppUrl } from '../../utils/emailService';

export const ProductOrderModal = ({ product, isOpen, onClose, initialQuantity = 1 }) => {
  const { placeOrder, contactInfo } = useProducts();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity || 1);
    }
  }, [isOpen, initialQuantity]);

  if (!isOpen || !product) return null;

  const targetWhatsApp = contactInfo?.whatsappNumber || contactInfo?.phone || '+91 6382091475';
  const totalPrice = (product.price || 0) * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      alert('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order to persistent store (Instantly appears in Admin Panel -> Orders page)
      const newOrder = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: '',
        shippingAddress: shippingAddress.trim(),
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
        type: 'WhatsApp Direct Order'
      });

      setSubmittedOrder(newOrder);

      // 2. Open WhatsApp chat directly to +91 6382091475 with order and customer details
      try {
        const ownerWhatsAppUrl = generateOwnerWhatsAppUrl(newOrder, targetWhatsApp);
        window.open(ownerWhatsAppUrl, '_blank');
      } catch (waErr) {
        console.warn('Auto-open WhatsApp notice:', waErr);
      }

      // 3. Confetti celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (err) {
      console.error('Order placement error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    setShippingAddress('');
    setNotes('');
    setQuantity(1);
    onClose();
  };

  const currentWhatsAppUrl = submittedOrder ? generateOwnerWhatsAppUrl(submittedOrder, targetWhatsApp) : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-cream-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cream-200 bg-cream-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
              <MessageCircle className="w-5 h-5 fill-emerald-100" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-walnut-900">
                {submittedOrder ? 'Order Recorded in System' : 'Complete Your Order Details'}
              </h3>
              <span className="text-xs text-walnut-500 block">
                {submittedOrder ? 'Details saved to Admin Panel & sent to WhatsApp' : 'Fill details below to proceed directly to WhatsApp chat'}
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
            /* Order Submitted Success View */
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
                  ✓ Order Visible in Admin Panel
                </span>
                <h4 className="font-serif text-2xl font-bold text-walnut-900">
                  Order Recorded & WhatsApp Opened!
                </h4>
                <p className="text-xs text-walnut-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submittedOrder.customerName}</strong>! Your order has been registered in the Candy Crafts studio system under <strong>#{submittedOrder.id}</strong>. We've redirected you to WhatsApp chat at <strong>{targetWhatsApp}</strong>.
                </p>
              </div>

              {/* Order Recap Card */}
              <div className="bg-cream-50/80 p-4 rounded-2xl border border-cream-200 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Order Ref: #{submittedOrder.id}
                  </span>
                  <span className="font-sans font-bold text-walnut-900 text-base">
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
                    <span className="text-sage-600 text-[11px] font-medium">Free Boutique Packaging Included</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-cream-200 space-y-1.5 text-[11px] text-walnut-700">
                  <div className="flex items-center gap-2">
                    <span className="text-walnut-400 w-20">Customer:</span>
                    <span className="font-semibold text-walnut-900">{submittedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-walnut-400 w-20">Phone:</span>
                    <span className="font-medium text-walnut-900">{submittedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-0.5">
                    <span className="text-walnut-400 w-20 shrink-0">Delivery to:</span>
                    <span className="text-walnut-900 font-medium">{submittedOrder.shippingAddress}</span>
                  </div>
                  {submittedOrder.notes && (
                    <div className="flex items-start gap-2 pt-0.5">
                      <span className="text-walnut-400 w-20 shrink-0">Note:</span>
                      <span className="text-walnut-700 italic">"{submittedOrder.notes}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-left text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  The studio owner has received your order query on WhatsApp and in their Admin Dashboard. They will confirm crafting schedule and payment details directly.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <a
                  href={currentWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-soft transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Re-open WhatsApp Chat ({targetWhatsApp})</span>
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-6 rounded-full bg-walnut-900 hover:bg-walnut-800 text-white font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Done & Continue Browsing</span>
                </button>
              </div>
            </div>
          ) : (
            /* Order Input Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Preview Card with Quantity Control */}
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
                    className="w-6 h-6 flex items-center justify-center text-walnut-600 hover:text-walnut-950 font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-walnut-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-walnut-600 hover:text-walnut-950 font-bold text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customer Input Fields: Name, Phone, Address */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-walnut-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contact Phone / WhatsApp Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210 or +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Delivery Address (Street, City & PIN) *</span>
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Flat/House No, Street name, City, State & PIN code..."
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-600 uppercase tracking-wider mb-1.5">
                    Special Note / Ribbon Message (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Gift message for greeting card, preferred colors, or urgent delivery date..."
                    className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-1.5">
                <div className="flex justify-between text-walnut-600">
                  <span>Product Subtotal ({quantity}x):</span>
                  <span className="font-semibold text-walnut-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-walnut-600">
                  <span>Handcrafted Packaging:</span>
                  <span className="text-emerald-700 font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-cream-200 font-sans text-base font-bold text-walnut-900">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700 font-bold">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Submit Button: Go to WhatsApp */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-walnut-400 text-white font-semibold text-sm shadow-soft transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Order & Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white/20" />
                    <span>Next: Continue to WhatsApp ({formatPrice(totalPrice)})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-walnut-500">
                Clicking <strong>Next</strong> records your order in the studio admin system and opens WhatsApp chat with <strong>+91 63820 91475</strong>.
              </p>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};