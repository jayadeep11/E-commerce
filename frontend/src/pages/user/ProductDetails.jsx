import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Star, ShoppingCart, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback for demo
        setProduct({
          _id: id,
          name: 'Airpods Wireless Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
          description: 'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working.',
          category: 'Electronics',
          price: 89.99,
          countInStock: 10,
          rating: 4.5,
          numReviews: 12,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-[60vh] flex items-center justify-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/shop" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-10 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card aspect-square overflow-hidden"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">{product.category}</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">{product.name}</h1>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} 
                />
              ))}
              <span className="text-sm font-bold text-slate-900 ml-2">{product.rating}</span>
            </div>
            <span className="text-sm text-slate-500 border-l border-slate-200 pl-6">{product.numReviews} Reviews</span>
          </div>

          <div className="text-3xl font-bold text-slate-900 mb-8">${product.price}</div>
          
          <p className="text-slate-600 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-900">Quantity</span>
              <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-slate-200 transition-colors"
                >-</button>
                <span className="px-6 py-2 font-bold">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  className="px-4 py-2 hover:bg-slate-200 transition-colors"
                >+</button>
              </div>
              <span className="text-sm text-slate-500">{product.countInStock} available</span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
          >
            <ShoppingCart size={22} />
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Truck size={20} /></div>
              <span className="text-xs font-medium text-slate-600">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShieldCheck size={20} /></div>
              <span className="text-xs font-medium text-slate-600">Secure Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><RefreshCcw size={20} /></div>
              <span className="text-xs font-medium text-slate-600">14 Days Return</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
