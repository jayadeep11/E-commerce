import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { userInfo } = useAuth();

  const handleSearchTrigger = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  return (
    <nav className="glass-nav px-2 xs:px-4 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-8">
        <Link to="/" className="text-lg xs:text-xl sm:text-2xl font-black gradient-text tracking-tighter flex-shrink-0">
          KORE
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link to="/home" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          {userInfo && userInfo.isAdmin && (
            <Link to="/admin" className="text-blue-600 font-bold flex items-center gap-1.5 hover:text-blue-700 transition-colors">
              <ShieldCheck size={14} /> Admin
            </Link>
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
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 flex items-center gap-2"
        >
          <User size={18} className="sm:w-5 sm:h-5" />
          {userInfo && <span className="text-sm font-semibold hidden lg:block">{userInfo.name.split(' ')[0]}</span>}
        </Link>
        <button className="md:hidden p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
