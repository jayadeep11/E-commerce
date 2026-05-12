import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const isInitialMount = useRef(true);

  // 1. Fetch cart from DB on login
  useEffect(() => {
    const fetchCart = async () => {
      if (userInfo) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.get('http://localhost:5000/api/cart', config);
          
          // Map DB structure to frontend structure
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
        // If logged out, you could optionally load from localStorage
        setCartItems([]);
      }
    };

    fetchCart();
  }, [userInfo]);

  // 2. Sync cart to DB on changes
  useEffect(() => {
    const syncCart = async () => {
      // Don't sync on the very first mount (it would overwrite DB with empty array)
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      if (userInfo) {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          
          // Map frontend structure to DB structure { product: id, qty: num }
          const dbItems = cartItems.map(item => ({
            product: item._id,
            qty: item.qty
          }));

          await axios.post('http://localhost:5000/api/cart', { cartItems: dbItems }, config);
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    // Small delay to debounce rapid clicks
    const timeoutId = setTimeout(syncCart, 500);
    return () => clearTimeout(timeoutId);
  }, [cartItems, userInfo]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...existItem, qty: existItem.qty + qty } : x
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
