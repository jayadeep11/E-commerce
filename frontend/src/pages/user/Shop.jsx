import { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProductCard from '../../components/product/ProductCard';
import { SlidersHorizontal, Search, X as CloseIcon, Check as CheckIcon, RotateCcw as ResetIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const hasSeenNotice = sessionStorage.getItem('hasSeenRenderNotice');
    if (!hasSeenNotice) {
      setShowNotice(true);
      sessionStorage.setItem('hasSeenRenderNotice', 'true'); 
      // Notice stays for 7 seconds to give user time to read
      const timer = setTimeout(() => setShowNotice(false), 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Streetwear', 'Formal', 'Outerwear', 'Bottoms', 'Knitwear', 'Footwear'];
  const genderOptions = ['All', 'Men', 'Women', 'Kids'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering & Sorting Logic
  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedGender !== 'All') {
      result = result.filter(p => p.gender === selectedGender);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, selectedGender, sortBy, products]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGender('All');
    setSortBy('newest');
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-white flex overflow-hidden">
      {/* MAIN CONTENT AREA - INDEPENDENT SCROLL - HIDDEN SCROLLBAR */}
      <motion.div 
        layout
        className="flex-1 h-full overflow-y-auto hide-scrollbar"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Page Header - Compact & Refined */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">SHOP</h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide">Elevated essentials for every occasion.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <AnimatePresence>
                {!isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="relative flex-grow md:w-72 group"
                  >
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Find your style..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-5 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/10 outline-none transition-all font-bold text-sm text-slate-900"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2.5 rounded-xl transition-all active:scale-95 relative ${
                  isFilterOpen ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-900 text-white shadow-slate-900/20'
                } shadow-lg`}
              >
                <SlidersHorizontal size={20} />
                {(selectedCategory !== 'All' || sortBy !== 'newest') && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-in zoom-in duration-300"></span>
                )}
              </button>
            </div>
          </div>

          {/* Product Grid - Compact high-density layout */}
          <div className={`grid gap-6 pb-20 transition-all duration-300 ${
            isFilterOpen 
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-slate-100 rounded-[2rem] animate-pulse" />
              ))
            ) : (Array.isArray(filteredProducts) && filteredProducts.length > 0) ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                  <Search size={40} />
                </div>
                <p className="text-xl font-bold text-slate-900">No results found</p>
                <button onClick={resetFilters} className="text-blue-600 font-bold uppercase text-xs tracking-widest">Clear all</button>
              </div>
            )}
          </div>

          {/* End of Collection Marker */}
          {!loading && Array.isArray(filteredProducts) && filteredProducts.length > 0 && (
            <div className="py-20 flex items-center gap-6">
              <div className="flex-1 h-[1px] bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">End of Collection</span>
              <div className="flex-1 h-[1px] bg-slate-100" />
            </div>
          )}
        </div>
      </motion.div>

      {/* FIXED SIDE-BY-SIDE FILTER PANEL - HIDDEN SCROLLBAR */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-slate-50 border-l border-slate-100 overflow-hidden rounded-l-[3rem]"
          >
            <div className="w-[380px] flex flex-col h-full">
              <div className="p-10 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Refine</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar px-10 space-y-10 pb-10">
                {/* SIDEBAR SEARCH - SYNCED */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Pieces</h3>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Type style or category..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900 shadow-sm"
                    />
                  </div>
                </div>

                {/* Department (Gender) */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</h3>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map(gender => (
                      <button
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                          selectedGender === gender 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                          selectedCategory === cat 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort Options</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'newest', label: 'New Arrivals' },
                      { id: 'price-low', label: 'Price: Low to High' },
                      { id: 'price-high', label: 'Price: High to Low' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-full transition-all ${
                          sortBy === option.id 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-bold text-xs tracking-wide">{option.label}</span>
                        {sortBy === option.id && <CheckIcon size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Free Tier Notice Toast */}
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                <ResetIcon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">System Notice</p>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  Currently using <span className="text-white font-bold">Render Free Version</span>. 
                  Kindly allow up to <span className="text-white font-bold">50s</span> for products to load as the server wakes up.
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowNotice(false);
                  sessionStorage.setItem('hasSeenRenderNotice', 'true');
                }}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-all"
              >
                <CloseIcon size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
