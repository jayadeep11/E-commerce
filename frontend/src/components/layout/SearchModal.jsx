import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../api/productService';
import { optimizeImage } from '../../utils/cloudinary';

const SearchModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalInputRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(modalSearch.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [modalSearch]);

  // Fetch products when debounced search changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedSearch) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await productService.getProducts({ search: debouncedSearch, limit: 5 });
        setProducts(data);
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-search-modal', handleOpen);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-search-modal', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      
      const totalItems = products.length + (debouncedSearch ? 1 : 0); // +1 for the "View all results" button
      
      if (isOpen && totalItems > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          
          if (selectedIndex < products.length) {
            handleProductClick(products[selectedIndex]._id);
          } else {
            handleViewAll();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, products, selectedIndex, debouncedSearch]);

  // Reset selected item on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [modalSearch]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => modalInputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleProductClick = (id) => {
    setIsOpen(false);
    setModalSearch('');
    navigate(`/product/${id}`);
  };

  const handleViewAll = () => {
    if (modalSearch.trim()) {
      setIsOpen(false);
      navigate(`/shop?search=${encodeURIComponent(modalSearch.trim())}`);
      setModalSearch('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] bg-slate-900/55 flex items-center justify-center px-4"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Search Input Area */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedIndex < products.length) {
                  handleProductClick(products[selectedIndex]._id);
                } else {
                  handleViewAll();
                }
              }} 
              className="flex items-center gap-3 p-5 sm:p-6 border-b border-slate-100 shrink-0"
            >
              <Search className="text-blue-600 shrink-0" size={24} />
              <input 
                ref={modalInputRef}
                type="text" 
                placeholder="Search for products, brands, categories..." 
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="flex-grow bg-transparent border-none outline-none text-slate-900 text-lg sm:text-xl font-medium placeholder:text-slate-400 placeholder:font-normal"
              />
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-bold transition-colors"
              >
                ESC
              </button>
            </form>
            
            {/* Results Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar bg-slate-50/50">
              
              {!modalSearch.trim() ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-1">Start typing to search</h3>
                  <p className="text-slate-500 text-sm">Find your favorite products instantly.</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                  <p className="text-slate-500 text-sm font-medium animate-pulse">Searching catalog...</p>
                </div>
              ) : products.length > 0 ? (
                <div className="p-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-4 py-2 mb-1 select-none">
                    Products found ({products.length})
                  </span>
                  
                  <div className="space-y-1">
                    {products.map((product, idx) => {
                      const isSelected = idx === selectedIndex;
                      
                      return (
                        <div
                          key={product._id}
                          onClick={() => handleProductClick(product._id)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center gap-4 p-3 rounded-2xl cursor-pointer select-none text-left transition-colors duration-150 ${
                            isSelected
                              ? 'bg-white shadow-sm border border-slate-100'
                              : 'border border-transparent hover:bg-white/60'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                            <img 
                              src={optimizeImage(product.image, 100)} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                              {product.name}
                            </h4>
                            <span className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                              {product.category} &bull; {product.gender}
                            </span>
                          </div>
                          <div className="shrink-0 text-right pl-4">
                            <span className="text-sm sm:text-base font-black text-slate-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.mrp > product.price && (
                              <span className="text-xs text-slate-400 line-through block font-medium">
                                ₹{product.mrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* View All Button */}
                  <div 
                    onClick={handleViewAll}
                    onMouseEnter={() => setSelectedIndex(products.length)}
                    className={`mt-4 w-full flex items-center justify-center gap-2 p-4 rounded-2xl cursor-pointer select-none font-bold text-sm transition-all duration-150 ${
                      selectedIndex === products.length
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white text-blue-600 border border-slate-200'
                    }`}
                  >
                    View all results for "{debouncedSearch}" <ArrowRight size={16} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-1">No products found</h3>
                  <p className="text-slate-500 text-sm max-w-[250px]">
                    We couldn't find anything matching "{debouncedSearch}". Try adjusting your search.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
