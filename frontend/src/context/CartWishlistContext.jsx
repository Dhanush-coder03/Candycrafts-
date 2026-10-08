import React, { createContext, useContext, useState } from 'react';

const CartWishlistContext = createContext(null);

export const CartWishlistProvider = ({ children }) => {
  // Modal states for Bespoke / Custom Orders and Quick View
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Inert fallbacks for removed cart & wishlist
  const cart = [];
  const wishlist = [];
  const cartCount = 0;
  const cartSubtotal = 0;
  const isCartOpen = false;
  const isWishlistOpen = false;
  const addToCart = () => {};
  const updateQuantity = () => {};
  const removeFromCart = () => {};
  const clearCart = () => {};
  const toggleWishlist = () => {};
  const isInWishlist = () => false;
  const setIsCartOpen = () => {};
  const setIsWishlistOpen = () => {};

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCustomOrderOpen,
        setIsCustomOrderOpen,
        quickViewProduct,
        setQuickViewProduct
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
