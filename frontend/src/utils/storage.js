/**
 * Candy Crafts Dual-Layer Storage Utility
 * Provides persistent local fallback and syncing with live server / MongoDB API.
 */

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
 * Read from localStorage with error safety and fallback
 */
export const getFromStorage = (key, fallback = null) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

/**
 * Save data to localStorage with error safety
 */
export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
    return false;
  }
};

/**
 * Remove an item from localStorage
 */
export const removeFromStorage = (key) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`Error removing ${key} from storage:`, err);
    return false;
  }
};
