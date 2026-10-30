/**
 * Candy Crafts Backend API Client
 * Automatically connects to Node.js / MongoDB backend,
 * with graceful fallback to client-side storage when offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to make API requests with timeout
 */
async function apiRequest(endpoint, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  // Check backend server & database status
  checkHealth: async () => {
    try {
      const data = await apiRequest('/health', { method: 'GET' }, 2000);
      return { online: true, data };
    } catch {
      return { online: false, data: null };
    }
  },

  // Products
  getProducts: async () => {
    return apiRequest('/products', { method: 'GET' });
  },
  getProductById: async (id) => {
    return apiRequest(`/products/${id}`, { method: 'GET' });
  },
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, { method: 'DELETE' });
  },

  // Categories
  getCategories: async () => {
    return apiRequest('/categories', { method: 'GET' });
  },
  createCategory: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },
  deleteCategory: async (id) => {
    return apiRequest(`/categories/${id}`, { method: 'DELETE' });
  },

  // Orders
  getOrders: async () => {
    return apiRequest('/orders', { method: 'GET' });
  },
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },
  updateOrderStatus: async (id, status) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },
  deleteOrder: async (id) => {
    return apiRequest(`/orders/${id}`, { method: 'DELETE' });
  },
  notifyOrderWhatsApp: async (id) => {
    return apiRequest(`/orders/${id}/notify-whatsapp`, { method: 'POST' });
  },

  // Inquiries
  getInquiries: async () => {
    return apiRequest('/inquiries', { method: 'GET' });
  },
  createInquiry: async (inquiryData) => {
    return apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    });
  },
  toggleInquiryRead: async (id) => {
    return apiRequest(`/inquiries/${id}/read`, { method: 'PATCH' });
  },
  deleteInquiry: async (id) => {
    return apiRequest(`/inquiries/${id}`, { method: 'DELETE' });
  },

  // Contact Info
  getContactInfo: async () => {
    return apiRequest('/contact', { method: 'GET' });
  },
  updateContactInfo: async (contactData) => {
    return apiRequest('/contact', {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  },
  testEmailConfig: async (emailData) => {
    return apiRequest('/contact/test-email', {
      method: 'POST',
      body: JSON.stringify(emailData)
    }, 15000);
  },
  testWhatsAppConfig: async (whatsappData) => {
    return apiRequest('/contact/test-whatsapp', {
      method: 'POST',
      body: JSON.stringify(whatsappData)
    }, 15000);
  },

  // Customer Reviews
  getReviews: async () => {
    return apiRequest('/reviews', { method: 'GET' });
  },
  getProductReviews: async (productId) => {
    return apiRequest(`/products/${productId}/reviews`, { method: 'GET' });
  },
  createReview: async (productId, reviewData) => {
    return apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },
  deleteReview: async (id) => {
    return apiRequest(`/reviews/${id}`, { method: 'DELETE' });
  }
};
