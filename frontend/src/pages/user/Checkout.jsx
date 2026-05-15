import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Truck, Lock, AlertCircle } from 'lucide-react';

// Use environment variable for publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
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

    // Create Order and then PaymentIntent
    const initializeCheckout = async () => {
      try {
        // 1. Create the order in "Pending" status
        const { data: createdOrder } = await api.post('/api/orders', {
          ...orderData,
          isPaid: false, // Explicitly set to false
        });

        // 2. Create PaymentIntent with the new orderId
        const { data: paymentData } = await api.post('/api/payments/create-payment-intent', {
          amount: orderData.totalPrice,
          orderId: createdOrder._id,
        });

        setClientSecret(paymentData.clientSecret);
      } catch (err) {
        console.error('Checkout initialization failed:', err);
        const errorMsg = err.response?.data?.message || "Could not initialize checkout. Please check your Stripe keys.";
        setError(errorMsg);
      }
    };

    initializeCheckout();
  }, [orderData, userInfo, navigate]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-4 sm:px-6">
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
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
              <p className="text-sm sm:text-base text-slate-500">Complete your purchase by providing your payment details.</p>
            </div>

            <div className="glass-card p-5 sm:p-8 bg-white shadow-xl shadow-slate-200/50">
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
              ) : clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
                </Elements>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-center">Initializing Secure Gateways...</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-40 grayscale pointer-events-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 sm:h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 sm:h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 sm:h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 sm:h-6" />
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-5 sm:p-8 bg-slate-900 text-white overflow-hidden relative">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
              
              <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                <ShoppingBag size={20} className="text-blue-400" />
                Order Review
              </h2>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {orderData.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-slate-400 text-xs">Qty: {item.qty} × ${item.price}</p>
                    </div>
                    <p className="font-bold text-sm whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${orderData.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest">Calculated Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-800 mt-4">
                  <span>Total Due</span>
                  <span className="text-blue-400">${orderData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 sm:p-6 border-l-4 border-l-blue-600 bg-white relative z-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping To</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{orderData.shippingAddress.address}</p>
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
