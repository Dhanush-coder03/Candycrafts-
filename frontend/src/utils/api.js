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
      headers: {
        'Content-Type': 'application/json',
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
  }
};
