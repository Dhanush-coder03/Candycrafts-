import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_CATEGORIES } from '../data/categories';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { api } from '../utils/api';

const DEFAULT_CONTACT_INFO = {

  brandName: 'Candy Crafts',
  tagline: 'Artisan Studio & Workshop',
  address: 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter, New Delhi - 110001',
  email: 'candycraftssstudio@gmail.com',
  ownerEmail: 'candycraftssstudio@gmail.com',
  phone: '+91 98765 43210',
  hours: 'Monday – Saturday, 10:00 AM – 6:30 PM',
  instagramUrl: 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy',
  instagramHandle: '@candycrafts2026'
};

const INITIAL_INQUIRIES = [
  {
    id: 'inq_001',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98111 22334',
    subject: 'Custom Blush Wedding Bouquet Inquiry',
    message: 'Hello! I am planning a vintage garden wedding in December and would love to customize 3 bridesmaid bouquets matching dusty rose and ivory tones.',
    type: 'Custom Craft Request',
    createdAt: '2026-03-12T09:30:00.000Z',
    read: false
  },
  {
    id: 'inq_002',
    name: 'Rohan Mehra',
    email: 'rohan.m@example.com',
    phone: '+91 98222 33445',
    subject: 'Ganesha Clay Idol Delivery Time',
    message: 'Can this terracotta idol be delivered to Bangalore within 4 days? It is a housewarming gift for my parents.',
    type: 'Store Inquiry',
    createdAt: '2026-03-14T14:15:00.000Z',
    read: true
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-1082',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98401 23456',
    customerEmail: 'priya.sundaram@gmail.com',
    shippingAddress: 'Flat 302, Lotus Enclave, 12th Cross Street, Anna Nagar, Chennai - 600040',
    notes: 'Please wrap with lavender ribbon, it is an anniversary gift!',
    items: [
      {
        id: 'candy-p01',
        name: 'Pastel Blush Botanical Bouquet',
        price: 2499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
        category: 'Floral Bouquets'
      }
    ],
    totalAmount: 2499,
    status: 'Pending',
    createdAt: '2026-03-14T10:20:00.000Z'
  },
  {
    id: 'ORD-2026-1081',
    customerName: 'Karthik Raja',
    customerPhone: '+91 94441 55667',
    customerEmail: 'karthik.raja92@gmail.com',
    shippingAddress: 'Plot 45, Green Meadows, Peelamedu, Coimbatore - 641004',
    notes: 'Call before delivery.',
    items: [
      {
        id: 'candy-p03',
        name: 'Artisanal Clay Ganesha Idol with Brass Accent',
        price: 1899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80',
        category: 'Decorative Idols'
      }
    ],
    totalAmount: 1899,
    status: 'Delivered',
    createdAt: '2026-03-12T16:45:00.000Z'
  }
];

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  // Load products from localStorage or fallback to INITIAL_PRODUCTS
  const [products, setProducts] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.PRODUCTS, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  });

  // Load categories from localStorage or INITIAL_CATEGORIES
  const [categories, setCategories] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.CATEGORIES, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  });

  // Load Contact Information (Editable by Admin)
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.CONTACT_INFO, null);
    if (saved) {
      const updated = {
        ...DEFAULT_CONTACT_INFO,
        ...saved,
        email: (!saved.email || saved.email === 'concierge@candycrafts.com') ? 'candycraftssstudio@gmail.com' : saved.email,
        ownerEmail: (!saved.ownerEmail || saved.ownerEmail === 'candycrafts2026@gmail.com' || saved.ownerEmail === 'concierge@candycrafts.com')
          ? 'candycraftssstudio@gmail.com'
          : saved.ownerEmail
      };
      saveToStorage(STORAGE_KEYS.CONTACT_INFO, updated);
      return updated;
    }
    saveToStorage(STORAGE_KEYS.CONTACT_INFO, DEFAULT_CONTACT_INFO);
    return DEFAULT_CONTACT_INFO;
  });

  // Load Customer Inquiries & Messages
  const [inquiries, setInquiries] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.INQUIRIES, null);
    if (saved && Array.isArray(saved)) return saved;
    saveToStorage(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    return INITIAL_INQUIRIES;
  });

  // Load Customer Orders
  const [orders, setOrders] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.ORDERS, null);
    if (saved && Array.isArray(saved)) return saved;
    saveToStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return INITIAL_ORDERS;
  });

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Backend API and Database Connection Status
  const [serverStatus, setServerStatus] = useState({ online: false, dbConnected: false, checked: false });

  // Probe backend server & sync from MongoDB when online
  useEffect(() => {
    let isMounted = true;

    api.checkHealth()
      .then(res => {
        if (!isMounted) return;
        const isOnline = res.online;
        const dbConnected = res.data?.dbState === 'connected';
        setServerStatus({ online: isOnline, dbConnected, checked: true });

        if (isOnline && dbConnected) {
          // Sync live data from MongoDB
          api.getProducts().then(r => {
            if (r?.data && r.data.length > 0) setProducts(r.data);
          }).catch(() => {});

          api.getCategories().then(r => {
            if (r?.data && r.data.length > 0) setCategories(r.data);
          }).catch(() => {});

          api.getOrders().then(r => {
            if (r?.data && r.data.length > 0) setOrders(r.data);
          }).catch(() => {});

          api.getInquiries().then(r => {
            if (r?.data && r.data.length > 0) setInquiries(r.data);
          }).catch(() => {});

          api.getContactInfo().then(r => {
            if (r?.data) setContactInfo(r.data);
          }).catch(() => {});
        }
      })
      .catch(() => {
        if (isMounted) setServerStatus({ online: false, dbConnected: false, checked: true });
      });

    return () => { isMounted = false; };
  }, []);

  // Sync products back to localStorage on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  // Sync categories back to localStorage on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  // Sync contactInfo to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONTACT_INFO, contactInfo);
  }, [contactInfo]);

  // Sync inquiries to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INQUIRIES, inquiries);
  }, [inquiries]);

  // Sync orders to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === STORAGE_KEYS.CONTACT_INFO && e.newValue) {
        try {
          setContactInfo(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === STORAGE_KEYS.INQUIRIES && e.newValue) {
        try {
          setInquiries(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // CRUD Operations on Products
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `product_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      available: productData.available !== undefined ? productData.available : true,
      featured: productData.featured !== undefined ? productData.featured : false,
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ["https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"]
    };

    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" added successfully!`, 'success');

    // Async sync to MongoDB
    api.createProduct(newProduct).catch(err => {
      console.warn('Backend sync notice (Product):', err.message);
    });

    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedData, updatedAt: new Date().toISOString() } : item))
    );
    showToast('Product updated successfully!', 'success');

    // Async sync to MongoDB
    api.updateProduct(id, updatedData).catch(err => {
      console.warn('Backend sync notice (Update Product):', err.message);
    });
  };

  const deleteProduct = (id) => {
    const toDelete = products.find(p => p.id === id);
    setProducts(prev => prev.filter(item => item.id !== id));
    showToast(toDelete ? `"${toDelete.name}" deleted.` : 'Product removed.', 'info');

    // Async sync to MongoDB
    api.deleteProduct(id).catch(err => {
      console.warn('Backend sync notice (Delete Product):', err.message);
    });
  };

  const toggleFeatured = (id) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, featured: !item.featured };
          api.updateProduct(id, { featured: updated.featured }).catch(() => {});
          return updated;
        }
        return item;
      })
    );
  };

  const toggleAvailability = (id) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, available: !item.available };
          api.updateProduct(id, { available: updated.available }).catch(() => {});
          return updated;
        }
        return item;
      })
    );
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setContactInfo(DEFAULT_CONTACT_INFO);
    setInquiries(INITIAL_INQUIRIES);
    saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    saveToStorage(STORAGE_KEYS.CONTACT_INFO, DEFAULT_CONTACT_INFO);
    saveToStorage(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    showToast('Store reset to initial curated handmade catalog!', 'info');
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  const getFeaturedProducts = () => {
    return products.filter(p => p.featured);
  };

  // Categories
  const addCategory = (categoryData) => {
    const newCat = {
      ...categoryData,
      id: `cat_${Date.now()}`,
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      itemCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added!`, 'success');

    api.createCategory(newCat).catch(err => {
      console.warn('Backend sync notice (Category):', err.message);
    });
  };

  // Contact Info Management (Admin can edit, immediately updates public store)
  const updateContactInfo = (newInfo) => {
    setContactInfo(prev => ({ ...prev, ...newInfo }));
    showToast('Contact information updated across the store!', 'success');

    api.updateContactInfo(newInfo).catch(err => {
      console.warn('Backend sync notice (Contact):', err.message);
    });
  };

  // Customer Inquiries & Messages
  const addInquiry = (inquiryData) => {
    const newInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setInquiries(prev => [newInquiry, ...prev]);

    // Async sync to MongoDB & triggers Nodemailer
    api.createInquiry(newInquiry).catch(err => {
      console.warn('Backend sync notice (Inquiry):', err.message);
    });

    return newInquiry;
  };

  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    showToast('Message removed from records.', 'info');

    api.deleteInquiry(id).catch(err => {
      console.warn('Backend sync notice (Delete Inquiry):', err.message);
    });
  };

  const toggleInquiryRead = (id) => {
    setInquiries(prev =>
      prev.map(inq => (inq.id === id ? { ...inq, read: !inq.read } : inq))
    );

    api.toggleInquiryRead(id).catch(err => {
      console.warn('Backend sync notice (Toggle Read):', err.message);
    });
  };

  // Orders Management
  const placeOrder = (orderData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `ORD-2026-${randomSuffix}`,
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail || '',
      shippingAddress: orderData.shippingAddress || '',
      notes: orderData.notes || '',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: 'Pending',
      type: orderData.type || 'Order Query',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    showToast(`Order #${newOrder.id} received! Check Admin Panel.`, 'success');

    // Async sync to MongoDB & triggers Nodemailer email dispatch
    api.createOrder(newOrder).catch(err => {
      console.warn('Backend sync notice (Order):', err.message);
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    showToast(`Order #${orderId} marked as ${newStatus}`, 'info');

    api.updateOrderStatus(orderId, newStatus).catch(err => {
      console.warn('Backend sync notice (Update Status):', err.message);
    });
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    showToast(`Order #${orderId} removed from records.`, 'info');

    api.deleteOrder(orderId).catch(err => {
      console.warn('Backend sync notice (Delete Order):', err.message);
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        contactInfo,
        inquiries,
        orders,
        serverStatus,
        toast,
        showToast,
        closeToast,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleAvailability,
        resetToDefaultData,
        getProductById,
        getFeaturedProducts,
        addCategory,
        updateContactInfo,
        addInquiry,
        deleteInquiry,
        toggleInquiryRead,
        placeOrder,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
