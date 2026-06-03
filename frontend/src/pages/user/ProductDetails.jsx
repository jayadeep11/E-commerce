import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ChevronLeft, Star, ShoppingCart, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('description');

  // Sync with Cart State
  const existItem = cartItems.find((x) => x._id === id);
  useEffect(() => {
    if (existItem) {
      setIsAdded(true);
      setQty(existItem.qty);
    } else {
      setIsAdded(false);
      setQty(product?.countInStock === 0 ? 0 : 1);
    }
  }, [existItem, product, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        if (data.countInStock === 0) setQty(0);
      } catch (error) {
        console.error('Error fetching product:', error);
        
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
    setIsAdded(true);
    
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center font-black text-slate-400">Loading Product...</div>;
  if (!product) return <div className="h-[60vh] flex items-center justify-center font-black text-slate-400 text-2xl">Product not found</div>;

  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-4 pb-12 md:py-12">
      <Link to="/shop" className="flex items-center gap-2 text-slate-400 hover:text-black transition-all mb-4 md:mb-8 group font-bold text-xs uppercase tracking-widest">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </Link>

      <div className="grid md:grid-cols-[480px_1fr] gap-12 lg:gap-16 items-center">
        {}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 h-[320px] md:h-auto md:max-h-[520px] w-[80%] mx-auto md:w-full flex items-center justify-center bg-slate-50"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            onError={(e) => {
              e.target.onerror = null;
              const fallbacks = {
                Men: '/assets/ui/dept-men.jpg',
                Women: '/assets/ui/dept-women.jpg',
                Kids: '/assets/ui/dept-kids.jpg',
                Unisex: '/assets/ui/dept-acc.jpg'
              };
              e.target.src = fallbacks[product.gender] || fallbacks['Unisex'];
            }}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
          />
        </motion.div>

        {}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col py-2"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] bg-slate-100 px-2.5 py-1 rounded-full">{product.category}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{product.brand}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{product.name}</h1>
          
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
            <div className="text-2xl font-black text-slate-900">₹{product.price}</div>
            {product.mrp > product.price && (
              <>
                <div className="text-lg font-bold text-slate-300 line-through">₹{product.mrp}</div>
                <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                  Save {discountPercent}%
                </div>
              </>
            )}
          </div>
          
          <p className="text-slate-500 leading-relaxed mb-6 text-base font-medium">
            {product.description}
          </p>

          <div className="mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Availability: </span>
            <span className={`text-xs font-bold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="space-y-6 max-w-sm">
            {!isAdded ? (
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={18} />
                {product.countInStock > 0 ? 'Add to Collection' : 'Out of Stock'}
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-[10px] font-black text-slate-800 uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                      <button 
                        onClick={() => {
                          addToCart(product, -1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all text-slate-800 font-bold"
                      >-</button>
                      <span className="w-10 text-center font-black text-slate-900 text-xs">{qty}</span>
                      <button 
                        onClick={() => {
                          if (qty >= product.countInStock) {
                            showToast('error', `Sorry, only ${product.countInStock} units available in stock.`);
                            return;
                          }
                          addToCart(product, 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all text-slate-800 font-bold"
                      >+</button>
                    </div>
                  </div>
                  <Link to="/cart" className="text-[10px] font-black text-slate-800 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                    View in Cart
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-800 rounded-lg"><Truck size={18} /></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-800 rounded-lg"><ShieldCheck size={18} /></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Secure Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-800 rounded-lg"><RefreshCcw size={18} /></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">14 Days Return</span>
            </div>
          </div>
        </motion.div>
      </div>

      {}
      <div className="mt-12 sm:mt-24 pt-8 sm:pt-12 border-t border-slate-100">
        <div className="flex items-center gap-6 sm:gap-12 mb-10 sm:mb-16 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all relative whitespace-nowrap ${
                activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {}
        <AnimatePresence mode="wait">
          {activeTab === 'description' ? (
            <motion.div
              key="description"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="max-w-4xl"
            >
              <p className="text-slate-500 leading-relaxed font-medium text-base lg:text-lg">
                {product.description}
                <br /><br />
                Crafted for those who value both aesthetics and functionality, this piece embodies the core philosophy of our premium collection. Each detail has been meticulously considered to ensure a perfect balance between contemporary design and timeless appeal.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <Star size={24} className="text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-100"></div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{product.numReviews} Verified Reviews</span>
                </div>
              </div>

              {product.reviews && product.reviews.length === 0 ? (
                <div className="bg-slate-50 rounded-[2rem] p-12 text-center">
                  <p className="text-slate-400 font-bold text-lg mb-2">No reviews yet.</p>
                  <p className="text-slate-400 text-sm">Be the first to share your experience with this item!</p>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl">
                  {product.reviews && product.reviews.map((review, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={review._id} 
                      className="bg-white border border-slate-100 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-hidden">
                          {review.user?.profilePic ? (
                            <img src={review.user.profilePic} alt={review.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm shrink-0" />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs sm:text-sm">
                              {review.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-grow">
                            <p className="font-black text-slate-900 truncate">{review.name}</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductDetails;
