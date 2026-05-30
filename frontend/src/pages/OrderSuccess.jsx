import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-white">
      {}
      <motion.div 
        initial={{ scale: 0, borderRadius: '100%' }}
        animate={{ scale: 3, borderRadius: '0%' }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="absolute w-full h-full bg-emerald-500 z-0"
      />

      <div className="relative z-10 text-center text-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
            Order Successful
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-md mx-auto mb-12">
            Your premium selection is being prepared for shipment. Thank you for choosing LookBetter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate(userInfo?.isAdmin ? '/admin/orders' : '/orders')}
              className="px-10 py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center gap-2"
            >
              <ShoppingBag size={18} /> {userInfo?.isAdmin ? 'Manage Global Orders' : 'View My Orders'}
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="px-10 py-4 bg-emerald-600 border-2 border-white/30 text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2"
            >
              Continue Shopping <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
