import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const isInitialMount = useRef(true);

  
  useEffect(() => {
    const fetchCart = async () => {
      if (userInfo) {
        try {
          const { data } = await api.get('/api/cart');
          
          
          if (data.cartItems) {
            const formattedItems = data.cartItems.map(item => ({
              ...item.product,
              qty: item.qty
            }));
            setCartItems(formattedItems);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        setCartItems([]);
      }
    };

    fetchCart();
  }, [userInfo]);

  
  useEffect(() => {
    const syncCart = async () => {
      
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      if (userInfo) {
        try {
          
          const dbItems = cartItems.map(item => ({
            product: item._id,
            qty: item.qty
          }));

          await api.post('/api/cart', { cartItems: dbItems });
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    
    const timeoutId = setTimeout(syncCart, 500);
    return () => clearTimeout(timeoutId);
  }, [cartItems, userInfo]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      const newQty = existItem.qty + qty;
      
      if (newQty > product.countInStock) {
        alert(`Sorry, only ${product.countInStock} units available in stock.`);
        return;
      }
      if (newQty < 1) return;

      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...existItem, qty: newQty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
