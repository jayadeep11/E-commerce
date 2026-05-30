import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import RazorpayCheckout from '../../components/checkout/RazorpayCheckout';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Truck, Lock, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartTotal } = useCart();
  const { userInfo } = useAuth();
  
  // Get order data from location state (passed from Cart)
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData || !userInfo) {
      navigate('/cart');
      return;
    }
  }, [orderData, userInfo, navigate]);

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-12 px-3 xs:px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <Link to="/cart" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 sm:mb-8 group w-fit">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Back to Cart</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Payment Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 sm:space-y-8 min-w-0"
          >
            <div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">Secure Checkout</h1>
              <p className="text-[10px] sm:text-base text-slate-500">Complete purchase with Razorpay.</p>
            </div>

            <div className="glass-card p-2 xs:p-5 sm:p-8 bg-white shadow-xl shadow-slate-200/50 w-full max-w-full">
              {error ? (
                <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Checkout Error</h3>
                  <p className="text-sm opacity-80 mb-4">{error}</p>
                  <button onClick={() => window.location.reload()} className="text-xs font-black uppercase tracking-widest hover:underline">
                    Try Again
                  </button>
                </div>
              ) : (
                <RazorpayCheckout orderData={orderData} />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-40 grayscale pointer-events-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 sm:h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 sm:h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 sm:h-5" />
              <span className="font-black text-slate-900 italic tracking-tighter text-lg">Razorpay</span>
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 min-w-0"
          >
            <div className="glass-card p-2 xs:p-5 sm:p-8 bg-slate-900 text-white overflow-hidden relative border-l-4 border-l-blue-600 w-full max-w-full">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
              
              <h2 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 relative z-10">
                <ShoppingBag size={18} className="text-blue-400" />
                Order Review
              </h2>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {orderData.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 sm:gap-4 items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0 pr-2">
                      <p className="font-bold text-[11px] sm:text-sm truncate">{item.name}</p>
                      <p className="text-slate-400 text-[9px] sm:text-xs">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <p className="font-bold text-xs sm:text-sm whitespace-nowrap ml-auto flex-shrink-0">₹{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{orderData.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest">Calculated Free</span>
                </div>
                <div className="flex justify-between text-sm sm:text-xl font-bold pt-4 border-t border-slate-800 mt-4">
                  <span>Total Due</span>
                  <span className="text-blue-400 text-base sm:text-2xl">₹{orderData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-2 xs:p-5 sm:p-8 border-l-4 border-l-blue-600 bg-white relative z-10 w-full max-w-full">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping To</p>
                  <p className="text-[11px] sm:text-sm font-bold text-slate-900 leading-tight">{orderData.shippingAddress.address}</p>
                  <p className="text-xs text-slate-500 mt-1">{orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 text-slate-400 relative z-10">
              <Lock size={14} className="flex-shrink-0" />
              <p className="text-[10px] font-medium leading-relaxed">
                All transactions are secure and encrypted. Card information is never stored on our servers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
