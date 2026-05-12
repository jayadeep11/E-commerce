import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, LogOut, Settings, ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle, X, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userInfo, logout, refreshProfile, updateProfile, verifyOTP } = useAuth();
  const navigate = useNavigate();

  // Sidebar/Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    password: ''
  });

  // Section Toggle States
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [showPassEdit, setShowPassEdit] = useState(false);

  // Verification State
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otp, setOtp] = useState('');

  // UI Status
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      refreshProfile();
    }
  }, []);

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

  const handleVerifyNewEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOTP(userInfo.email, otp, pendingEmail);
      showNotification('Email verified and updated!');
      setShowOtpScreen(false);
      setIsDrawerOpen(false);
      setOtp('');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Invalid code', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative min-h-screen">
      {/* Premium Toast Notification */}
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Profile Header */}
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

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-card p-8 flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">0</p>
                  <p className="text-xs font-bold text-slate-400">Total Acquisitions</p>
                </div>
              </div>
              <div className="glass-card p-8 bg-blue-600 text-white flex flex-col justify-between">
                <p className="font-black text-lg leading-tight">Your style journey starts here.</p>
                <p className="text-blue-100 text-xs mt-2">New arrivals daily.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-8 space-y-6">
              <h3 className="font-bold text-slate-900">Personal Dashboard</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm text-slate-600 flex items-center gap-3">
                  <ShoppingBag size={18} /> My Recent Orders
                </button>
                <button className="w-full text-left p-4 hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm text-slate-600 flex items-center gap-3">
                  <Mail size={18} /> Inbox Messages
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
               <div className="absolute bottom-0 right-0 p-4 opacity-10">
                 <Settings size={80} />
               </div>
               <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Upgrade Now</p>
               <h4 className="text-xl font-black mb-4 leading-tight">Get LookBetter <br/>Premium Access</h4>
               <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-xs hover:bg-blue-50 transition-all">
                 VIEW PLANS
               </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Settings size={20} /></div>
                  <h2 className="text-xl font-black text-slate-900">Profile Settings</h2>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <form onSubmit={handleApplyChanges} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                  </div>

                  {/* Phone Section */}
                  <div className="pt-2">
                    {!showPhoneEdit ? (
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                          <p className="font-bold text-sm text-slate-900">{userInfo.phone || 'None'}</p>
                        </div>
                        <button type="button" onClick={() => setShowPhoneEdit(true)} className="text-xs font-black text-blue-600 hover:underline">Change</button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Phone</label>
                         <input type="text" autoFocus value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-white border-2 border-blue-100 rounded-2xl focus:ring-0 outline-none transition-all font-bold" />
                      </motion.div>
                    )}
                  </div>

                  {/* Password Section */}
                  <div className="pt-2">
                    {!showPassEdit ? (
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security</p>
                          <p className="font-bold text-sm text-slate-900">••••••••••••</p>
                        </div>
                        <button type="button" onClick={() => setShowPassEdit(true)} className="text-xs font-black text-blue-600 hover:underline">Change</button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                         <input type="password" autoFocus value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="New password" className="w-full px-5 py-4 bg-white border-2 border-blue-100 rounded-2xl focus:ring-0 outline-none transition-all font-bold" />
                      </motion.div>
                    )}
                  </div>

                  <button disabled={loading} type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 mt-8">
                    {loading ? 'Processing...' : <><Save size={20} /> Save New Config</>}
                  </button>
                </form>
              </div>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase text-center leading-relaxed">
                  All changes are cryptographically secured and instantly replicated across your devices.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OTP Modal Overlay */}
      <AnimatePresence>
        {showOtpScreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/70">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto"><Lock size={32} /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Email Verification</h3>
                <p className="text-slate-500 text-sm mt-2">Code sent to: <br/> <b>{pendingEmail}</b></p>
              </div>
              <form onSubmit={handleVerifyNewEmail} className="space-y-6">
                <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-center text-3xl font-black tracking-[0.4em] py-4 bg-slate-50 border-none rounded-2xl outline-none text-blue-600" placeholder="000000" />
                <button disabled={loading || otp.length < 6} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                  {loading ? 'Confirming...' : 'Verify Now'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
