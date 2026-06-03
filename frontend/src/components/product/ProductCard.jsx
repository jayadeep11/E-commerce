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
    <div 
      onClick={handleCardClick}
      className="group flex flex-col w-full h-full cursor-pointer bg-white"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Rating Badge */}
        {product.numReviews > 0 && (
          <div className="absolute bottom-2 left-2 bg-white px-1.5 py-0.5 flex items-center gap-1 rounded-sm text-[10px] font-bold text-gray-800 shadow-sm">
            {product.rating} <Star size={10} className="text-teal-600 fill-teal-600" />
          </div>
        )}

        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
             <span className="bg-white text-gray-900 text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Out of Stock</span>
          </div>
        )}

        {/* Minimal Add to Cart */}
        <button 
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-900 hover:text-white transition-all disabled:opacity-0 disabled:cursor-not-allowed z-10"
        >
          <ShoppingCart size={14} />
        </button>
      </div>

      <div className="pt-3 pb-2 flex flex-col flex-grow items-center text-center px-1">
        {/* Brand/Category Name */}
        <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest truncate mb-0.5 w-full">
          {product.brand || product.category}
        </h3>
        
        {/* Product Name */}
        <p className="text-[10px] sm:text-xs text-gray-500 truncate mb-1 w-full">
          {product.name}
        </p>
        
        <div className="flex-grow"></div>

        {/* Pricing */}
        <div className="flex items-center justify-center gap-2 mt-auto w-full">
          <span className="text-xs sm:text-sm font-bold text-gray-900">₹{product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
