import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Star, Layers, Zap, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pb-0 overflow-x-hidden">
      {/* 1. VIEWPORT-LOCKED VANGUARD HERO */}
      <section className="h-[calc(100vh-73px)] flex flex-col overflow-hidden">
        
        {/* TOP COMPONENT: IMMERSIVE CONTENT (88%) */}
        <div className="flex-grow h-[88%] relative flex items-center justify-center overflow-hidden bg-slate-900">
          {/* Cinematic Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/assets/ui/hero-bg.jpg" 
              className="w-full h-full object-cover grayscale opacity-50"
              alt="Boutique Background"
            />
            <div className="absolute inset-0 bg-slate-900/60"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-full">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">KORE Signature 2026</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">
              ESSENTIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 font-black">STRENGTH.</span>
            </h1>
            <div className="flex justify-center gap-4">
              <Link to="/shop" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                Explore Collection
              </Link>
              <Link to="/categories" className="px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                Departments
              </Link>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM COMPONENT: RHYTHMIC INFINITE TICKER (12%) */}
        <div className="h-[12%] bg-white relative flex items-center overflow-hidden select-none border-t border-slate-100">
          <div className="flex whitespace-nowrap animate-marquee-slow items-center">
            {[ 1, 2, 3, 4, 5, 6, 7, 8 ].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-[40px] lg:text-[60px] font-black text-slate-900 tracking-tighter mr-10 leading-none">
                  KORE
                </span>
                <span className="text-[40px] lg:text-[60px] font-black text-slate-900 tracking-tighter mr-10 leading-none">•</span>
                <span className="text-[40px] lg:text-[60px] font-black tracking-tighter mr-10 leading-none" style={{ WebkitTextStroke: '2px #e2e8f0', color: 'transparent' }}>
                  KORE
                </span>
                <span className="text-[40px] lg:text-[60px] font-black text-slate-900 tracking-tighter mr-10 leading-none">•</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 2. DEPARTMENT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">The Collection</span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Shop by Department</h2>
          </div>
          <Link to="/categories" className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            View All Categories <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { id: 'men', name: 'Men', path: '/shop?gender=Men', img: '/assets/ui/dept-men.jpg' },
            { id: 'women', name: 'Women', path: '/shop?gender=Women', img: '/assets/ui/dept-women.jpg' },
            { id: 'kids', name: 'Kids', path: '/shop?gender=Kids', img: '/assets/ui/dept-kids.jpg' },
            { id: 'acc', name: 'Accessories', path: '/shop?category=Accessories', img: '/assets/ui/dept-acc.jpg' }
          ].map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-[2.5rem] overflow-hidden border border-slate-100"
            >
              <img src={dept.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={dept.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-black text-white mb-2">{dept.name}</h3>
                <Link to={dept.path} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. THE VANGUARD PHILOSOPHY */}
      <section className="bg-slate-900 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">High-Fidelity Craftsmanship</span>
              <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">Built for the <br /> <span className="text-blue-500">Enduring.</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                We don't follow trends. We define the essential. Every piece in the KORE collection is a testament to precision engineering and timeless aesthetic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-blue-500">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">Quality Shield</h4>
                  <p className="text-slate-500 text-xs font-bold">Rigorous 12-point high-fidelity inspection for every item.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-blue-500">
                  <Zap size={28} />
                </div>
                <div>
                  <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">Turbo Delivery</h4>
                  <p className="text-slate-500 text-xs font-bold">Proprietary logistics ensuring your essentials arrive with speed.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden">
              <img src="/assets/ui/philosophy.jpg" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" alt="Process" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          </motion.div>
        </div>
      </section>

      {/* 4. THE INNER CIRCLE (Premium CTA) */}
      <section className="px-6 pb-24 mt-24">
        <div className="max-w-7xl mx-auto bg-slate-950 rounded-[5rem] p-12 lg:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-10"
          >
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">Access the <br /> Unseen.</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium">Join the KORE Inner Circle for first access to limited seasonal drops and exclusive signature collections.</p>
            
            <div className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Vanguard Email" 
                className="flex-1 px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
              <button className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 active:scale-95">
                Join Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
