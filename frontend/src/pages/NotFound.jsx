import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Ghost } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-slate-200"
            >
              <Ghost size={120} strokeWidth={1} />
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900/5 blur-xl rounded-full" />
          </div>

          <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 uppercase tracking-widest">
            Lost in Style?
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            The page you're looking for has moved out of the collection or never existed in the first place.
          </p>

          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
