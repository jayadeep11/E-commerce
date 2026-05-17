import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, Heart, Sparkles, Layers } from 'lucide-react';

const fallbackImages = {
  Men: '/assets/ui/dept-men.jpg',
  Women: '/assets/ui/dept-women.jpg',
  Kids: '/assets/ui/dept-kids.jpg'
};

const departmentCategories = {
  Men: [
    {
      id: 'men-shirts',
      name: 'Shirts',
      description: 'Classic button-downs, crisp linen collars, and modern patterns.',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Men&category=Shirts',
      count: '15 Items'
    },
    {
      id: 'men-tshirts',
      name: 'Tshirts',
      description: 'High-comfort premium tees, heavyweight basics, and graphic prints.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Men&category=Tshirts',
      count: '24 Items'
    },
    {
      id: 'men-accessories',
      name: 'Accessories',
      description: 'Premium Italian leather belts, RFID bifold wallets, and luxury chronographs.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Men&category=Accessories',
      count: '15 Items'
    },
    {
      id: 'men-pants',
      name: 'Pants',
      description: 'Tailored trousers, premium raw denim, and relaxed fit cargo pants.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Men&category=Pants',
      count: '18 Items'
    },
    {
      id: 'men-footwear',
      name: 'Footwear',
      description: 'Handcrafted sneakers, fine leather shoes, and daily casual classics.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Men&category=Footwear',
      count: '12 Items'
    }
  ],
  Women: [
    {
      id: 'women-shirts',
      name: 'Shirts',
      description: 'Elegant blouses, oversized crisp poplins, and modern tailoring.',
      image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Women&category=Shirts',
      count: '18 Items'
    },
    {
      id: 'women-tshirts',
      name: 'Tshirts',
      description: 'Soft luxury crop tees, premium rib knits, and casual boyfriend fits.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Women&category=Tshirts',
      count: '32 Items'
    },
    {
      id: 'women-accessories',
      name: 'Accessories',
      description: '18K gold layered jewelry, quilted handbags, and signature luxury details.',
      image: 'https://images.unsplash.com/photo-1584917765829-d73b58ff200c?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Women&category=Accessories',
      count: '25 Items'
    },
    {
      id: 'women-pants',
      name: 'Pants',
      description: 'High-waisted tailored trousers, wide-leg utility linen, and custom denim.',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Women&category=Pants',
      count: '20 Items'
    },
    {
      id: 'women-footwear',
      name: 'Footwear',
      description: 'Fine leather heels, handcrafted boots, and designer flat sandals.',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Women&category=Footwear',
      count: '16 Items'
    }
  ],
  Kids: [
    {
      id: 'kids-shirts',
      name: 'Shirts',
      description: 'Adorably patterned lightweight button-ups and cute formal collared shirts.',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Kids&category=Shirts',
      count: '8 Items'
    },
    {
      id: 'kids-tshirts',
      name: 'Tshirts',
      description: 'Colorful graphic tees, super-soft organic cotton basics, and fun play tees.',
      image: 'https://images.unsplash.com/photo-1519457431-44cac64a579b?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Kids&category=Tshirts',
      count: '15 Items'
    },
    {
      id: 'kids-accessories',
      name: 'Accessories',
      description: 'Ergonomic backpacks with safety patches, digital LED watches, and animal ears headbands.',
      image: 'https://images.unsplash.com/photo-1515562141224-7a52ef2ce588?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Kids&category=Accessories',
      count: '10 Items'
    },
    {
      id: 'kids-pants',
      name: 'Pants',
      description: 'Durable active sweatpants, play-ready denim, and soft cotton leggings.',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Kids&category=Pants',
      count: '12 Items'
    },
    {
      id: 'kids-footwear',
      name: 'Footwear',
      description: 'Playground-safe sneakers, cute slip-ons, and warm outdoor boots.',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
      path: '/shop?gender=Kids&category=Footwear',
      count: '10 Items'
    }
  ]
};

const Categories = () => {
  const [activeDept, setActiveDept] = useState('Men');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] bg-slate-100 px-4 py-1.5 rounded-full mb-6 inline-block">Explore Departments</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Curated Collections</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
          Discover our specialized departments, each featuring a hand-picked selection of high-fidelity essentials.
        </p>
      </motion.div>

      {/* Department Tabs */}
      <div className="flex justify-center gap-4 mb-16">
        {['Men', 'Women', 'Kids'].map((dept) => {
          const isActive = activeDept === dept;
          return (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-950/10'
                  : 'bg-white border-slate-200 text-slate-650 hover:border-slate-400'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[450px]">
        <AnimatePresence mode="wait">
          {departmentCategories[activeDept].map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative h-[380px] lg:h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/40"
            >
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={category.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImages[activeDept];
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent group-hover:via-slate-900/40 transition-all duration-500"></div>

              {/* Details Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="w-8 h-px bg-slate-450"></span>
                  <span className="text-[9px] font-black text-slate-350 uppercase tracking-widest">{category.count}</span>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-[50ms]">
                  {category.name}
                </h2>
                
                <p className="text-slate-300 mb-6 max-w-sm text-xs font-medium leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-[100ms]">
                  {category.description}
                </p>

                <Link 
                  to={category.path}
                  className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest group/btn w-fit"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/btn:bg-slate-900 group-hover/btn:border-slate-900 transition-all">
                    <ChevronRight size={18} />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">Explore Collection</span>
                </Link>
              </div>

              {/* Sparkle Icon */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <Sparkles size={20} className="text-white" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trust Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-slate-100 pt-16"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
            <ShoppingBag size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Global Shipping</h4>
          <p className="text-xs text-slate-400 font-bold">Premium delivery worldwide.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
            <Heart size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Ethical Sourcing</h4>
          <p className="text-xs text-slate-400 font-bold">Responsibly crafted pieces.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
            <Layers size={24} />
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Limited Drops</h4>
          <p className="text-xs text-slate-400 font-bold">Exclusive seasonal releases.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
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
