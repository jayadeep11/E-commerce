import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Package, Truck, CreditCard, Calendar, Hash, CheckCircle2, Clock, AlertCircle, ShoppingCart, Star, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetails = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      fetchOrder();
    } else {
      setLoading(false);
      setError('Please login to view order details.');
    }
  }, [id, userInfo]);

  const openReviewModal = (item) => {
    setSelectedProduct(item);
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

  const deliverHandler = async () => {
    try {
      await api.put(`/api/orders/${order._id}/deliver`, {});
      
      const { data } = await api.get(`/api/orders/${order._id}`);
      setOrder(data);
    } catch (error) {
      alert('Error updating delivery status');
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Opening Order Vault...</p>
    </div>
  );

  if (error) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
        <AlertCircle size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 font-medium max-w-sm">{error}</p>
      </div>
      <Link to="/orders" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all">
        Return to History
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {}
      <div className="mb-12">
        <Link to="/orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group font-bold text-sm">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to History
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Hash size={24} className="text-blue-600" />
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Details</h1>
            </div>
            <p className="text-slate-500 font-mono font-bold text-sm">ID: {order?._id?.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-600">Placed on {new Date(order?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-8">
          {}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Package size={22} className="text-blue-600" /> Fulfillment Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border ${order?.isPaid ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</span>
                  {order?.isPaid ? <CheckCircle2 size={16} className="text-blue-600" /> : <Clock size={16} className="text-slate-400" />}
                </div>
                <p className={`font-black ${order?.isPaid ? 'text-blue-900' : 'text-slate-400'}`}>
                  {order?.isPaid ? `Paid on ${new Date(order?.paidAt).toLocaleDateString()}` : 'Pending Payment'}
                </p>
              </div>
              <div className={`p-6 rounded-3xl border ${order?.isDelivered ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</span>
                  {order?.isDelivered ? <Truck size={16} className="text-emerald-600" /> : <Clock size={16} className="text-slate-400" />}
                </div>
                <p className={`font-black ${order?.isDelivered ? 'text-emerald-900' : 'text-slate-400'}`}>
                  {order?.isDelivered ? `Delivered on ${new Date(order?.deliveredAt).toLocaleDateString()}` : 'In Processing'}
                </p>
              </div>
            </div>
            {userInfo?.isAdmin && !order?.isDelivered && order?.isPaid && (
              <button 
                onClick={deliverHandler}
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
              >
                <Truck size={18} /> Mark as Delivered
              </button>
            )}
          </div>

          {}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <ShoppingCart size={22} className="text-blue-600" /> Order Items
            </h2>
            <div className="space-y-6">
              {order?.orderItems?.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-6 p-6 hover:bg-slate-50 rounded-3xl transition-colors group border border-transparent hover:border-slate-100">
                  <img src={item?.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                  <div className="flex-grow min-w-0">
                    <p className="font-black text-slate-900 mb-1 truncate text-lg">{item?.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Qty: {item?.qty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 min-w-[120px]">
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-lg">₹{(item?.qty * item?.price).toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">₹{item?.price} each</p>
                    </div>
                    {order?.isDelivered && (
                      <button 
                        onClick={() => openReviewModal(item)}
                        className="px-5 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-amber-100 flex items-center gap-1.5"
                      >
                        <Star size={12} fill="currentColor" /> Review Item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="space-y-8">
          {}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/10">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <Truck size={22} className="text-blue-400" /> Shipping
            </h2>
            <div className="space-y-1 font-medium text-slate-400">
              <p className="text-white font-bold text-lg mb-2">{order?.user?.name || 'Customer'}</p>
              <p>{order?.shippingAddress?.address}</p>
              <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}</p>
              <p>{order?.shippingAddress?.country}</p>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <CreditCard size={22} className="text-blue-600" /> Payment
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="font-black text-slate-900">{order?.paymentMethod}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Gateway</p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span>₹{order?.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Shipping</span>
                <span>₹{order?.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Tax</span>
                <span>₹{order?.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">Total</span>
                <span className="text-3xl font-black text-blue-600">₹{order?.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default OrderDetails;
