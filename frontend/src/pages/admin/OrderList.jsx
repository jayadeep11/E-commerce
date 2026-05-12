import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ShoppingBag, ChevronRight, CheckCircle2, Clock, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    try {
      await api.put(`/api/orders/${id}/deliver`, {});
      // Refresh list
      const { data } = await api.get('/api/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Error updating delivery status');
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Order Ledger...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Order Management</h1>
        <p className="text-slate-500 font-medium">Track fulfillment and monitor global sales.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            key={order._id}
            className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:border-blue-100 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              <div className="lg:w-48">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-mono text-sm text-slate-600 font-bold">#{order._id.slice(-8).toUpperCase()}</p>
              </div>

              <div className="lg:w-48">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                <p className="text-sm text-slate-900 font-black">{order.user ? order.user.name : 'Deleted User'}</p>
              </div>

              <div className="lg:w-40">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                <p className="text-sm text-slate-900 font-black">${order.totalPrice.toFixed(2)}</p>
              </div>

              <div className="flex-grow flex gap-3">
                {order.isPaid ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Clock size={12} /> Unpaid
                  </span>
                )}

                {order.isDelivered ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Truck size={12} /> Delivered
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Processing
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {!order.isDelivered && order.isPaid && (
                  <button 
                    onClick={() => deliverHandler(order._id)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all"
                  >
                    Mark Delivered
                  </button>
                )}
                <Link to={`/order/${order._id}`} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
