import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag, Heart, Sparkles, Layers } from 'lucide-react';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Precision tailored essentials and high-end streetwear.',
    image: '/assets/ui/dept-men.jpg',
    path: '/shop?gender=Men',
    count: '32 Items'
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Sophisticated silhouettes and designer signature pieces.',
    image: '/assets/ui/dept-women.jpg',
    path: '/shop?gender=Women',
    count: '45 Items'
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Playful adventure-ready styles for the next generation.',
    image: '/assets/ui/dept-kids.jpg',
    path: '/shop?gender=Kids',
    count: '24 Items'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'The final touch of luxury for every department.',
    image: '/assets/ui/dept-acc.jpg',
    path: '/shop?category=Accessories',
    count: '100+ Items'
  }
];

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-1.5 rounded-full mb-6 inline-block">Explore Departments</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Curated Collections</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
          Discover our specialized departments, each featuring a hand-picked selection of high-fidelity essentials.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-[350px] lg:h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/40"
          >
            {}
            <img 
              src={category.image} 
              alt={category.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            
            {}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent group-hover:via-slate-900/40 transition-all duration-500"></div>

            {}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="w-8 h-px bg-blue-500"></span>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{category.count}</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                {category.name}
              </h2>
              
              <p className="text-slate-300 mb-6 max-w-sm text-xs font-medium leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-[100ms]">
                {category.description}
              </p>

              <Link 
                to={category.path}
                className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest group/btn w-fit"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/btn:bg-blue-600 group-hover/btn:border-blue-600 transition-all">
                  <ChevronRight size={18} />
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">Explore Collection</span>
              </Link>
            </div>

            {}
            <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <Sparkles size={20} className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-slate-100 pt-16"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
            <ShoppingBag size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Global Shipping</h4>
          <p className="text-xs text-slate-400 font-bold">Premium delivery worldwide.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
            <Heart size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Ethical Sourcing</h4>
          <p className="text-xs text-slate-400 font-bold">Responsibly crafted pieces.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
            <Layers size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Limited Drops</h4>
          <p className="text-xs text-slate-400 font-bold">Exclusive seasonal releases.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
            <Sparkles size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Quality Guaranteed</h4>
          <p className="text-xs text-slate-400 font-bold">Rigorous high-fidelity testing.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;
