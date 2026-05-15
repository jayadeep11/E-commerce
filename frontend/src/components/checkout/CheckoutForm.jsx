import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const CheckoutForm = ({ clientSecret, orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL for success
        return_url: `${window.location.origin}/order-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful! 
      // The webhook will handle marking the order as paid in the database.
      // We can just clear the cart and navigate.
      clearCart();
      navigate('/order-success');
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <CreditCard size={18} />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Payment Details</span>
        </div>
        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs sm:text-sm"
        >
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{message}</p>
        </motion.div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="btn-primary w-full py-3 sm:py-4 flex items-center justify-center gap-3 relative"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm sm:text-base">Processing...</span>
          </>
        ) : (
          <>
            <ShieldCheck size={20} />
            <span className="text-sm sm:text-base">Pay Now</span>
          </>
        )}
      </button>

      <p className="text-center text-[9px] sm:text-[10px] text-slate-400 font-medium leading-relaxed">
        Your payment is secured with 256-bit encryption. <br />
        By clicking "Pay Now", you agree to our Terms of Service.
      </p>
    </form>
  );
};

export default CheckoutForm;
