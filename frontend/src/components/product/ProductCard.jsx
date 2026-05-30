import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { optimizeImage } from '../../utils/cloudinary';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <motion.div 
      onClick={handleCardClick}
      whileHover={{ y: -10 }}
      className="glass-card overflow-hidden group flex flex-col w-full h-full cursor-pointer"
    >
      <div className="relative aspect-[4/5] sm:aspect-[4/5] overflow-hidden shrink-0">
        <img 
          src={optimizeImage(product.image, 500)} 
          alt={product.name} 
          onError={(e) => {
            e.target.onerror = null;
            const fallbackImages = {
              Men: '/assets/ui/dept-men.jpg',
              Women: '/assets/ui/dept-women.jpg',
              Kids: '/assets/ui/dept-kids.jpg',
              Unisex: '/assets/ui/dept-acc.jpg'
            };
            e.target.src = fallbackImages[product.gender] || fallbackImages['Unisex'];
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {product.gender && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 border border-slate-100/50">
            {product.gender}
          </div>
        )}

        {product.countInStock === 0 && (
          <div className="absolute top-3 left-3 bg-slate-900 text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <span className="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest line-clamp-1 truncate mr-1">{product.category}</span>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Star size={10} className="text-yellow-400 fill-yellow-400 w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`} className="text-xs sm:text-base font-bold text-slate-900 mb-0.5 sm:mb-2 hover:text-blue-600 transition-colors line-clamp-1 sm:line-clamp-2">
          {product.name}
        </Link>
        
        <p className="text-slate-500 text-[9px] sm:text-xs line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-2 leading-relaxed flex-grow hidden sm:block">
          {product.description}
        </p>
        <div className="flex-grow sm:hidden"></div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs sm:text-lg font-bold text-slate-900">₹{product.price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="p-1 sm:p-2.5 bg-blue-600 text-white rounded-md sm:rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-90 relative z-20"
          >
            <ShoppingCart size={12} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
