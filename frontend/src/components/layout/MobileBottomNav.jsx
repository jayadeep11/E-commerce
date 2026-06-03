import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Search, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '../ui/AnimatedNumber';

const MobileBottomNav = () => {
  const { userInfo } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const handleSearchTrigger = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-6 py-2.5 flex justify-between items-center pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      
      <NavLink 
        to="/home" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive || location.pathname === '/' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home size={20} strokeWidth={location.pathname === '/home' || location.pathname === '/' ? 2.5 : 2} />
        <span className="text-[8px] font-black tracking-widest uppercase">Home</span>
      </NavLink>

      <button 
        onClick={handleSearchTrigger}
        className="flex flex-col items-center gap-1 transition-colors text-slate-400 hover:text-slate-600"
      >
        <Search size={20} strokeWidth={2} />
        <span className="text-[8px] font-black tracking-widest uppercase">Search</span>
      </button>

      <NavLink 
        to="/shop" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <ShoppingBag size={20} strokeWidth={location.pathname === '/shop' ? 2.5 : 2} />
        <span className="text-[8px] font-black tracking-widest uppercase">Shop</span>
      </NavLink>

      <NavLink 
        to="/cart" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors relative ${isActive ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <ShoppingCart size={20} strokeWidth={location.pathname === '/cart' ? 2.5 : 2} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
            <AnimatePresence mode="wait">
              <AnimatedNumber key={cartCount} value={cartCount} />
            </AnimatePresence>
          </span>
        )}
        <span className="text-[8px] font-black tracking-widest uppercase">Cart</span>
      </NavLink>

      <NavLink 
        to={userInfo ? "/profile" : "/login"} 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
      >
        {userInfo ? (
          userInfo.profilePic ? (
            <img 
              src={userInfo.profilePic} 
              alt={userInfo.name} 
              className={`w-[20px] h-[20px] rounded-full object-cover ring-2 ring-offset-1 transition-all ${location.pathname === '/profile' ? 'ring-black' : 'ring-transparent'}`} 
            />
          ) : (
            <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center font-black text-[9px] ring-2 ring-offset-1 transition-all ${location.pathname === '/profile' ? 'bg-black text-white ring-black' : 'bg-slate-100 text-slate-600 ring-transparent'}`}>
              {userInfo.name.charAt(0)}
            </div>
          )
        ) : (
          <User size={20} strokeWidth={location.pathname === '/login' || location.pathname === '/profile' ? 2.5 : 2} />
        )}
        <span className="text-[8px] font-black tracking-widest uppercase">Profile</span>
      </NavLink>
      
    </div>
  );
};

export default MobileBottomNav;
