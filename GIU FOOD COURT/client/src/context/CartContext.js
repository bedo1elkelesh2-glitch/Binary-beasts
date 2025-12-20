import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1, extras = []) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        cartItem => 
          cartItem.itemId === item._id && 
          JSON.stringify(cartItem.extras) === JSON.stringify(extras)
      );

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.itemId === item._id && 
          JSON.stringify(cartItem.extras) === JSON.stringify(extras)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, {
          itemId: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          shopId: item.shopId,
          shopName: item.shopName,
          quantity,
          extras,
          pickupTime: item.pickupTime
        }];
      }
    });
  };

  const removeFromCart = (itemId, extras = []) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => 
          !(item.itemId === itemId && 
            JSON.stringify(item.extras) === JSON.stringify(extras))
      )
    );
  };

  const updateQuantity = (itemId, extras = [], newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, extras);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.itemId === itemId && 
        JSON.stringify(item.extras) === JSON.stringify(extras)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const extrasTotal = item.extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
      return total + ((item.price + extrasTotal) * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
