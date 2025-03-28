import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const items = cart.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(items);
    
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(price);
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        toast.success(`Increased ${product.name} quantity`);
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        toast.success(`Added ${product.name} to cart`);
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart(prevCart => {
      const removedItem = prevCart.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`Removed ${removedItem.name} from cart`);
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
