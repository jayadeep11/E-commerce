import { Link } from 'react-router-dom';
import { MessageCircle, Send, Camera, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-bold text-white mb-6 block">
            LUMINA
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Elevating your lifestyle with premium products and seamless shopping experiences.
          </p>
          <div className="flex gap-4">
            <MessageCircle size={18} className="hover:text-white cursor-pointer transition-colors" />
            <Send size={18} className="hover:text-white cursor-pointer transition-colors" />
            <Camera size={18} className="hover:text-white cursor-pointer transition-colors" />
            <Code2 size={18} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-6">Shop</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
            <li><Link to="/new" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/deals" className="hover:text-white transition-colors">Deals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Newsletter</h4>
          <p className="text-sm mb-4">Subscribe to get special offers and news.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Lumina E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
