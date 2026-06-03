import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const Navbar = () => {
  const { cartCount } = useCart();
  const { userInfo, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchTrigger = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  return (
    <nav className="glass-nav px-2 xs:px-4 sm:px-6 py-2 sm:py-4 flex items-center justify-between w-full">
      <div className="flex items-center gap-2 sm:gap-8">
        <Link to="/" className="text-lg xs:text-xl sm:text-2xl font-black gradient-text tracking-tighter flex-shrink-0">
          KORE
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `transition-all duration-300 relative py-1 hover:text-blue-600 ${
                isActive ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 font-medium'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/shop" 
            className={({ isActive }) => 
              `transition-all duration-300 relative py-1 hover:text-blue-600 ${
                isActive ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 font-medium'
              }`
            }
          >
            Shop
          </NavLink>
          {userInfo && (
            <NavLink 
              to="/orders" 
              className={({ isActive }) => 
                `transition-all duration-300 relative py-1 hover:text-blue-600 ${
                  isActive ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 font-medium'
                }`
              }
            >
              Orders
            </NavLink>
          )}
          {userInfo && userInfo.isAdmin && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `flex items-center gap-1.5 transition-all duration-300 relative py-1 hover:text-blue-700 ${
                  isActive ? 'text-blue-700 font-bold border-b-2 border-blue-700' : 'text-blue-600 font-semibold'
                }`
              }
            >
              <ShieldCheck size={14} /> Admin
            </NavLink>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4">
        {/* Modern Split-Glass Capsule Search Button */}
        <div 
          onClick={handleSearchTrigger}
          className="flex items-center gap-2.5 bg-slate-50/60 hover:bg-slate-100/80 pl-3 pr-2.5 py-1.5 rounded-full border border-slate-200/50 shadow-sm cursor-pointer select-none text-slate-500 hover:text-slate-700 hover:border-slate-300/80 transition-all duration-150"
        >
          <Search size={15} className="shrink-0" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-3.5 w-[1px] bg-slate-200"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
              Ctrl K
            </span>
          </div>
        </div>

        <Link to="/cart" className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 relative">
          <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 sm:top-1 sm:right-1 bg-blue-600 text-white text-[8px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <Link 
          to={userInfo ? "/profile" : "/login"} 
          className="hidden md:flex p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 items-center gap-2"
        >
          {userInfo?.profilePic ? (
            <img src={userInfo.profilePic} alt={userInfo.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
          ) : (
            <User size={18} className="sm:w-5 sm:h-5" />
          )}
          {userInfo && <span className="text-sm font-semibold hidden lg:block">{userInfo.name.split(' ')[0]}</span>}
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Mobile responsive drawer panel */}
      {createPortal(
        <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[99] backdrop-blur-sm md:hidden"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white backdrop-blur-md z-[100] shadow-2xl border-l border-slate-100 flex flex-col p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <span className="font-black text-slate-900 tracking-tighter text-xl">KORE</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-base font-bold text-slate-600 flex-grow">
                <NavLink 
                  to="/home" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `transition-colors duration-150 py-1 ${isActive ? 'text-blue-600 font-extrabold' : 'hover:text-blue-600'}`
                  }
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `transition-colors duration-150 py-1 ${isActive ? 'text-blue-600 font-extrabold' : 'hover:text-blue-600'}`
                  }
                >
                  Shop
                </NavLink>
                {userInfo && (
                  <NavLink 
                    to="/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `transition-colors duration-150 py-1 ${isActive ? 'text-blue-600 font-extrabold' : 'hover:text-blue-600'}`
                    }
                  >
                    Orders
                  </NavLink>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavLink 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-1.5 transition-colors duration-150 py-1 ${isActive ? 'text-blue-700 font-extrabold' : 'text-blue-600'}`
                    }
                  >
                    <ShieldCheck size={16} /> Admin Panel
                  </NavLink>
                )}
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                {userInfo ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-1">
                      {userInfo.profilePic ? (
                        <img src={userInfo.profilePic} alt={userInfo.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {userInfo.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-slate-800">{userInfo.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </nav>
  );
};

export default Navbar;
