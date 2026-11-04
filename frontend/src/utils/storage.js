/**
 * Storage disabled by requirement — Pure DB and in-memory operation only.
 * No caching or local persistence.
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

export const getFromStorage = (_key, fallback = null) => fallback;
export const saveToStorage = (_key, _data) => true;
export const removeFromStorage = (_key) => true;
