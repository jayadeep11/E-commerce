import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Package, ChevronRight, Clock, CheckCircle2, AlertCircle, Star, X, Send, Loader2, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '../../components/ui/AnimatedNumber';
import { useToast } from '../../context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/orders/myorders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await api.post(`/api/products/${selectedProduct.product}/reviews`, { rating, comment });
      showToast('success', 'Review submitted successfully!');
      setIsReviewModalOpen(false);
      setComment('');
      setRating(5);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusBadge = (isPaid, isDelivered) => {
    if (isDelivered) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
          <CheckCircle2 size={12} /> Delivered
        </span>
      );
    }
    if (isPaid) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
          <Clock size={12} /> Processing
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider">
        <AlertCircle size={12} /> Pending Payment
      </span>
    );
  };

  const totalSpent = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const avgOrderValue = orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 space-y-4 border-l-4 border-l-blue-600 bg-gradient-to-br from-white to-blue-50/30"
        >
          <div className="flex items-center justify-between text-blue-600">
            <p className="text-[10px] font-black uppercase tracking-widest">Lifestyle Investment</p>
            <TrendingUp size={18} />
          </div>
          <p className="text-3xl font-black text-slate-900">₹<AnimatedNumber value={totalSpent} decimals={2} /></p>
          <p className="text-xs font-bold text-slate-400">Aggregated spend across all looks</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 space-y-4 border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30"
        >
          <div className="flex items-center justify-between text-emerald-500">
            <p className="text-[10px] font-black uppercase tracking-widest">Total Acquisitions</p>
            <Package size={18} />
          </div>
          <p className="text-3xl font-black text-slate-900"><AnimatedNumber value={orders.length} /></p>
          <p className="text-xs font-bold text-slate-400">Total number of verified orders</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 space-y-4 border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50/30"
        >
          <div className="flex items-center justify-between text-amber-500">
            <p className="text-[10px] font-black uppercase tracking-widest">Avg Order Value</p>
            <Package size={18} />
          </div>
          <p className="text-3xl font-black text-slate-900">₹<AnimatedNumber value={parseFloat(avgOrderValue)} decimals={2} /></p>
          <p className="text-xs font-bold text-slate-400">Mean expenditure per style set</p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Order History</h1>
          <p className="text-slate-500 font-medium">Manage and track your recent purchases.</p>
        </div>
      </div>

      {!userInfo ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem]">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertCircle size={32} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Please log in to view orders</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">You must be logged in to track your recent purchases.</p>
          <Link to="/shop" className="btn-primary">Return to Shop</Link>
        </div>
      ) : !Array.isArray(orders) || orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem]">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package size={32} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">When you make your first purchase, it will appear here.</p>
          <Link to="/shop" className="btn-primary">Go to Shop</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={order._id}
              onClick={() => navigate(`/order/${order._id}`)}
              className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between w-full">
                
                {/* Mobile Grid Layout (hidden on sm and up) */}
                <div className="w-full grid grid-cols-2 gap-y-4 sm:hidden">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                    <Link 
                      to={`/order/${order._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-sm text-blue-600 font-bold hover:underline"
                    >
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm text-slate-900 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    {getStatusBadge(order.isPaid, order.isDelivered)}
                  </div>
                  
                  <div className="flex justify-end items-end">
                    <div className="flex -space-x-2 overflow-hidden">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <img key={index} src={item.image} alt={item.name} className="w-8 h-8 rounded-full border-2 border-white object-cover bg-slate-100 shadow-sm" />
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout (hidden on mobile) */}
                <div className="hidden sm:flex items-center gap-6 w-1/3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                    <Link 
                      to={`/order/${order._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-sm text-blue-600 font-bold hover:underline"
                    >
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm text-slate-900 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6 w-1/3 justify-center">
                  <div>
                    {getStatusBadge(order.isPaid, order.isDelivered)}
                  </div>
                  
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <img 
                        key={index}
                        src={item.image} 
                        alt={item.name}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover bg-slate-100 shadow-sm"
                      />
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Total & Action (Visible on both, adapts styling) */}
                <div className="flex items-center justify-between w-full sm:w-1/3 sm:justify-end sm:gap-6 mt-2 sm:mt-0 border-t border-slate-100 sm:border-0 pt-4 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-black text-slate-900">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  {order.isDelivered && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openReviewModal(order.orderItems[0]); }}
                      className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all items-center gap-2 flex shadow-sm"
                    >
                      <Star size={14} /> Review
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      )}

      {}
      <AnimatePresence>
        {isReviewModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Review Item</h2>
                </div>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitReviewHandler} className="p-8 space-y-8">
                <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <img src={selectedProduct.image} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt="" />
                  <div className="flex-grow space-y-4">
                    <p className="font-black text-slate-900 text-lg leading-tight truncate max-w-[200px]">{selectedProduct.name}</p>
                    
                    {}
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className={`p-1 transition-all transform hover:scale-110 ${rating >= num ? 'text-amber-400' : 'text-slate-200'}`}
                        >
                          <Star size={24} fill={rating >= num ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Experience</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 resize-none shadow-sm"
                    placeholder="Describe the materials, fit, and feel..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button 
                  disabled={reviewLoading}
                  type="submit" 
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                >
                  {reviewLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Publish Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
