import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-slate-900">
              Elevate Your <br />
              <span className="gradient-text">Lifestyle.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md leading-relaxed">
              Discover a curated collection of premium tech and lifestyle products designed to move you forward.
            </p>
            <div className="flex gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/categories" className="btn-secondary">
                View Categories
              </Link>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">12k+</span>
                <span className="text-sm text-slate-500 font-medium">Products</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">45k+</span>
                <span className="text-sm text-slate-500 font-medium">Customers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">4.9</span>
                <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  Rating <Star size={12} className="text-yellow-400 fill-yellow-400" />
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="glass-card p-4 aspect-square flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
                alt="Featured Product"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card p-4 flex items-center gap-3 animate-bounce shadow-2xl">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Verified Quality</p>
                <p className="text-[10px] text-slate-500">Premium Standard</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 space-y-4 hover:border-blue-200 transition-colors cursor-default group">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Fast Delivery</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Get your products delivered to your doorstep within 24-48 hours with our express shipping.
          </p>
        </div>

        <div className="glass-card p-8 space-y-4 hover:border-blue-200 transition-colors cursor-default group">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Secure Payment</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            We use industry-standard encryption to ensure your payment details are always safe.
          </p>
        </div>

        <div className="glass-card p-8 space-y-4 hover:border-blue-200 transition-colors cursor-default group">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Star size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Premium Quality</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Every product in our store goes through a rigorous quality check before it reaches you.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
