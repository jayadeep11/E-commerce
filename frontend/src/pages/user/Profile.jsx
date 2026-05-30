import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle, X, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { optimizeImage } from '../../utils/cloudinary';
import AnimatedNumber from '../../components/ui/AnimatedNumber';

const Profile = () => {
  const { 
    userInfo, logout, refreshProfile, updateProfile, verifyOTP,
    addAddress, updateAddress, deleteAddress, setDefaultAddress 
  } = useAuth();
  const navigate = useNavigate();

  // Drawer States
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

  // OTP Verification
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Loader & Toast
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [uploadingPic, setUploadingPic] = useState(false);

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

  const handleVerifyNewEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(otp);
      showNotification('Email verified and updated successfully!');
      setShowOtpScreen(false);
      setOtp('');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Verification failed', 'error');
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

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingPic(true);
    try {
      const { data } = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await updateProfile({ profilePic: data.imageUrl });
      showNotification('Profile picture updated successfully!');
      refreshProfile();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingPic(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative min-h-screen">
      {/* Toast Notification */}
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        
        {/* Simple Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="relative group">
            {userInfo.profilePic ? (
              <img 
                src={optimizeImage(userInfo.profilePic, 200)} 
                alt={userInfo.name} 
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg border-4 border-white"
              />
            ) : (
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg">
                {userInfo.name.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 sm:flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity hidden">
              <span className="text-[10px] font-bold">Upload</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} disabled={uploadingPic} />
            </label>

            {/* Mobile visible upload button */}
            <label className="absolute bottom-0 right-0 sm:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} disabled={uploadingPic} />
            </label>
            {uploadingPic && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{userInfo.name}</h1>
              <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">{userInfo.email}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <Settings size={16} /> Edit Profile
              </button>
              <button 
                onClick={() => { navigate('/login'); logout(); }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats & Links Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-1">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900"><AnimatedNumber value={orderCount} /></p>
            </div>
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-1">Total Spent</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">₹<AnimatedNumber value={totalSpent} decimals={2} /></p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
             <button onClick={() => navigate('/orders')} className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors font-bold text-slate-700 flex items-center gap-3 text-sm">
                <ShoppingBag size={16} className="text-blue-600" /> My Orders
              </button>
              {userInfo.isAdmin && (
                <button onClick={() => navigate('/admin')} className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-bold text-blue-700 flex items-center gap-3 text-sm">
                  <ShieldCheck size={16} className="text-blue-600" /> Admin
                </button>
              )}
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Saved Addresses</h2>
            <button 
              onClick={() => { setEditingAddress(null); setAddressData({ label: 'Home', address: '', city: '', postalCode: '', country: '' }); setIsAddressDrawerOpen(true); }}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors w-full sm:w-auto"
            >
              Add New Location
            </button>
          </div>

          {(!userInfo.addresses || userInfo.addresses.length === 0) ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No saved addresses found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userInfo.addresses.map((addr) => (
                <div key={addr._id} className={`p-5 rounded-2xl border transition-colors flex flex-col sm:flex-row justify-between gap-4 sm:items-center ${addr.isDefault ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{addr.address}, {addr.city}, {addr.postalCode}, {addr.country}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button onClick={() => setDefaultAddress(addr._id)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Set Default</button>
                    )}
                    <button onClick={() => openEditAddress(addr)} className="p-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><Settings size={16} /></button>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors"><X size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </motion.div>

      {/* Profile Edit Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[110] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Settings size={20} /></div>
                  <h2 className="text-xl font-black text-slate-900">Edit Profile</h2>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="tel" value={formData.phone} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" placeholder="Optional" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-8">
                    {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Address Edit Drawer */}
      <AnimatePresence>
        {isAddressDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddressDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[110] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Settings size={20} /></div>
                  <h2 className="text-xl font-black text-slate-900">{editingAddress ? 'Edit Location' : 'Add New Location'}</h2>
                </div>
                <button onClick={() => setIsAddressDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label (e.g. Home, Work)</label>
                    <input required type="text" value={addressData.label} onChange={(e) => setAddressData({...addressData, label: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                    <textarea required rows="3" value={addressData.address} onChange={(e) => setAddressData({...addressData, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold resize-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                      <input required type="text" value={addressData.city} onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); }} onChange={(e) => setAddressData({...addressData, city: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zip Code</label>
                      <input required type="tel" value={addressData.postalCode} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                    <input required type="text" value={addressData.country} onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); }} onChange={(e) => setAddressData({...addressData, country: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 mt-8">
                    {loading ? 'Saving...' : <><Save size={20} /> Save Location</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpScreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto"><Lock size={32} /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Verify Email</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Code sent to:<br/><b className="text-slate-900">{pendingEmail}</b></p>
              </div>
              <form onSubmit={handleVerifyNewEmail} className="space-y-6">
                <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-center text-3xl font-black tracking-[0.4em] py-4 bg-slate-50 border-2 border-slate-100 focus:border-blue-500 rounded-2xl outline-none text-blue-600 transition-colors" placeholder="000000" />
                <button disabled={loading || otp.length < 6} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none">Verify Email</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
