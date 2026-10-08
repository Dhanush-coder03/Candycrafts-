import React from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck,
  Send,
  Sparkles
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import { 
  generateOwnerOrderEmail, 
  generateCustomerConfirmationEmail, 
  generateWhatsAppOrderUrl 
} from '../../utils/emailService';

const STATUS_COLORS = {
  Pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  Processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  Shipped: { bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  Delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Cancelled: { bg: 'bg-red-50 text-red-700 border-red-200' }
};

export const OrderDetailsModal = ({ order, onClose, onUpdateStatus, onDelete }) => {
  const { contactInfo } = useProducts();
  if (!order) return null;

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-cream-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-cream-200 bg-cream-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-terracotta-600">
                Order #{order.id}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[order.status]?.bg || ''}`}>
                {order.status}
              </span>
            </div>
            <span className="text-xs text-walnut-500">
              Received on {formatDate(order.createdAt)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-walnut-400 hover:text-walnut-800 rounded-full hover:bg-cream-200 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Customer Contact & Delivery Box */}
          <div className="bg-cream-50/90 rounded-2xl p-5 border border-cream-200 space-y-4">
            <span className="text-[11px] uppercase tracking-wider text-terracotta-600 font-bold block">
              Customer Contact & Delivery Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <span className="text-xs text-walnut-400 block font-medium">Customer Full Name</span>
                <span className="font-serif text-lg font-bold text-walnut-900 block">
                  {order.customerName}
                </span>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <span className="text-xs text-walnut-400 block font-medium">Phone / WhatsApp Number</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.customerPhone?.replace(/[^0-9+]/g, '')}`}
                    className="text-sm font-semibold text-walnut-900 hover:text-terracotta-600 transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>{order.customerPhone}</span>
                  </a>
                  {order.customerPhone && (
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}! We have received your order #${order.id} at Candy Crafts studio.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold flex items-center gap-1 transition"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Gmail */}
              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs text-walnut-400 block font-medium">Customer Gmail / Email</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(`Candy Crafts Order #${order.id} Update`)}`}
                    className="text-sm font-semibold text-terracotta-600 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-terracotta-500" />
                    <span>{order.customerEmail}</span>
                  </a>
                  <a
                    href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(`Candy Crafts Order #${order.id} Update`)}`}
                    className="px-2.5 py-1 rounded-full bg-cream-200 hover:bg-cream-300 text-walnut-800 text-[10px] font-semibold transition"
                  >
                    Send Gmail Reply
                  </a>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-cream-200">
                <span className="text-xs text-walnut-400 block font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Delivery Address</span>
                </span>
                <p className="text-xs text-walnut-800 font-medium whitespace-pre-line leading-relaxed">
                  {order.shippingAddress || 'No shipping address specified'}
                </p>
              </div>

              {/* Special Note / Gift Message */}
              {order.notes && (
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-cream-200">
                  <span className="text-xs text-walnut-400 block font-medium">Gift Ribbon / Note Request</span>
                  <blockquote className="text-xs italic text-walnut-700 bg-white p-3 rounded-xl border border-cream-200">
                    "{order.notes}"
                  </blockquote>
                </div>
              )}
            </div>
          </div>

          {/* Email Routing & Dispatch Actions */}
          <div className="p-4 rounded-2xl bg-terracotta-50/70 border border-terracotta-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-terracotta-600" />
                <span className="text-xs font-bold text-walnut-900 uppercase tracking-wider">
                  Email Dispatch & Communications
                </span>
              </div>
              <span className="text-[11px] text-walnut-600 bg-white px-2.5 py-0.5 rounded-full border border-cream-300">
                Owner Mail: <strong>{ownerEmail}</strong>
              </span>
            </div>

            <p className="text-[11px] text-walnut-600 leading-relaxed">
              இந்த Order-க்கான Confirmation-ஐ Owner Email ({ownerEmail})-ல் இருந்து வாடிக்கையாளரின் Gmail ({order.customerEmail})-க்கு உடனடியாக அனுப்பலாம்:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {/* Send Confirmation to Customer */}
              <a
                href={generateCustomerConfirmationEmail(order, ownerEmail)}
                className="px-4 py-2 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Confirmation to Customer ({order.customerEmail})</span>
              </a>

              {/* Forward to Owner Email */}
              <a
                href={generateOwnerOrderEmail(order, ownerEmail)}
                className="px-4 py-2 rounded-full bg-white hover:bg-cream-100 text-walnut-800 text-xs font-semibold border border-cream-300 transition flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Send Query to Owner ({ownerEmail})</span>
              </a>

              {order.customerPhone && (
                <a
                  href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}! We have received your order query #${order.id} for ${order.items?.[0]?.name} at Candy Crafts studio.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Customer</span>
                </a>
              )}
            </div>
          </div>

          {/* Order Items List */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-walnut-700 uppercase tracking-wider block">
              Ordered Crafts ({order.items?.length || 0})
            </span>

            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-2xl border border-cream-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cream-200"
                    />
                    <div>
                      <span className="font-semibold text-walnut-900 block text-sm">
                        {item.name}
                      </span>
                      <span className="text-walnut-400 text-[11px]">
                        {item.category} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-walnut-900 text-sm block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <span className="text-[10px] text-walnut-400">
                      {formatPrice(item.price)} each
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-walnut-600">
                <span>Subtotal:</span>
                <span className="font-medium">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-walnut-600">
                <span>Artisanal Packaging & Shipping:</span>
                <span className="text-sage-600 font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-cream-200 font-serif text-base font-bold text-walnut-900">
                <span>Grand Total:</span>
                <span className="text-terracotta-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Order Status Controller */}
          {onUpdateStatus && (
            <div className="p-4 bg-terracotta-50/50 rounded-2xl border border-terracotta-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-walnut-900 block">Update Order Status</span>
                <span className="text-[11px] text-walnut-500">Change fulfillment status</span>
              </div>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="px-4 py-2 rounded-xl border border-cream-300 bg-white text-xs font-semibold text-walnut-800 focus:outline-none focus:border-terracotta-500"
              >
                <option value="Pending">Pending (Crafting not started)</option>
                <option value="Processing">Processing (Handcrafting in progress)</option>
                <option value="Shipped">Shipped (Dispatched with tracking)</option>
                <option value="Delivered">Delivered (Safely received)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-cream-200 bg-cream-50 flex items-center justify-between">
          {onDelete ? (
            <button
              onClick={() => onDelete(order.id)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Order</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-walnut-800 hover:bg-walnut-900 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
