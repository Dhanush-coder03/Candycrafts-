/**
 * Safe localStorage wrapper with error boundaries and fallback support
 */

export const STORAGE_KEYS = {
  PRODUCTS: 'craft_products',
  CATEGORIES: 'craft_categories',
  CART: 'craft_cart',
  WISHLIST: 'craft_wishlist',
  INQUIRIES: 'craft_inquiries',
  CONTACT_INFO: 'craft_contact_info',
  ORDERS: 'craft_orders'
};

export const getFromStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      alert('Local storage is full! Please delete some products or use smaller images.');
    }
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};
