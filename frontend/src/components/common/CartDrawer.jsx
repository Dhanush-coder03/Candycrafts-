import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';
import { 
  generateOwnerOrderEmail, 
  generateCustomerConfirmationEmail, 
  generateWhatsAppOrderUrl 
} from '../../utils/emailService';

export const CartDrawer = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartCount, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCartWishlist();

  const { placeOrder, contactInfo } = useProducts();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Customer Details Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [giftNote, setGiftNote] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      alert('Please fill in your name, phone number, email and delivery address.');
      return;
    }

    const itemsSummary = cart.map(({ product, quantity }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || '',
      category: product.category
    }));

    // 1. Save order into localStorage so it immediately appears in Admin Panel
    const newOrder = placeOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      notes: giftNote.trim(),
      items: itemsSummary,
      totalAmount: cartSubtotal
    });

    setPlacedOrder(newOrder);
    setOrderPlaced(true);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    // Prepare email mailto link
    const emailSubject = `[Candy Crafts] New Order #${newOrder.id} - ${customerName.trim()}`;
    const itemsText = itemsSummary
      .map(item => `• ${item.name} (Qty: ${item.quantity}) - Rs. ${(item.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';
    const ownerMailto = generateOwnerOrderEmail(newOrder, ownerEmail);

    // Automatically trigger mail client to owner
    try {
      window.location.href = ownerMailto;
    } catch {
      // safe fallback
    }

    clearCart();
  };

  const handleResetOrder = () => {
    setIsCheckingOut(false);
    setOrderPlaced(false);
    setPlacedOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setShippingAddress('');
    setGiftNote('');
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-walnut-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-soft-lg flex flex-col border-l border-cream-200">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-cream-200 flex items-center justify-between bg-cream-50/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-terracotta-50 flex items-center justify-center text-terracotta-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-walnut-900">Your Craft Bag</h2>
                <span className="text-xs text-walnut-500 font-medium">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping / Packaging Progress */}
          <div className="px-6 py-3 bg-terracotta-50/50 border-b border-cream-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-walnut-700">
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-terracotta-500" />
                {progressPercent >= 100 
                  ? 'Complimentary Handcrafted Ribbon Box Unlocked!' 
                  : `Add ${formatPrice(amountRemaining)} for complimentary gift packaging`}
              </span>
              <span className="font-bold text-terracotta-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-terracotta-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderPlaced && placedOrder ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sage-50 text-sage-600 border border-sage-200 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block mb-1">
                    Order Query Logged in Admin
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-walnut-900">
                    Your order query has been sent! We will contact you soon.
                  </h3>
                  <p className="text-xs text-walnut-600 max-w-xs leading-relaxed">
                    Our atelier team has received your order query. An email has been prepared for the store owner ({contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com'}) and a confirmation copy is ready for your Gmail.
                  </p>
                </div>

                {/* Customer Details Recap Box */}
                <div className="w-full bg-cream-50/80 p-4 rounded-2xl border border-cream-200 text-left text-xs space-y-2">
                  <div className="font-semibold text-walnut-800 border-b border-cream-200 pb-1.5 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-terracotta-600 font-bold">{formatPrice(placedOrder.totalAmount)}</span>
                  </div>
                  <div className="text-walnut-700 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-walnut-400 font-medium w-16">Customer:</span>
                      <span className="font-semibold text-walnut-900">{placedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-walnut-400 font-medium w-16">Phone:</span>
                      <span className="font-medium text-walnut-800">{placedOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-walnut-400 font-medium w-16">Gmail:</span>
                      <span className="font-medium text-walnut-800">{placedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-start gap-1.5 pt-0.5">
                      <span className="text-walnut-400 font-medium w-16 shrink-0">Deliver to:</span>
                      <span className="text-walnut-800 leading-tight">{placedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Email and WhatsApp Dispatch Actions */}
                <div className="w-full space-y-2 pt-1">
                  {/* Send to Owner */}
                  <a
                    href={generateOwnerOrderEmail(placedOrder, contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com')}
                    className="w-full py-3 px-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-soft transition flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Order Query to Owner ({contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com'})</span>
                  </a>

                  {/* Send to Customer */}
                  <a
                    href={generateCustomerConfirmationEmail(placedOrder, contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com')}
                    className="w-full py-2.5 px-4 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-800 font-medium text-xs border border-cream-300 transition flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-terracotta-600" />
                    <span>Send Confirmation to My Gmail ({placedOrder.customerEmail})</span>
                  </a>

                  {contactInfo?.phone && (
                    <a
                      href={generateWhatsAppOrderUrl(placedOrder, contactInfo.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Order on WhatsApp</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleResetOrder}
                    className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-cream-100 text-walnut-700 text-xs font-semibold transition border border-cream-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 py-1">
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-walnut-900">Checkout & Order Details</h3>
                    <p className="text-[11px] text-walnut-500">Your details will be received by our Admin Console.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-terracotta-600 hover:underline shrink-0"
                  >
                    Back to Bag
                  </button>
                </div>

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

                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Flat / Door No, Street, Landmark, City & PIN code"
                    className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
                    Gift Ribbon Card Note (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="E.g. Wishing you a happy anniversary! With warm regards..."
                    className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-terracotta-500 text-sm"
                  />
                </div>

                <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 text-xs text-walnut-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span className="font-semibold text-walnut-900">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Artisanal Packaging:</span>
                    <span className="text-sage-500 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-cream-200 font-bold text-walnut-900">
                    <span>Total Due:</span>
                    <span className="text-terracotta-600 text-sm">{formatPrice(cartSubtotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded-full shadow-md transition active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm & Place Order ({formatPrice(cartSubtotal)})</span>
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-walnut-400">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-medium text-walnut-800">Your craft bag is empty</h3>
                  <p className="text-xs text-walnut-500 max-w-xs">
                    Explore our botanical blooms, delicate paper flowers, and artisanal idols to bring warmth home.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-terracotta-500 text-white text-xs font-semibold tracking-wider uppercase hover:bg-terracotta-600 transition"
                >
                  Explore Crafts
                </Link>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-3 bg-cream-50/70 rounded-2xl border border-cream-200 group relative"
                >
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-cream-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-semibold text-walnut-900 hover:text-terracotta-600 line-clamp-1 transition"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-walnut-400 hover:text-red-500 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-walnut-500 font-medium">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-cream-300 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-walnut-600 hover:bg-cream-100 transition"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-walnut-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-walnut-600 hover:bg-cream-100 transition"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-walnut-900">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {cart.length > 0 && !isCheckingOut && !orderPlaced && (
            <div className="p-6 border-t border-cream-200 bg-cream-50/50 space-y-3">
              <div className="space-y-1.5 text-xs text-walnut-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span className="font-serif text-lg font-bold text-walnut-900">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-walnut-500">
                  <span>Standard Handcrafted Shipping:</span>
                  <span className="text-sage-500 font-medium">Complimentary</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm shadow-soft flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-walnut-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
                <span>Handmade with non-toxic materials & careful packing</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
