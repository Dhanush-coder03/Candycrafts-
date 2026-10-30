/**
 * In-memory storage wrapper (No localStorage / No caching as requested)
 * All persistence is handled directly via live server / MongoDB API.
 */

// Purge any stale cache or localStorage keys from previous sessions
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear();
  }
} catch (e) {
  // safe fallback
}

export const STORAGE_KEYS = {
  PRODUCTS: 'craft_products',
  CATEGORIES: 'craft_categories',
  CART: 'craft_cart',
  WISHLIST: 'craft_wishlist',
  INQUIRIES: 'craft_inquiries',
  CONTACT_INFO: 'craft_contact_info',
  ORDERS: 'craft_orders',
  REVIEWS: 'craft_reviews'
};

/**
 * Does NOT read from localStorage to avoid caching stale data.
 * Always returns fallback so state is loaded fresh from catalog or backend API.
 */
export const getFromStorage = (_key, fallback = null) => {
  return fallback;
};

/**
 * Does NOT store in localStorage or browser cache.
 */
export const saveToStorage = (_key, _data) => {
  return true;
};

export const removeFromStorage = (_key) => {
  return true;
};
