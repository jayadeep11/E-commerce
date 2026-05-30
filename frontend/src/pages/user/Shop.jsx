import { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProductCard from '../../components/product/ProductCard';
import { Search, Filter, X, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(30);
  
  // Mobile filter toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || 'All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', 'Shirts', 'Tshirts', 'Accessories', 'Pants', 'Footwear'];
  const genderOptions = ['All', 'Men', 'Women', 'Kids'];

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const genderParam = searchParams.get('gender');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
    if (genderParam) {
      setSelectedGender(genderParam);
    } else {
      setSelectedGender('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedGender !== 'All') {
      result = result.filter(p => p.gender === selectedGender);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    setFilteredProducts(result);
    setVisibleCount(30);
  }, [searchQuery, selectedCategory, selectedGender, sortBy, products]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedGender('All');
    setSortBy('default');
    setVisibleCount(30);
  };

  const currentProducts = filteredProducts.slice(0, visibleCount);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    // Add more products when scrolled within 150px of the bottom
    if (scrollHeight - scrollTop <= clientHeight + 150) {
      if (visibleCount < filteredProducts.length) {
        setVisibleCount(prev => prev + 30);
      }
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full border-r border-gray-100 bg-white">
      <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between lg:hidden">
         <h2 className="text-xl font-bold">Filters</h2>
         <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500 hover:text-black">
           <X size={24} />
         </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">

        {/* Sort By */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Sort By</h3>
          <div className="relative w-full">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg py-2.5 pl-9 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white font-medium cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Department */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Department</h3>
          <div className="flex flex-col space-y-3">
            {genderOptions.map(gender => (
               <label key={gender} className="flex items-center cursor-pointer group">
                 <input 
                   type="radio" 
                   name="gender" 
                   className="w-4 h-4 text-black border-gray-300 focus:ring-black transition-all"
                   checked={selectedGender === gender}
                   onChange={() => setSelectedGender(gender)}
                 />
                 <span className={`ml-3 text-sm transition-colors ${selectedGender === gender ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                   {gender}
                 </span>
               </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-8 border-t border-gray-100 pt-8">
          <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Category</h3>
          <div className="flex flex-col space-y-3">
            {categories.map(cat => (
               <label key={cat} className="flex items-center cursor-pointer group">
                 <input 
                   type="radio" 
                   name="category" 
                   className="w-4 h-4 text-black border-gray-300 focus:ring-black transition-all"
                   checked={selectedCategory === cat}
                   onChange={() => setSelectedCategory(cat)}
                 />
                 <span className={`ml-3 text-sm transition-colors ${selectedCategory === cat ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                   {cat}
                 </span>
               </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100">
        <button 
          onClick={resetFilters}
          className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-80px)] bg-white flex overflow-hidden w-full">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-full z-10 shadow-[1px_0_10px_rgba(0,0,0,0.02)] relative">
        <SidebarContent />
      </div>

      {/* Main Product Area */}
      <div className="flex-1 h-full overflow-y-auto bg-gray-50" onScroll={handleScroll}>
        <div className="p-3 xs:p-4 sm:p-6 lg:p-10 w-full max-w-full mx-auto">
          
          {/* Header & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">SHOP</h1>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 p-2.5 px-4 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} /> Filters & Sort
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="w-full h-[380px] sm:h-[420px] bg-gray-200 rounded-2xl animate-pulse" />
              ))
            ) : currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
          
          {/* Bottom Padding for scroll area */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-[300px] bg-white h-full max-w-full shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
