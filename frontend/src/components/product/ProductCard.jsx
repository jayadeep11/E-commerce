import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-card overflow-hidden group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {product.countInStock === 0 && (
          <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold text-slate-500">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`} className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <span className="text-xl font-bold text-slate-900">${product.price}</span>
          <button 
            onClick={() => addToCart(product, 1)}
            disabled={product.countInStock === 0}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-90"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
