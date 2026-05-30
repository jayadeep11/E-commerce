import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Package, Plus, Edit2, Trash2, Tag, Layers, X, Save, Loader2, Upload, ShoppingBag, Info, DollarSign, Box, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: 0,
    mrp: 0,
    description: '',
    category: 'Clothing',
    gender: 'Unisex',
    countInStock: 10,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const editHandler = (product) => {
    setEditMode(true);
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      mrp: product.mrp || product.price,
      description: product.description,
      category: product.category,
      gender: product.gender || 'Unisex',
      countInStock: product.countInStock,
      image: product.image
    });
    setIsModalOpen(true);
  };

  const closeHandler = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditProductId(null);
    setFormData({
      name: '',
      brand: '',
      price: 0,
      mrp: 0,
      description: '',
      category: 'Clothing',
      gender: 'Unisex',
      countInStock: 10,
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (editMode) {
        await api.put(`/api/products/${editProductId}`, formData);
      } else {
        await api.post('/api/products', formData);
      }

      await fetchProducts();
      closeHandler();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Inventory...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Product Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your shop's premium collection.</p>
        </div>
        <button 
          onClick={() => {
            setEditMode(false);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            key={product._id} 
            className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <div className="aspect-square overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => editHandler(product)}
                  className="p-3 bg-white/90 backdrop-blur text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteHandler(product._id)}
                  className="p-3 bg-white/90 backdrop-blur text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Layers size={12} /> {product.category}
                </span>
                <span className="text-xl font-black text-slate-900">₹{product.price.toFixed(2)}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className="text-xs font-bold text-slate-400">{product.countInStock} Units Available</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-white z-[150] overflow-hidden flex flex-col"
          >
            <div className="px-8 lg:px-12 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-6">
                <button 
                  onClick={closeHandler}
                  className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100"
                >
                  <X size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editMode ? 'Product Modification' : 'Product Creation'}</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={closeHandler}
                  type="button"
                  className="px-6 py-3 text-slate-500 font-bold text-xs hover:text-slate-900 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  form="product-form"
                  disabled={createLoading}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  {createLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editMode ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              
              <div className="flex-grow overflow-y-auto p-8 lg:p-16 scrollbar-hide">
                <form id="product-form" onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-12">
                  <section className="space-y-6">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full"></div> Core Information
                    </h3>
                    
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Signature Urban Parka"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Volt Armor"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            value={formData.brand}
                            onChange={(e) => setFormData({...formData, brand: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sale Price ($)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MRP / Original ($)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            value={formData.mrp}
                            onChange={(e) => setFormData({...formData, mrp: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Inventory</label>
                          <input 
                            type="number" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            value={formData.countInStock}
                            onChange={(e) => setFormData({...formData, countInStock: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full"></div> Media & Categorization
                    </h3>

                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                            <option>Clothing</option>
                            <option>Accessories</option>
                            <option>Footwear</option>
                            <option>Lifestyle</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department (Gender)</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          >
                            <option>Men</option>
                            <option>Women</option>
                            <option>Kids</option>
                            <option>Unisex</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail URL</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            placeholder="Paste image URL..."
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full"></div> Product Story
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        rows="5"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 resize-none"
                        placeholder="Describe the materials and fit..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </section>
                </form>
              </div>

              {}
              <div className="w-full lg:w-[380px] bg-slate-50 border-l border-slate-100 p-8 flex flex-col items-center justify-center relative">
                <div className="absolute top-8 left-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Preview</p>
                </div>

                <motion.div 
                  key={formData.image}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={formData.image} 
                      className="w-full h-full object-cover"
                      alt="Preview" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                        {formData.gender} / {formData.category}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-slate-900">₹{formData.price}</span>
                        {formData.mrp > formData.price && (
                          <span className="text-[10px] font-bold text-slate-300 line-through">₹{formData.mrp}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{formData.brand || "Brand Name"}</p>
                    <h4 className="font-bold text-slate-900 truncate">{formData.name || "Product Name"}</h4>
                  </div>
                </motion.div>

                <div className="mt-8 w-full p-4 bg-white/50 rounded-2xl border border-slate-100 border-dashed text-center">
                  <p className="text-[10px] font-bold text-slate-400 italic">"Design is not just what it looks like and feels like. Design is how it works."</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
