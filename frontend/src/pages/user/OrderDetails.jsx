import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Package, Truck, CreditCard, Calendar, Hash, CheckCircle2, Clock, AlertCircle, ShoppingCart, Star, X, Send, Loader2, Shirt, ShoppingBag, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const OrderDetails = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  
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

  const deliverHandler = async () => {
    try {
      await api.put(`/api/orders/${order._id}/deliver`, {});
      
      const { data } = await api.get(`/api/orders/${order._id}`);
      setOrder(data);
      showToast('success', 'Order marked as delivered successfully');
    } catch (error) {
      showToast('error', 'Error updating delivery status');
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2"></div>
            <div className="h-4 w-32 bg-slate-100 rounded-md"></div>
          </div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Fulfillment Status Skeleton */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8">
            <div className="h-6 w-40 bg-slate-200 rounded-md mb-6"></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="h-24 bg-slate-100 rounded-2xl"></div>
              <div className="h-24 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
          
          {/* Order Items Skeleton */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8">
            <div className="h-6 w-40 bg-slate-200 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
                    <div className="h-3 w-1/4 bg-slate-100 rounded-md"></div>
                  </div>
                  <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 space-y-4">
            <div className="h-6 w-32 bg-slate-800 rounded-md mb-2"></div>
            <div className="h-4 w-full bg-slate-800 rounded-md"></div>
            <div className="h-4 w-3/4 bg-slate-800 rounded-md"></div>
            <div className="h-4 w-1/2 bg-slate-800 rounded-md"></div>
          </div>
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!userInfo) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shadow-sm">
        <AlertCircle size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Please log in to view order details</h2>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">You must be logged in to track and manage this order.</p>
      </div>
      <Link to="/shop" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
        Return to Shop
      </Link>
    </div>
  );

  if (error) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
        <AlertCircle size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">{error}</p>
      </div>
      <Link to="/orders" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
        Return to History
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <Link to="/orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 sm:mb-8 group font-bold text-sm">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to History
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Hash size={20} className="text-blue-600 sm:w-6 sm:h-6" />
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Order Details</h1>
            </div>
            <p className="text-slate-500 font-mono font-bold text-[10px] sm:text-xs break-all">ID: {order?._id?.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-100 w-full md:w-auto">
            <Calendar size={14} className="text-slate-400 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-600">Placed on {new Date(order?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (Items & Status) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
          {/* Fulfillment Status */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
            <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-8 flex items-center gap-3">
              <Package size={18} className="text-blue-600 sm:w-5 sm:h-5" /> Fulfillment Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-3xl border ${order?.isPaid ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</span>
                  {order?.isPaid ? <CheckCircle2 size={14} className="text-blue-600 sm:w-4 sm:h-4" /> : <Clock size={14} className="text-slate-400 sm:w-4 sm:h-4" />}
                </div>
                <p className={`text-xs sm:text-sm font-black ${order?.isPaid ? 'text-blue-900' : 'text-slate-400'}`}>
                  {order?.isPaid ? `Paid on ${new Date(order?.paidAt).toLocaleDateString()}` : 'Pending Payment'}
                </p>
              </div>
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-3xl border ${order?.isDelivered ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</span>
                  {order?.isDelivered ? <Truck size={14} className="text-emerald-600 sm:w-4 sm:h-4" /> : <Clock size={14} className="text-slate-400 sm:w-4 sm:h-4" />}
                </div>
                <p className={`text-xs sm:text-sm font-black ${order?.isDelivered ? 'text-emerald-900' : 'text-slate-400'}`}>
                  {order?.isDelivered ? `Delivered on ${new Date(order?.deliveredAt).toLocaleDateString()}` : 'In Processing'}
                </p>
              </div>
            </div>
            {userInfo?.isAdmin && !order?.isDelivered && order?.isPaid && (
              <button 
                onClick={deliverHandler}
                className="mt-6 sm:mt-8 w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
              >
                <Truck size={18} /> Mark as Delivered
              </button>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm overflow-hidden min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-6 flex items-center gap-3">
              <ShoppingCart size={18} className="text-blue-600 sm:w-5 sm:h-5" /> Order Items
            </h2>
            <div className="space-y-3 sm:space-y-6">
              {order?.orderItems?.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-6 p-3 sm:p-6 hover:bg-slate-50 rounded-xl sm:rounded-3xl transition-colors group border border-slate-100 sm:border-transparent hover:border-slate-100 min-w-0">
                  <div className="flex gap-3 sm:gap-4 items-center w-full sm:w-auto min-w-0">
                    <img src={item?.image} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0" alt="" />
                    <div className="flex-grow min-w-0">
                      <p className="font-black text-slate-900 mb-0.5 sm:mb-1 truncate text-sm sm:text-base">{item?.name}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item?.qty}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-2 sm:gap-3 sm:min-w-[120px] pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 mt-2 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <p className="font-black text-slate-900 text-sm sm:text-base">₹{(item?.qty * item?.price).toFixed(2)}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">₹{item?.price} each</p>
                    </div>
                    {order?.isDelivered && (
                      <button 
                        onClick={() => openReviewModal(item)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 text-amber-600 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-amber-100 flex items-center gap-1.5"
                      >
                        <Star size={10} className="sm:w-3 sm:h-3" fill="currentColor" /> Review Item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Shipping, Payment, Summary) */}
        <div className="space-y-6 sm:space-y-8 min-w-0">
          {/* Shipping */}
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-xl shadow-slate-900/10">
            <h2 className="text-base sm:text-lg font-black mb-4 sm:mb-6 flex items-center gap-3">
              <Truck size={18} className="text-blue-400 sm:w-5 sm:h-5" /> Shipping
            </h2>
            <div className="space-y-1 font-medium text-slate-400 text-xs sm:text-sm">
              <p className="text-white font-bold text-sm sm:text-base mb-2">{order?.user?.name || 'Customer'}</p>
              <p>{order?.shippingAddress?.address}</p>
              <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}</p>
              <p>{order?.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm">
            <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-6 flex items-center gap-3">
              <CreditCard size={18} className="text-blue-600 sm:w-5 sm:h-5" /> Payment
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                <CreditCard size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xs sm:text-sm">{order?.paymentMethod}</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Gateway</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm">
            <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-6">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500">
                <span>Subtotal</span>
                <span>₹{order?.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500">
                <span>Shipping</span>
                <span>₹{order?.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500">
                <span>Tax</span>
                <span>₹{order?.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-black text-slate-900">Total</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600">₹{order?.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isReviewModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Write a Review</h2>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitReviewHandler} className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <img src={selectedProduct.image} className="w-20 h-24 rounded-sm object-cover bg-gray-50 border border-gray-100" alt="" />
                  <div className="flex-grow space-y-3">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2">{selectedProduct.name}</p>
                    
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className={`transition-colors ${rating >= num ? 'text-teal-600' : 'text-gray-200'} hover:text-teal-500`}
                        >
                          <Star size={24} fill={rating >= num ? "currentColor" : "none"} strokeWidth={rating >= num ? 0 : 1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Review</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full p-4 bg-white border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm text-gray-900 resize-none"
                    placeholder="What did you like or dislike about this product?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button 
                  disabled={reviewLoading}
                  type="submit" 
                  className="w-full py-4 bg-black text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : 'Publish Review'}
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
