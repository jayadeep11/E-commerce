import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Package, ChevronRight, Clock, CheckCircle2, AlertCircle, Star, X, Send, Loader2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  
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
      alert('Review submitted successfully!');
      setIsReviewModalOpen(false);
      setComment('');
      setRating(5);
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
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
      <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
          <p className="text-3xl font-black text-slate-900">₹{totalSpent.toFixed(2)}</p>
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
          <p className="text-3xl font-black text-slate-900">{orders.length}</p>
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
          <p className="text-3xl font-black text-slate-900">₹{avgOrderValue}</p>
          <p className="text-xs font-bold text-slate-400">Mean expenditure per style set</p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Order History</h1>
          <p className="text-slate-500 font-medium">Manage and track your recent purchases.</p>
        </div>
      </div>

      {!Array.isArray(orders) || orders.length === 0 ? (
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
              className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:border-blue-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                <div className="space-y-2 lg:w-40">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                  <Link 
                    to={`/order/${order._id}`}
                    className="font-mono text-sm text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                </div>

                <div className="space-y-2 lg:w-32">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="text-sm text-slate-900 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="lg:w-32">
                  {getStatusBadge(order.isPaid, order.isDelivered)}
                </div>

                {}
                <div className="flex -space-x-3 overflow-hidden">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <img 
                      key={index}
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm bg-slate-100"
                    />
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>

                {}
                <div className="flex-grow hidden lg:block"></div>

                <div className="text-right space-y-1 pr-8 border-r border-slate-50 mr-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-xl font-black text-slate-900">₹{order.totalPrice.toFixed(2)}</p>
                </div>

                {}
                <div className="flex items-center justify-end">
                  {order.isDelivered && (
                    <button 
                      onClick={() => openReviewModal(order.orderItems[0])}
                      className="px-8 py-4 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-amber-100 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Star size={14} fill="currentColor" /> Review Items
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
