import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag,
  Package, 
  PlusCircle, 
  FolderTree, 
  PhoneCall,
  MessageSquare,
  Store, 
  Sparkles, 
  RefreshCw,
  X
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { resetToDefaultData, products, inquiries, orders = [] } = useProducts();

  const unreadCount = inquiries?.filter(i => !i.read).length || 0;
  const pendingOrdersCount = orders?.filter(o => o.status === 'Pending').length || 0;

  const catalogItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { 
      name: 'Customer Orders', 
      path: '/admin/orders', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : orders.length, 
      badgeStyle: pendingOrdersCount > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-walnut-800 text-cream-200'
    },
    { name: 'All Products', path: '/admin/products', icon: Package, badge: products.length },
    { name: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  ];

  const communicationItems = [
    { name: 'Contact Info', path: '/admin/contact', icon: PhoneCall },
    { 
      name: 'Customer Inquiries', 
      path: '/admin/inquiries', 
      icon: MessageSquare, 
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeStyle: 'bg-terracotta-600 text-white animate-pulse'
    },
  ];

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to original 12 artisan sample items? Any custom added items will be replaced.')) {
      resetToDefaultData();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-walnut-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-walnut-900 text-cream-100 flex flex-col border-r border-walnut-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-walnut-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block">
                Candy Crafts
              </span>
              <span className="text-[10px] uppercase tracking-widest text-terracotta-400 font-semibold">
                Admin Studio Console
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-walnut-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-walnut-400">
            Catalog & Orders
          </div>

          {catalogItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-terracotta-500 text-white font-semibold shadow-xs'
                    : 'text-walnut-300 hover:text-white hover:bg-walnut-800/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${item.badgeStyle || 'bg-walnut-800 text-cream-200'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-walnut-400">
            Studio Communications
          </div>

          {communicationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-terracotta-500 text-white font-semibold shadow-xs'
                    : 'text-walnut-300 hover:text-white hover:bg-walnut-800/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${item.badgeStyle || 'bg-terracotta-600 text-white animate-pulse'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Utility Actions */}
        <div className="p-4 border-t border-walnut-800/80 space-y-2">
          {/* Quick reset seed data */}
          <button
            onClick={handleResetCatalog}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-walnut-400 hover:text-terracotta-300 hover:bg-walnut-800/50 rounded-xl transition"
            title="Reset to default seed crafts"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Seed Catalog</span>
          </button>

          {/* Return to Public Website */}
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-walnut-900 bg-cream-200 hover:bg-white transition shadow-sm"
          >
            <Store className="w-4 h-4 text-terracotta-600" />
            <span>Preview Public Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
