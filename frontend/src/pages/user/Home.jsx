import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="pb-0 overflow-x-hidden bg-white">
      <section className="min-h-[calc(100vh-73px)] flex flex-col lg:flex-row items-stretch">
        
        {/* Left Side: Typography and CTA */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 lg:py-0 relative z-10 bg-white">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-block mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b-2 border-slate-900 pb-2">
                New Collection
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tighter leading-[1.1] sm:leading-[0.9] mb-8">
              REDEFINE <br />
              <span className="text-slate-400">THE</span> <br />
              ESSENTIAL.
            </h1>
            
            <p className="text-slate-500 font-medium text-base sm:text-lg lg:text-xl max-w-md leading-relaxed mb-10 sm:mb-12">
              Uncompromising quality meets minimalist design. Discover pieces crafted to endure both time and trend.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link 
                to="/shop" 
                className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors"
              >
                Explore Now
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link 
                to="/categories" 
                className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors underline-offset-8 hover:underline"
              >
                View Departments
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-0 overflow-hidden m-4 lg:m-6 rounded-3xl lg:rounded-[2.5rem] shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src="/assets/ui/dept-men.jpg" 
              className="w-full h-full object-cover"
              alt="Luxury Fashion"
            />
            {/* Subtle Overlay to make it feel premium */}
            <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply"></div>
          </motion.div>
        </div>
        
      </section>
    </div>
  );
};

export default Home;
