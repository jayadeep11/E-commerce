import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Package, TrendingUp, ChevronRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/orders'),
          api.get('/api/products')
        ]);

        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
        const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];

        const totalRevenue = ordersData.reduce((acc, order) => acc + (order.isPaid ? (order.totalPrice || 0) : 0), 0);

        setStats({
          users: usersData.length,
          orders: ordersData.length,
          products: productsData.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setStats({ users: 0, orders: 0, products: 0, revenue: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <TrendingUp size={24} />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    { title: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={24} />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { title: 'Total Users', value: stats.users, icon: <Users size={24} />, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
    { title: 'Product Inventory', value: stats.products, icon: <Package size={24} />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Admin Command Center</h1>
          <p className="text-slate-500 font-medium">Real-time overview of your store's performance.</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-900/20">
          <Activity size={20} className="text-blue-400" />
          <span className="text-sm font-bold uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className={`bg-white border ${stat.border} p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300`}
          >
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Link to="/admin/orders" className="lg:col-span-1 group">
          <div className="bg-white border border-slate-100 p-10 rounded-[3rem] h-full hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag size={120} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Manage Orders</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Track every transaction, update delivery statuses, and monitor fulfillment health.</p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              Launch Module <ChevronRight size={18} />
            </div>
          </div>
        </Link>

        <Link to="/admin/products" className="lg:col-span-1 group">
          <div className="bg-white border border-slate-100 p-10 rounded-[3rem] h-full hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Package size={120} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Product Inventory</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Update pricing, manage stock levels, and add new luxury items to the collection.</p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              Open Inventory <ChevronRight size={18} />
            </div>
          </div>
        </Link>

        <Link to="/admin/users" className="lg:col-span-1 group">
          <div className="bg-white border border-slate-100 p-10 rounded-[3rem] h-full hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={120} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Member Directory</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Monitor your growing community and oversee user verification and engagement.</p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              View Directory <ChevronRight size={18} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
