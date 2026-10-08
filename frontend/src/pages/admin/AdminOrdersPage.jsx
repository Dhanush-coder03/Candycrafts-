import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Trash2, 
  X, 
  MessageCircle, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';

const STATUS_COLORS = {
  Pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  Processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  Shipped: { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Cancelled: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' }
};

export const AdminOrdersPage = () => {
  const { orders = [], updateOrderStatus, deleteOrder, contactInfo } = useProducts();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? (o.totalAmount || 0) : 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = (orderId, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      deleteOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-walnut-500 text-xs font-semibold uppercase">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-terracotta-500" />
          </div>
          <div className="mt-2 font-serif text-3xl font-bold text-walnut-900">{totalOrders}</div>
          <span className="text-[11px] text-walnut-400">All recorded craft orders</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase">
            <span>Pending Action</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 font-serif text-3xl font-bold text-amber-600">{pendingOrders}</div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting studio crafting</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase">
            <span>Delivered Crafts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-serif text-3xl font-bold text-emerald-700">{deliveredOrders}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Successfully completed</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between text-walnut-500 text-xs font-semibold uppercase">
            <span>Total Revenue</span>
            <Sparkles className="w-4 h-4 text-terracotta-500" />
          </div>
          <div className="mt-2 font-serif text-2xl font-bold text-terracotta-600">{formatPrice(totalRevenue)}</div>
          <span className="text-[11px] text-walnut-400">Excluding cancellations</span>
        </div>
      </div>

      {/* Owner Order Email Notification Strip */}
      <div className="bg-terracotta-50/70 border border-terracotta-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-600 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-walnut-900 block">
              Owner Order Queries Inbox: {ownerEmail}
            </span>
            <span className="text-[11px] text-walnut-600">
              வாடிக்கையாளர்கள் Website-ல் போடும் Order Query-கள் இந்த Owner Email-க்கு தான் வந்து சேரும். Click an order to send confirmation directly.
            </span>
          </div>
        </div>
        <span className="px-3 py-1 bg-white text-terracotta-700 font-mono text-[11px] font-semibold rounded-full border border-terracotta-200 shrink-0 self-start sm:self-center">
          {ownerEmail}
        </span>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-cream-200 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-walnut-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Customer Name, Phone, Gmail or Order ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/50 focus:outline-none focus:border-terracotta-500 text-walnut-900"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-walnut-400 hover:text-walnut-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-terracotta-500 text-white shadow-xs'
                  : 'bg-cream-100 text-walnut-600 hover:bg-cream-200'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-cream-100 text-walnut-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-walnut-800">No Orders Found</h3>
            <p className="text-xs text-walnut-500 max-w-sm mx-auto">
              {searchTerm 
                ? `No orders matching "${searchTerm}". Try a different name, phone, or Gmail.` 
                : 'When customers place orders from the store, they will appear here instantly.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-50/70 border-b border-cream-200 text-[11px] font-semibold uppercase tracking-wider text-walnut-500">
                  <th className="py-4 px-6">Order ID & Date</th>
                  <th className="py-4 px-4">Customer Details</th>
                  <th className="py-4 px-4">Phone / WhatsApp</th>
                  <th className="py-4 px-4">Items</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-sm">
                {filteredOrders.map((order) => {
                  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-cream-50/50 transition cursor-pointer group"
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-terracotta-600 block">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-walnut-400 block mt-0.5">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      {/* Customer Name & Gmail */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-walnut-900 group-hover:text-terracotta-600 transition">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-walnut-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-terracotta-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{order.customerEmail}</span>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <a 
                            href={`tel:${order.customerPhone?.replace(/[^0-9+]/g, '')}`}
                            className="text-xs font-medium text-walnut-800 hover:text-terracotta-600 flex items-center gap-1 transition"
                            title="Call customer"
                          >
                            <Phone className="w-3.5 h-3.5 text-terracotta-500" />
                            <span>{order.customerPhone}</span>
                          </a>

                          {order.customerPhone && (
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}! Regarding your Candy Crafts Order #${order.id}...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {order.items?.[0]?.image && (
                            <img
                              src={order.items[0].image}
                              alt={order.items[0].name}
                              className="w-9 h-9 rounded-lg object-cover border border-cream-200 shrink-0"
                            />
                          )}
                          <div>
                            <span className="text-xs text-walnut-800 font-medium block truncate max-w-[150px]">
                              {order.items?.[0]?.name || 'Craft Product'}
                            </span>
                            <span className="text-[10px] text-walnut-400">
                              {order.items?.length || 1} {order.items?.length === 1 ? 'craft item' : 'craft items'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4">
                        <span className="font-serif font-bold text-walnut-900 text-sm">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${statusStyle.bg}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-walnut-500 hover:text-terracotta-600 hover:bg-cream-100 rounded-lg transition"
                            title="Click to view Customer Phone, Name & Gmail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(order.id, e)}
                            className="p-1.5 text-walnut-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer & Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status) => {
          updateOrderStatus(id, status);
          setSelectedOrder(prev => ({ ...prev, status }));
        }}
        onDelete={(id) => {
          if (window.confirm(`Are you sure you want to delete order #${id}?`)) {
            deleteOrder(id);
            setSelectedOrder(null);
          }
        }}
      />

    </div>
  );
};
