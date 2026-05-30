import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, CreditCard } from 'lucide-react';

const RazorpayCheckout = ({ orderData }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create Order in Backend
      const { data: createdOrder } = await api.post('/api/orders', {
        ...orderData,
        isPaid: false,
      });

      // 2. Create Razorpay Order
      const { data: razorpayOrder } = await api.post('/api/razorpay/order', {
        amount: orderData.totalPrice,
        orderId: createdOrder._id,
      });

      // 3. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "KORE E-commerce",
        description: "Payment for Order #" + createdOrder._id,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            await api.post('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });

            clearCart();
            navigate('/order-success');
          } catch (error) {
            alert("Payment verification failed: " + error.message);
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      const message = error.response?.data?.message || error.message || "Could not initialize payment.";
      alert(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-950 rounded-full flex items-center justify-center text-white shrink-0">
          <CreditCard size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-0.5 sm:mb-1">Pay with Razorpay</h3>
          <p className="text-[9px] sm:text-xs text-slate-500 leading-relaxed">
            Supports UPI (Google Pay, PhonePe), NetBanking, and all Indian Debit/Credit cards.
          </p>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="btn-primary w-full py-4 flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
            <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs">Initializing...</span>
          </>
        ) : (
          <>
            <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
            <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs">Proceed to Payment</span>
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed">
        Secure 256-bit SSL encrypted payment powered by Razorpay.
      </p>
    </div>
  );
};

export default RazorpayCheckout;
