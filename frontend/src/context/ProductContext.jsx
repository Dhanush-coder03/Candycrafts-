/**
 * ProductContext — Pure MongoDB Backend State
 *
 * Rules:
 *  - NO localStorage, NO cache, NO sessionStorage
 *  - All state comes directly from and is written to MongoDB via API
 *  - Optimistic UI: show changes immediately in UI, confirm/rollback with DB response
 *  - On every mount, fetch fresh data from DB (no stale seed data shown)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

// ─── Fallback defaults shown ONLY while loading from DB ───────────────────────
const DEFAULT_CONTACT_INFO = {
  brandName: 'Candy Crafts',
  tagline: 'Artisan Studio & Workshop',
  address: 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter, New Delhi - 110001',
  email: 'candycraftssstudio@gmail.com',
  ownerEmail: 'candycraftssstudio@gmail.com',
  emailPass: '',
  phone: '+91 6382091475',
  whatsappNumber: '+91 6382091475',
  hours: 'Monday – Saturday, 10:00 AM – 6:30 PM',
  instagramUrl: 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy',
  instagramHandle: '@candycrafts2026'
};

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {

  // ─── State — all sourced from MongoDB, starts empty / default ──────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);

  // Loading states
  const [loading, setLoading] = useState({ products: true, categories: true, orders: true });
  const [serverStatus, setServerStatus] = useState({ online: false, dbConnected: false, checked: false });

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ id: Date.now(), message, type });
  const closeToast = () => setToast(null);

  // ─── INITIAL LOAD — fetch everything from MongoDB on mount ────────────────
  useEffect(() => {
    let alive = true;

    const loadAll = async () => {
      // 1. Health check
      api.checkHealth().then(res => {
        if (!alive) return;
        setServerStatus({
          online: res.online,
          dbConnected: res.data?.dbState === 'connected',
          checked: true
        });
      }).catch(() => {
        if (alive) setServerStatus({ online: false, dbConnected: false, checked: true });
      });

      // 2. Products
      api.getProducts().then(r => {
        if (alive && r?.data) {
          setProducts(r.data);
          setLoading(prev => ({ ...prev, products: false }));
        }
      }).catch(() => setLoading(prev => ({ ...prev, products: false })));

      // 3. Categories
      api.getCategories().then(r => {
        if (alive && r?.data) {
          setCategories(r.data);
          setLoading(prev => ({ ...prev, categories: false }));
        }
      }).catch(() => setLoading(prev => ({ ...prev, categories: false })));

      // 4. Orders
      api.getOrders().then(r => {
        if (alive && r?.data) {
          setOrders(r.data);
          setLoading(prev => ({ ...prev, orders: false }));
        }
      }).catch(() => setLoading(prev => ({ ...prev, orders: false })));

      // 5. Inquiries
      api.getInquiries().then(r => {
        if (alive && r?.data) setInquiries(r.data);
      }).catch(() => {});

      // 6. Contact Info
      api.getContactInfo().then(r => {
        if (alive && r?.data) setContactInfo(r.data);
      }).catch(() => {});

      // 7. Reviews
      api.getReviews().then(r => {
        if (alive && r?.data) setReviews(r.data);
      }).catch(() => {});
    };

    loadAll();
    return () => { alive = false; };
  }, []);

  // ─── Reviews: auto-compute rating on products when reviews change ──────────
  useEffect(() => {
    if (reviews.length === 0) return;
    setProducts(prev => {
      let changed = false;
      const updated = prev.map(p => {
        const pReviews = reviews.filter(r => r.productId === p.id || r.productId === p._id);
        const count = pReviews.length;
        const avg = count > 0
          ? Number((pReviews.reduce((s, r) => s + Number(r.rating), 0) / count).toFixed(1))
          : p.rating || 0;
        if (p.reviewsCount !== count || p.rating !== avg) {
          changed = true;
          return { ...p, rating: avg, reviewsCount: count };
        }
        return p;
      });
      return changed ? updated : prev;
    });
  }, [reviews]);

  // ─── REFRESH helpers ───────────────────────────────────────────────────────
  const refreshOrders = useCallback(async () => {
    try {
      const r = await api.getOrders();
      if (r?.data) { setOrders(r.data); return { success: true, count: r.data.length }; }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const r = await api.getCategories();
      if (r?.data) { setCategories(r.data); return { success: true, data: r.data }; }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const r = await api.getProducts();
      if (r?.data) { setProducts(r.data); return { success: true, count: r.data.length }; }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // ─── PRODUCTS CRUD ─────────────────────────────────────────────────────────

  const addProduct = async (productData) => {
    const tempId = `product_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const optimistic = {
      ...productData,
      id: tempId,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewsCount: 0,
      available: productData.available !== false,
      featured: productData.featured === true,
      images: productData.images?.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80']
    };

    setProducts(prev => [optimistic, ...prev]);
    showToast(`"${optimistic.name}" added!`, 'success');

    try {
      const res = await api.createProduct(optimistic);
      if (res?.data) {
        setProducts(prev => prev.map(p => p.id === tempId ? res.data : p));
        return res.data;
      }
    } catch (err) {
      // Rollback
      setProducts(prev => prev.filter(p => p.id !== tempId));
      showToast(`Failed to add product: ${err.message}`, 'error');
      throw err;
    }
    return optimistic;
  };

  const updateProduct = async (id, updatedData) => {
    const original = products.find(p => p.id === id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    showToast('Product updated!', 'success');

    try {
      const res = await api.updateProduct(id, updatedData);
      if (res?.data) {
        setProducts(prev => prev.map(p => p.id === id ? res.data : p));
      }
    } catch (err) {
      // Rollback
      if (original) setProducts(prev => prev.map(p => p.id === id ? original : p));
      showToast(`Update failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    const original = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(original ? `"${original.name}" deleted.` : 'Product deleted.', 'info');

    try {
      await api.deleteProduct(id);
    } catch (err) {
      // Rollback
      if (original) setProducts(prev => [original, ...prev]);
      showToast(`Delete failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const toggleFeatured = async (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setProducts(prev => prev.map(x => x.id === id ? { ...x, featured: !x.featured } : x));
    try {
      await api.updateProduct(id, { featured: !p.featured });
    } catch {
      setProducts(prev => prev.map(x => x.id === id ? { ...x, featured: p.featured } : x));
    }
  };

  const toggleAvailability = async (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setProducts(prev => prev.map(x => x.id === id ? { ...x, available: !x.available } : x));
    try {
      await api.updateProduct(id, { available: !p.available });
    } catch {
      setProducts(prev => prev.map(x => x.id === id ? { ...x, available: p.available } : x));
    }
  };

  const getProductById = (id) => products.find(p => p.id === id || p._id === id);
  const getFeaturedProducts = () => products.filter(p => p.featured);

  // ─── CATEGORIES CRUD ───────────────────────────────────────────────────────

  const addCategory = async (categoryData) => {
    const tempId = `cat_${Date.now()}`;
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const optimistic = { ...categoryData, id: tempId, slug, itemCount: 0, createdAt: new Date().toISOString() };

    setCategories(prev => [...prev, optimistic]);
    showToast(`Category "${optimistic.name}" added!`, 'success');

    try {
      const res = await api.createCategory(optimistic);
      if (res?.data) {
        setCategories(prev => prev.map(c => c.id === tempId ? res.data : c));
        return res.data;
      }
    } catch (err) {
      // Rollback
      setCategories(prev => prev.filter(c => c.id !== tempId));
      showToast(`Failed to add category: ${err.message}`, 'error');
      throw err;
    }
    return optimistic;
  };

  const updateCategory = async (id, updatedData) => {
    const original = categories.find(c => c.id === id || c.slug === id);
    const oldName = original?.name;

    const slug = updatedData.name
      ? updatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : original?.slug;

    setCategories(prev => prev.map(c =>
      (c.id === id || c.slug === id) ? { ...c, ...updatedData, slug } : c
    ));

    // If name changed, update products category field in memory
    if (updatedData.name && oldName && updatedData.name !== oldName) {
      setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: updatedData.name } : p));
    }

    showToast('Category updated!', 'success');

    try {
      const res = await api.updateCategory(id, updatedData);
      if (res?.data) {
        setCategories(prev => prev.map(c => (c.id === id || c.slug === id) ? res.data : c));
      }
    } catch (err) {
      // Rollback
      if (original) setCategories(prev => prev.map(c => (c.id === id || c.slug === id) ? original : c));
      showToast(`Update failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    const original = categories.find(c => c.id === id || c.slug === id);
    setCategories(prev => prev.filter(c => c.id !== id && c.slug !== id));
    showToast(original ? `"${original.name}" removed.` : 'Category removed.', 'info');

    try {
      await api.deleteCategory(id);
    } catch (err) {
      // Rollback
      if (original) setCategories(prev => [...prev, original]);
      showToast(`Delete failed: ${err.message}`, 'error');
      throw err;
    }
  };

  // ─── ORDERS CRUD ───────────────────────────────────────────────────────────

  const placeOrder = async (orderData) => {
    const tempId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const optimistic = {
      id: tempId,
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail || '',
      shippingAddress: orderData.shippingAddress || '',
      notes: orderData.notes || '',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: 'Pending',
      type: orderData.type || 'WhatsApp Direct Order',
      createdAt: new Date().toISOString()
    };

    // Optimistic — show immediately in Admin
    setOrders(prev => [optimistic, ...prev]);
    showToast(`Order #${tempId} placed!`, 'success');

    try {
      const res = await api.createOrder(optimistic);
      if (res?.data) {
        const confirmed = { ...optimistic, ...res.data };
        if (res.whatsapp) confirmed.whatsapp = res.whatsapp;
        setOrders(prev => prev.map(o => o.id === tempId ? confirmed : o));
        return confirmed;
      }
    } catch (err) {
      console.warn('Order save notice:', err.message);
      // Keep optimistic — user still needs WhatsApp to open
    }

    return optimistic;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} → ${newStatus}`, 'info');

    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn('Status update failed:', err.message);
    }
  };

  const deleteOrder = async (orderId) => {
    const original = orders.find(o => o.id === orderId);
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} removed.`, 'info');

    try {
      await api.deleteOrder(orderId);
    } catch (err) {
      // Rollback
      if (original) setOrders(prev => [original, ...prev]);
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // ─── INQUIRIES CRUD ────────────────────────────────────────────────────────

  const addInquiry = async (inquiryData) => {
    const optimistic = {
      ...inquiryData,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setInquiries(prev => [optimistic, ...prev]);

    try {
      const res = await api.createInquiry(optimistic);
      if (res?.data) {
        setInquiries(prev => prev.map(i => i.id === optimistic.id ? res.data : i));
        return res.data;
      }
    } catch (err) {
      console.warn('Inquiry save notice:', err.message);
    }
    return optimistic;
  };

  const deleteInquiry = async (id) => {
    const original = inquiries.find(i => i.id === id);
    setInquiries(prev => prev.filter(i => i.id !== id));
    showToast('Message removed.', 'info');

    try {
      await api.deleteInquiry(id);
    } catch (err) {
      if (original) setInquiries(prev => [original, ...prev]);
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const toggleInquiryRead = async (id) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: !i.read } : i));
    try {
      await api.toggleInquiryRead(id);
    } catch (err) {
      // Revert toggle
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: !i.read } : i));
    }
  };

  // ─── REVIEWS CRUD ──────────────────────────────────────────────────────────

  const addReview = async (productId, reviewData) => {
    const product = products.find(p => p.id === productId || p._id === productId);
    const targetId = product?.id || productId;
    const targetName = product?.name || reviewData.productName || 'Artisan Craft';

    const optimistic = {
      id: `rev_${Date.now()}`,
      _id: `rev_${Date.now()}`,
      productId: targetId,
      productName: targetName,
      customerName: reviewData.customerName?.trim() || 'Valued Patron',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment?.trim() || '',
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [optimistic, ...prev]);
    showToast('Review added!', 'success');

    try {
      const res = await api.createReview(targetId, {
        customerName: optimistic.customerName,
        rating: optimistic.rating,
        comment: optimistic.comment,
        productName: targetName
      });
      if (res?.data) {
        setReviews(prev => prev.map(r => r.id === optimistic.id ? { ...r, ...res.data } : r));
      }
    } catch (err) {
      console.warn('Review save notice:', err.message);
    }
    return optimistic;
  };

  const deleteReview = async (reviewId) => {
    const original = reviews.find(r => r.id === reviewId || r._id === reviewId);
    setReviews(prev => prev.filter(r => r.id !== reviewId && r._id !== reviewId));
    showToast('Review removed.', 'info');

    if (original) {
      try {
        await api.deleteReview(original._id || original.id);
      } catch (err) {
        if (original) setReviews(prev => [original, ...prev]);
        showToast(`Delete failed: ${err.message}`, 'error');
      }
    }
  };

  const getProductReviews = (productId) => reviews.filter(r => r.productId === productId);

  // ─── CONTACT INFO ──────────────────────────────────────────────────────────

  const updateContactInfo = async (newInfo) => {
    setContactInfo(prev => ({ ...prev, ...newInfo }));
    try {
      const res = await api.updateContactInfo(newInfo);
      if (res?.data) setContactInfo(res.data);
      showToast('Contact settings saved!', 'success');
      return res;
    } catch (err) {
      showToast('Save failed — please try again.', 'error');
      return { success: false, error: err.message };
    }
  };

  // ─── MISC ──────────────────────────────────────────────────────────────────

  const resetToDefaultData = () => {
    // No-op in DB mode — seed data lives in MongoDB
    showToast('Reset is not available in live DB mode.', 'info');
  };

  // ─── CONTEXT VALUE ─────────────────────────────────────────────────────────

  return (
    <ProductContext.Provider
      value={{
        // Data
        products,
        categories,
        orders,
        inquiries,
        reviews,
        contactInfo,

        // Status
        serverStatus,
        loading,
        toast,
        showToast,
        closeToast,

        // Products
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleAvailability,
        getProductById,
        getFeaturedProducts,
        refreshProducts,

        // Categories
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories,

        // Orders
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        refreshOrders,
        notifyOrderWhatsApp: (id) => api.notifyOrderWhatsApp(id),

        // Inquiries
        addInquiry,
        deleteInquiry,
        toggleInquiryRead,

        // Reviews
        addReview,
        deleteReview,
        getProductReviews,

        // Contact
        updateContactInfo,

        // Misc
        resetToDefaultData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
