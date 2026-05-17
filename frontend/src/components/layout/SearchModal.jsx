import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ShoppingBag, Layers, User, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGES = [
  { name: 'Home Page', path: '/', icon: Home, desc: 'Go to the store front' },
  { name: 'Shop All Products', path: '/shop', icon: ShoppingBag, desc: 'Browse our entire catalog' },
  { name: 'Browse Categories', path: '/categories', icon: Layers, desc: 'Find products by departments' },
  { name: 'View Shopping Cart', path: '/cart', icon: ShoppingBag, desc: 'Check your items in cart' },
  { name: 'My Profile Settings', path: '/profile', icon: User, desc: 'Manage your account details' },
  { name: 'My Order History', path: '/orders', icon: ClipboardList, desc: 'View your past receipts' }
];

const SearchModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalInputRef = useRef(null);

  // Filter pages that match query
  const filteredPages = PAGES.filter(p => 
    p.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
    p.desc.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Dynamic suggestions list
  const items = modalSearch.trim()
    ? [
        {
          name: `Search for "${modalSearch}"`,
          desc: 'Find items in our shop catalog',
          icon: Search,
          action: () => handleModalSearch()
        },
        ...filteredPages.map(p => ({
          name: p.name,
          desc: p.desc,
          icon: p.icon,
          action: () => handlePageNavigation(p.path)
        }))
      ]
    : PAGES.map(p => ({
        name: p.name,
        desc: p.desc,
        icon: p.icon,
        action: () => handlePageNavigation(p.path)
      }));

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
      if (isOpen && items.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % items.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          items[selectedIndex]?.action();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex]);

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

  const handleModalSearch = () => {
    if (modalSearch.trim()) {
      setIsOpen(false);
      navigate(`/shop?search=${encodeURIComponent(modalSearch.trim())}`);
      setModalSearch('');
    }
  };

  const handlePageNavigation = (path) => {
    setIsOpen(false);
    setModalSearch('');
    navigate(path);
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
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
          >
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                items[selectedIndex]?.action();
              }} 
              className="flex items-center gap-3 p-5 border-b border-slate-100"
            >
              <Search className="text-slate-500 shrink-0" size={20} />
              <input 
                ref={modalInputRef}
                type="text" 
                placeholder="Search products, pages, collections..." 
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="flex-grow bg-transparent border-none outline-none text-slate-800 text-base md:text-lg placeholder:text-slate-400"
              />
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-xs font-black shadow-sm"
              >
                ESC
              </button>
            </form>
            
            {/* Pages & Command List */}
            <div className="p-3 bg-slate-50/50 flex flex-col gap-1 max-h-[360px] overflow-y-auto hide-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-3 py-1.5 mb-1 select-none">
                {modalSearch.trim() ? 'Search Results & Suggestions' : 'Quick Jump to Pages'}
              </span>
              
              {items.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400 font-bold select-none">
                  No pages or results found for "{modalSearch}"
                </div>
              ) : (
                items.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  
                  return (
                    <div
                      key={item.name}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer select-none text-left transition-colors duration-150 ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 font-bold'
                          : 'text-slate-700 hover:bg-black/[0.03]'
                      }`}
                    >
                      <Icon 
                        size={18} 
                        className={`shrink-0 transition-colors duration-150 ${
                          isSelected ? 'text-slate-800' : 'text-slate-400'
                        }`} 
                      />
                      <div className="flex-grow flex items-center justify-between min-w-0">
                        <span className="text-sm font-bold truncate leading-none">
                          {item.name}
                        </span>
                        <span className={`text-[11px] truncate ml-3 font-semibold hidden sm:inline transition-colors duration-150 ${
                          isSelected ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
