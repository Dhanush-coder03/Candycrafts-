import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  FolderTree, 
  Sparkles, 
  Plus, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  Edit,
  Eye,
  MessageSquare,
  PhoneCall,
  Mail,
  ShoppingBag,
  Phone
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { StatsCard } from '../../components/admin/StatsCard';
import { formatPrice, formatDate } from '../../utils/formatters';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';

export const AdminDashboardPage = () => {
  const { products, categories, inquiries, orders = [], updateOrderStatus, deleteOrder, contactInfo, serverStatus } = useProducts();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const featuredCount = products.filter(p => p.featured).length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const unreadInquiries = inquiries.filter(i => !i.read).length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-terracotta-600 font-semibold mb-1 block">
            Atelier Management Console
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-900">
            Welcome to Candy Crafts Admin
          </h2>
          <p className="text-sm text-walnut-600 mt-1 max-w-xl font-light">
            All additions, customer orders, contact details, image uploads, and customer messages update live immediately in your browser.
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
            <span className="px-3 py-1 rounded-full bg-terracotta-50 border border-terracotta-200 font-semibold text-terracotta-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Owner Inbox: {ownerEmail}</span>
            </span>

            {/* Backend & MongoDB Status */}
            <span className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${
              serverStatus.online && serverStatus.dbConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : serverStatus.online
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-cream-100 text-walnut-600 border-cream-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                serverStatus.online && serverStatus.dbConnected
                  ? 'bg-emerald-500 animate-pulse'
                  : serverStatus.online
                  ? 'bg-amber-500'
                  : 'bg-walnut-400'
              }`} />
              <span>
                {serverStatus.online && serverStatus.dbConnected
                  ? 'Node.js & MongoDB: Connected'
                  : serverStatus.online
                  ? 'Node.js: Online (MongoDB: Set URI in .env)'
                  : 'Node.js Backend: Ready (Offline Cache Active)'}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-full bg-walnut-900 hover:bg-walnut-800 text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-terracotta-400" />
            <span>Manage Orders ({orders.length})</span>
          </Link>

          <Link
            to="/admin/products/add"
            className="px-4 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Craft</span>
          </Link>

          <Link
            to="/admin/contact"
            className="px-4 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-800 text-xs font-semibold uppercase tracking-wider border border-cream-300 transition flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Contact Info</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            className="px-4 py-2.5 rounded-full bg-white hover:bg-cream-50 text-walnut-800 text-xs font-semibold uppercase tracking-wider border border-cream-300 transition flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Preview Store</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/admin/orders" className="block transform hover:-translate-y-0.5 transition">
          <StatsCard
            title="Customer Orders"
            value={orders.length}
            subtitle={`${pendingOrders} pending for action`}
            icon={ShoppingBag}
            color="terracotta"
          />
        </Link>
        <Link to="/admin/products" className="block transform hover:-translate-y-0.5 transition">
          <StatsCard
            title="Total Products"
            value={totalProducts}
            subtitle="Active in store"
            icon={Package}
            color="walnut"
          />
        </Link>
        <Link to="/admin/categories" className="block transform hover:-translate-y-0.5 transition">
          <StatsCard
            title="Artisan Collections"
            value={totalCategories}
            subtitle="Active craft collections"
            icon={FolderTree}
            color="rosewood"
          />
        </Link>
        <Link to="/admin/inquiries" className="block transform hover:-translate-y-0.5 transition">
          <StatsCard
            title="Customer Inquiries"
            value={inquiries.length}
            subtitle={`${unreadInquiries} unread customer messages`}
            icon={MessageSquare}
            color="sage"
          />
        </Link>
      </div>

      {/* Recent Customer Orders Section */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-walnut-900">Recent Customer Orders</h3>
              <p className="text-xs text-walnut-500">Orders placed by customers. Click any order to view customer Phone & Gmail.</p>
            </div>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-50/70 border-b border-cream-200 text-[11px] font-semibold uppercase tracking-wider text-walnut-500">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Customer Phone</th>
                <th className="py-3.5 px-4">Customer Gmail</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">View Customer Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-xs text-walnut-400">
                    No orders placed yet. Test by ordering an item from the store!
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-cream-50/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-6">
                      <span className="font-mono text-xs font-bold text-terracotta-600 block">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-walnut-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-walnut-900 group-hover:text-terracotta-600 transition">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-walnut-800">
                        <Phone className="w-3 h-3 text-terracotta-500" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-walnut-600">
                        <Mail className="w-3 h-3 text-terracotta-400" />
                        <span className="truncate max-w-[170px]">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-walnut-900 text-sm">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="px-3 py-1 rounded-full bg-cream-100 hover:bg-terracotta-50 hover:text-terracotta-600 text-walnut-700 text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Added Crafts Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-walnut-900">Recently Added Products</h3>
            <p className="text-xs text-walnut-500">Latest handcrafted additions in your catalog</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-50/70 border-b border-cream-200 text-[11px] font-semibold uppercase tracking-wider text-walnut-500">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Added On</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-sm">
              {recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-cream-50/40 transition">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-11 h-11 rounded-xl object-cover border border-cream-200 shrink-0"
                      />
                      <div>
                        <span className="font-medium text-walnut-900 block truncate max-w-xs">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-walnut-400">
                          ID: {product.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-walnut-600">
                    <span className="px-2.5 py-1 rounded-full bg-cream-100 border border-cream-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-walnut-900 text-xs">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition ${
                        product.featured
                          ? 'bg-rosewood-50 text-rosewood-600 border-rosewood-200'
                          : 'bg-cream-50 text-walnut-400 border-cream-200 hover:border-walnut-400'
                      }`}
                    >
                      {product.featured ? '★ Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-xs text-walnut-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/product/${product.id}`}
                        target="_blank"
                        className="p-1.5 text-walnut-400 hover:text-walnut-800 rounded-lg hover:bg-cream-100"
                        title="View on store"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-1.5 text-walnut-400 hover:text-terracotta-600 rounded-lg hover:bg-cream-100"
                        title="Edit craft"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Customer Inquiries Panel */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-walnut-900">Recent Customer Inquiries</h3>
              <p className="text-xs text-walnut-500">Incoming messages from Contact Form & Custom Orders</p>
            </div>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
          >
            <span>View All ({inquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-cream-100">
          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-walnut-400">
              No customer inquiries yet.
            </div>
          ) : (
            recentInquiries.map((inq) => (
              <div key={inq.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-cream-50/40 transition">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-walnut-900 text-xs sm:text-sm">{inq.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cream-100 text-walnut-600 text-[10px] font-medium border border-cream-200">
                      {inq.type}
                    </span>
                    {!inq.read && (
                      <span className="w-2 h-2 rounded-full bg-rosewood-500" />
                    )}
                  </div>
                  <p className="text-xs text-walnut-600 line-clamp-1">{inq.subject || inq.message}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-walnut-400 hidden sm:inline">{formatDate(inq.createdAt)}</span>
                  <Link
                    to="/admin/inquiries"
                    className="px-3 py-1 rounded-xl bg-cream-100 hover:bg-cream-200 text-walnut-700 text-xs font-semibold transition"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
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
