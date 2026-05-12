import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products, using mock data:', error);
        // Fallback mock data
        setProducts([
          {
            _id: '1',
            name: 'Airpods Wireless Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
            description: 'Bluetooth technology lets you connect it with compatible devices wirelessly.',
            category: 'Electronics',
            price: 89.99,
            countInStock: 10,
            rating: 4.5,
          },
          {
            _id: '2',
            name: 'iPhone 13 Pro 256GB',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
            description: 'The world’s fastest smartphone chip. Exceptional durability.',
            category: 'Electronics',
            price: 599.99,
            countInStock: 7,
            rating: 4.8,
          },
          {
            _id: '3',
            name: 'Logitech G-Series Mouse',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
            description: 'Get a better handle on your games with this Logitech gaming mouse.',
            category: 'Electronics',
            price: 49.99,
            countInStock: 0,
            rating: 4.2,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Our Collection</h1>
          <p className="text-slate-500">Explore our premium selection of tech and lifestyle products.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="glass-card aspect-[4/6] animate-pulse bg-slate-200/50" />
          ))
        ) : (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
