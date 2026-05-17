import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, cartTotal, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  
  const [selectedAddress, setSelectedAddress] = useState(
    userInfo?.addresses?.find(a => a.isDefault) || userInfo?.addresses?.[0] || null
  );

  const checkoutHandler = async () => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
      return;
    }

    if (!selectedAddress) {
      alert('Please add a shipping address in your profile first');
      navigate('/profile');
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: Number(item.price),
          product: item._id
        })),
        shippingAddress: {
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        },
        paymentMethod: 'Razorpay',
        itemsPrice: Number(cartTotal),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: Number(cartTotal),
      };

      navigate('/checkout', { state: { orderData } });
    } catch (error) {
      alert('Error preparing checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center text-slate-900 mx-auto mb-8">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-10">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <motion.div 
              layout
              key={item._id} 
              className="glass-card p-6 flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <Link to={`/product/${item._id}`} className="text-lg font-bold text-slate-900 hover:text-black transition-colors">
                  {item.name}
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                  {item.countInStock === 0 ? (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-md w-fit">SOLD OUT</span>
                  ) : item.qty > item.countInStock ? (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-md w-fit italic">Only {item.countInStock} available</span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                <button 
                  onClick={() => addToCart(item, -1)}
                  disabled={item.qty <= 1}
                  className="px-3 py-1 hover:bg-slate-200 transition-colors disabled:opacity-30"
                ><Minus size={14} /></button>
                <span className="px-4 font-bold text-sm">{item.qty}</span>
                <button 
                  onClick={() => addToCart(item, 1)}
                  disabled={item.qty >= item.countInStock}
                  title={item.qty >= item.countInStock ? "Maximum stock reached" : "Increase quantity"}
                  className="px-3 py-1 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                ><Plus size={14} /></button>
              </div>

              <div className="text-lg font-bold text-slate-900 w-24 text-center sm:text-right">
                ₹{(item.price * item.qty).toFixed(2)}
              </div>

              <button 
                onClick={() => removeFromCart(item._id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            {}
            {userInfo && (
              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Destination</p>
                  <Link to="/profile" className="text-[10px] font-black text-slate-900 hover:underline">Manage</Link>
                </div>
                
                {!userInfo.addresses || userInfo.addresses.length === 0 ? (
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-slate-400 hover:text-slate-900 transition-all"
                  >
                    + Add Shipping Address
                  </button>
                ) : (
                  <>
                    <div className="relative w-full">
                      <select
                        value={selectedAddress?._id || ''}
                        onChange={(e) => {
                          const addr = userInfo.addresses.find(a => a._id === e.target.value);
                          setSelectedAddress(addr || null);
                        }}
                        className="w-full appearance-none border border-slate-200 rounded-2xl py-3 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors bg-white font-bold text-slate-800 cursor-pointer"
                      >
                        {userInfo.addresses.map(addr => (
                          <option key={addr._id} value={addr._id}>
                            {addr.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {selectedAddress && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase mb-1">Delivering To:</p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{selectedAddress.address}, {selectedAddress.city}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <button 
              onClick={checkoutHandler}
              disabled={cartItems.some(item => item.countInStock === 0 || item.qty > item.countInStock)}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {cartItems.some(item => item.countInStock === 0 || item.qty > item.countInStock) ? 'Items Unavailable' : 'Proceed to Checkout'} <ArrowRight size={20} />
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
              Secure checkout powered by LookBetter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
