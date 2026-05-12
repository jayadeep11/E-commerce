import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { userInfo } = useAuth();

  return (
    <nav className="glass-nav px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-black gradient-text tracking-tighter">
          KORE
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          {userInfo && userInfo.isAdmin && (
            <Link to="/admin" className="text-blue-600 font-bold flex items-center gap-1.5 hover:text-blue-700 transition-colors">
              <ShieldCheck size={14} /> Admin
            </Link>
          )}
          <Link to="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <Search size={20} />
        </button>
        <Link to="/cart" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 relative">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <Link 
          to={userInfo ? "/profile" : "/login"} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 flex items-center gap-2"
        >
          <User size={20} />
          {userInfo && <span className="text-sm font-semibold hidden lg:block">{userInfo.name.split(' ')[0]}</span>}
        </Link>
        <button className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
