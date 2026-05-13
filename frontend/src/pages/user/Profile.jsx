import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, LogOut, Settings, ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle, X, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { 
    userInfo, logout, refreshProfile, updateProfile, verifyOTP,
    addAddress, updateAddress, deleteAddress, setDefaultAddress 
  } = useAuth();
  const navigate = useNavigate();

  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    password: ''
  });

  const [addressData, setAddressData] = useState({
    label: 'Home',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [showPassEdit, setShowPassEdit] = useState(false);

  
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otp, setOtp] = useState('');

  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      refreshProfile();
      fetchOrderStats();
    }
  }, []);

  const fetchOrderStats = async () => {
    if (!userInfo) return;
    try {
      const { data } = await api.get('/api/orders/myorders');
      if (Array.isArray(data)) {
        setOrderCount(data.length);
        const total = data.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        setTotalSpent(total);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
      setOrderCount(0);
      setTotalSpent(0);
    }
  };

  useEffect(() => {
    if (userInfo && !isDrawerOpen) {
      setFormData({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || '',
        password: ''
      });
      setShowPhoneEdit(false);
      setShowPassEdit(false);
    }
  }, [userInfo, isDrawerOpen]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApplyChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateProfile(formData);
      if (data.requiresVerification) {
        setPendingEmail(data.pendingEmail);
        setShowOtpScreen(true);
      } else {
        showNotification('Profile updated successfully!');
        setIsDrawerOpen(false);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressData);
        showNotification('Address updated!');
      } else {
        await addAddress(addressData);
        showNotification('New address added!');
      }
      setIsAddressDrawerOpen(false);
      setEditingAddress(null);
      setAddressData({ label: 'Home', address: '', city: '', postalCode: '', country: '' });
    } catch (err) {
      showNotification('Address sync failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressData({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country
    });
    setIsAddressDrawerOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Delete this location?')) {
      try {
        await deleteAddress(id);
        showNotification('Address removed', 'success');
      } catch (err) {
        showNotification('Deletion failed', 'error');
      }
    }
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative min-h-screen">
      {}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-24 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success' 
                ? 'bg-white text-emerald-600 border-emerald-100' 
                : 'bg-white text-red-600 border-red-100'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        {}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-blue-500/20">
              {userInfo.name.charAt(0)}
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900">{userInfo.name}</h1>
                <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
                  {userInfo.isAdmin ? "LookBetter Administrator" : "Verified Premium Member"}
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                >
                  <Settings size={14} /> Edit Profile
                </button>
                <button 
                  onClick={() => { navigate('/login'); logout(); }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all active:scale-95"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {}
            <div className="glass-card p-10 space-y-10 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-[0.05] rotate-12">
                <ShieldCheck size={200} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">Account Credentials</h2>
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</p>
                  <p className="text-lg font-bold text-slate-900">{userInfo.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-lg font-bold text-slate-900">{userInfo.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Link</p>
                  <p className="text-lg font-bold text-slate-900">{userInfo.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membership</p>
                  <p className="text-lg font-bold text-blue-600">VIP Exclusive Access</p>
                </div>
              </div>
            </div>

            {}
            <div className="glass-card p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Saved Addresses</h2>
                <button 
                  onClick={() => { setEditingAddress(null); setAddressData({ label: 'Home', address: '', city: '', postalCode: '', country: '' }); setIsAddressDrawerOpen(true); }}
                  className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                >
                  Add New Location
                </button>
              </div>

              {(!userInfo.addresses || userInfo.addresses.length === 0) ? (
                <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No saved locations found.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {userInfo.addresses.map((addr) => (
                    <div key={addr._id} className={`p-6 rounded-[2rem] border-2 transition-all relative group ${addr.isDefault ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200 bg-white'}`}>
                      {addr.isDefault && (
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                          Primary
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Settings size={18} className="text-blue-600" />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditAddress(addr)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"><Settings size={14} /></button>
                          <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"><X size={14} /></button>
                        </div>
                      </div>
                      <p className="font-black text-slate-900 mb-1">{addr.label}</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">{addr.address}, {addr.city}, {addr.postalCode}</p>
                      
                      {!addr.isDefault && (
                        <button 
                          onClick={() => setDefaultAddress(addr._id)}
                          className="w-full py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {}
          <div className="space-y-6">
            <div 
              onClick={() => navigate('/orders')}
              className="glass-card p-8 flex items-center gap-6 cursor-pointer hover:border-blue-200 transition-all active:scale-95 bg-gradient-to-br from-white to-blue-50/30"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{orderCount}</p>
                <p className="text-xs font-bold text-slate-400">Total Acquisitions</p>
              </div>
            </div>

            <div 
              onClick={() => navigate('/orders')}
              className="glass-card p-8 flex items-center gap-6 cursor-pointer hover:border-emerald-200 transition-all active:scale-95 bg-gradient-to-br from-white to-emerald-50/30"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Settings size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">${totalSpent.toFixed(2)}</p>
                <p className="text-xs font-bold text-slate-400">Lifestyle Investment</p>
              </div>
            </div>
            
            <div className="glass-card p-8 space-y-6">
              <h3 className="font-bold text-slate-900">Personal Dashboard</h3>
              <div className="space-y-3">
                <button onClick={() => navigate('/orders')} className="w-full text-left p-4 hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm text-slate-600 flex items-center gap-3">
                  <ShoppingBag size={18} /> My Recent Orders
                </button>
                {userInfo.isAdmin && (
                  <button onClick={() => navigate('/admin')} className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-bold text-sm text-blue-600 flex items-center gap-3 border border-blue-100">
                    <ShieldCheck size={18} /> Admin Command Center
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Settings size={20} /></div>
                  <h2 className="text-xl font-black text-slate-900">Profile Settings</h2>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <form onSubmit={handleApplyChanges} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 mt-8">
                    {loading ? 'Processing...' : <><Save size={20} /> Save Changes</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {isAddressDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddressDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Settings size={20} /></div>
                  <h2 className="text-xl font-black text-slate-900">{editingAddress ? 'Edit Location' : 'New Location'}</h2>
                </div>
                <button onClick={() => setIsAddressDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label (Home / Work)</label>
                    <input required type="text" value={addressData.label} onChange={(e) => setAddressData({...addressData, label: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                    <textarea required rows="3" value={addressData.address} onChange={(e) => setAddressData({...addressData, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                      <input required type="text" value={addressData.city} onChange={(e) => setAddressData({...addressData, city: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zip Code</label>
                      <input required type="text" value={addressData.postalCode} onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                    <input required type="text" value={addressData.country} onChange={(e) => setAddressData({...addressData, country: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 mt-8">
                    {loading ? 'Syncing...' : <><Save size={20} /> Save Location</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showOtpScreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/70">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto"><Lock size={32} /></div>
              <div><h3 className="text-2xl font-black text-slate-900">Email Verification</h3><p className="text-slate-500 text-sm mt-2">Code sent to: <br/> <b>{pendingEmail}</b></p></div>
              <form onSubmit={handleVerifyNewEmail} className="space-y-6">
                <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-center text-3xl font-black tracking-[0.4em] py-4 bg-slate-50 border-none rounded-2xl outline-none text-blue-600" placeholder="000000" />
                <button disabled={loading || otp.length < 6} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">Verify Now</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
