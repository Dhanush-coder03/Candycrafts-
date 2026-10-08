import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { Toast } from '../components/common/Toast';

export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  let pageTitle = "Atelier Dashboard";
  if (location.pathname.includes('/admin/orders')) {
    pageTitle = "Orders & Customer Deliveries";
  } else if (location.pathname.includes('/admin/products/add')) {
    pageTitle = "Add New Craft Product";
  } else if (location.pathname.includes('/admin/products/edit')) {
    pageTitle = "Edit Craft Product";
  } else if (location.pathname.includes('/admin/products')) {
    pageTitle = "Catalog & Inventory";
  } else if (location.pathname.includes('/admin/categories')) {
    pageTitle = "Collections & Categories";
  } else if (location.pathname.includes('/admin/contact')) {
    pageTitle = "Studio Contact Information Settings";
  } else if (location.pathname.includes('/admin/inquiries')) {
    pageTitle = "Customer Messages & Inquiries";
  }

  return (
    <div className="min-h-screen bg-cream-100/70 flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader
          title={pageTitle}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
};
