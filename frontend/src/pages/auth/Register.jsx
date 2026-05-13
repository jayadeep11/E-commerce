import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Zap, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const { register, verifyOTP } = useAuth();

  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const data = await register(name, email, password, phone, isAdmin);
      
      if (data && data.requiresVerification) {
        setShowOtp(true);
        setTimer(60);
        setCanResend(false);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      setLoading(true);
      await register(name, email, password, phone, isAdmin);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await verifyOTP(email, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        
        {}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-bold tracking-tighter mb-12 block">
              LookBetter
            </Link>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <h2 className="text-5xl font-bold leading-tight">
                Join the <br />
                <span className="text-blue-200">Future</span> of Shopping.
              </h2>
              
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-lg">
                  <div className="p-2 bg-white/10 rounded-lg"><Zap size={20} className="text-blue-200" /></div>
                  Fast & Secure Transactions
                </li>
                <li className="flex items-center gap-4 text-lg">
                  <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck size={20} className="text-blue-200" /></div>
                  Premium Quality Guaranteed
                </li>
                <li className="flex items-center gap-4 text-lg">
                  <div className="p-2 bg-white/10 rounded-lg"><CheckCircle2 size={20} className="text-blue-200" /></div>
                  Exclusive Member Rewards
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="relative z-10 pt-10">
            <div className="flex -space-x-4 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-500 flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm text-blue-100 font-medium">Join 2,000+ happy customers today.</p>
          </div>
        </div>

        {}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!showOtp ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                  <p className="text-slate-500">Enter your details to get started with LookBetter</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3 border border-red-100"
                  >
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                     {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Phone (Optional)</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">#</div>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="1234567890"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${isAdmin ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAdmin ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                      {isAdmin && <ShieldCheck size={12} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-none">Register as Administrator</p>
                      <p className="text-[10px] font-medium text-slate-500 mt-1.5 uppercase tracking-wider">Unlocks Dashboard & Shop Management</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Create Account <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify Email</h1>
                  <p className="text-slate-500 leading-relaxed">
                    We've sent a 6-digit code to <span className="font-bold text-slate-900">{email}</span>. 
                    Please enter it below.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3 border border-red-100">
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                     {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">OTP Code</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-2xl tracking-[0.5em] font-bold"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Sign Up <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="text-center space-y-4">
                    {canResend ? (
                      <button 
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <p className="text-sm font-bold text-slate-400">
                        Resend code in <span className="text-slate-900 font-black">{timer}s</span>
                      </p>
                    )}

                    <button 
                      type="button"
                      onClick={() => setShowOtp(false)}
                      className="block w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                    >
                      Back to registration
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!showOtp && (
            <p className="text-center text-sm text-slate-500 mt-10">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
