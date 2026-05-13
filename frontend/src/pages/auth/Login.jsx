import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        
        {}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-bold tracking-tighter mb-12 block">
              LookBetter
            </Link>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold leading-tight">
                Welcome back to <br />
                the <span className="text-blue-500">Premium</span> circle.
              </h2>
              <p className="text-slate-400 max-w-xs leading-relaxed">
                Log in to access your personalized dashboard, exclusive deals, and express checkout.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="text-sm italic text-slate-300">
                "The best shopping experience I've ever had. The quality of products is unmatched."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=32" alt="Avatar" />
                </div>
                <div>
                  <p className="text-xs font-bold">Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-500">Premium Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
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

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-blue-600 hover:underline">Forgot?</Link>
              </div>
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

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10">
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
