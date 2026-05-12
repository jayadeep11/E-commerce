import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-8">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-10">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <motion.div 
              layout
              key={item._id} 
              className="glass-card p-6 flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <Link to={`/product/${item._id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-slate-500 mt-1">{item.category}</p>
              </div>

              <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                <button 
                  onClick={() => addToCart(item, -1)}
                  disabled={item.qty <= 1}
                  className="px-3 py-1 hover:bg-slate-200 transition-colors disabled:opacity-30"
                ><Minus size={14} /></button>
                <span className="px-4 font-bold text-sm">{item.qty}</span>
                <button 
                  onClick={() => addToCart(item, 1)}
                  className="px-3 py-1 hover:bg-slate-200 transition-colors"
                ><Plus size={14} /></button>
              </div>

              <div className="text-lg font-bold text-slate-900 w-24 text-center sm:text-right">
                ${(item.price * item.qty).toFixed(2)}
              </div>

              <button 
                onClick={() => removeFromCart(item._id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </div>

            <button className="btn-primary w-full py-4 flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={20} />
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
              Secure checkout powered by LookBetter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
