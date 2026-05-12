import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
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
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        if (data.countInStock === 0) setQty(0);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback for demo
        const fallback = {
          _id: id,
          name: 'Premium Lifestyle Piece',
          brand: 'Urban Aura',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
          description: 'A timeless essential designed for ultimate comfort and sophisticated style.',
          category: 'Streetwear',
          price: 29.99,
          mrp: 49.99,
          countInStock: 50,
          rating: 4.8,
          numReviews: 124,
        };
        setProduct(fallback);
        if (fallback.countInStock === 0) setQty(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.countInStock === 0) return;
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center font-black text-slate-400">Loading Product...</div>;
  if (!product) return <div className="h-[60vh] flex items-center justify-center font-black text-slate-400 text-2xl">Product not found</div>;

  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link to="/shop" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-8 group font-bold text-xs uppercase tracking-widest">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </Link>

      <div className="grid md:grid-cols-[450px_1fr] gap-12 lg:gap-20 items-start">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/30 sticky top-24"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col py-2"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-2.5 py-1 rounded-full">{product.category}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{product.brand}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                />
              ))}
              <span className="text-xs font-black text-slate-900 ml-1.5">{product.rating}</span>
            </div>
            <div className="w-px h-3 bg-slate-200"></div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{product.numReviews} Reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <div className="text-3xl font-black text-slate-900">${product.price}</div>
            {product.mrp > product.price && (
              <>
                <div className="text-lg font-bold text-slate-300 line-through">${product.mrp}</div>
                <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                  Save {discountPercent}%
                </div>
              </>
            )}
          </div>
          
          <p className="text-slate-500 leading-relaxed mb-8 text-sm font-medium">
            {product.description}
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-5 pt-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty</span>
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-0.5">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  onDoubleClick={() => setQty(Math.max(1, qty - 10))}
                  disabled={product.countInStock === 0 || qty <= 1}
                  title="Double click to -10"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow transition-all disabled:opacity-20"
                >-</button>
                <span className="w-10 text-center font-black text-slate-900 text-xs">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  onDoubleClick={() => setQty(Math.min(product.countInStock, qty + 10))}
                  disabled={product.countInStock === 0 || qty >= product.countInStock}
                  title="Double click to +10"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow transition-all disabled:opacity-20"
                >+</button>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${product.countInStock === 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {product.countInStock === 0 ? 'Sold Out' : `${product.countInStock} In Stock`}
              </span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3"
          >
            <ShoppingCart size={18} />
            {product.countInStock > 0 ? 'Add to Collection' : 'Out of Stock'}
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

      {/* Reviews Section */}
      <div className="mt-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Customer Feedback</h2>
            <p className="text-slate-500 font-medium">Verified stories from our luxury collection.</p>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-2xl flex items-center gap-4 border border-slate-100">
             <div className="flex items-center gap-1">
               <Star size={20} className="text-amber-400 fill-amber-400" />
               <span className="text-xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
             </div>
             <div className="w-px h-6 bg-slate-200"></div>
             <span className="text-sm font-bold text-slate-500">{product.numReviews} Reviews</span>
          </div>
        </div>

        {product.reviews && product.reviews.length === 0 ? (
          <div className="bg-slate-50 rounded-[2.5rem] p-16 text-center">
            <p className="text-slate-400 font-bold text-lg mb-2">No reviews yet.</p>
            <p className="text-slate-400 text-sm">Be the first to share your experience with this item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews && product.reviews.map((review, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={review._id} 
                className="bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{review.name}</p>
                      <p className="text-xs text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium italic">"{review.comment}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
