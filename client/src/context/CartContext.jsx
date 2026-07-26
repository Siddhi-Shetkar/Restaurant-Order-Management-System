import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1, specialInstructions = '') => {
    const existItem = cartItems.find((x) => x.menuItem === item._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.menuItem === existItem.menuItem 
            ? { ...existItem, quantity: existItem.quantity + quantity, specialInstructions } 
            : x
        )
      );
    } else {
      setCartItems([...cartItems, { 
        menuItem: item._id, 
        name: item.name,
        price: item.price,
        quantity, 
        specialInstructions 
      }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.menuItem !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((x) =>
        x.menuItem === id ? { ...x, quantity } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toggleCart,
      setIsCartOpen,
      subtotal,
      taxes,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};
