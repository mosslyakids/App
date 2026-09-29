import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon, 
  Package, 
  Search,
  LogOut,
  Key,
  Shield,
  X
} from 'lucide-react';

const COMMON_SIZES = [
  '0-3M', '3-6M', '6-12M', '12-18M', 
  '1-2Y', '2-3Y', '3-4Y', '4-5Y', 
  '5-6Y', '7-8Y', '9-10Y', '11-12Y'
];

const CATEGORIES = [
  'Rompers & Sets',
  'Dresses',
  'T-Shirts',
  'Jackets',
  'Loungewear & Sets',
  'Hoodies',
  'Shorts & Bottoms',
  'Footwear',
  'Party Wear'
];

export default function AdminDashboard({ 
  products, 
  onAddProduct, 
  onDeleteProduct, 
  onBackToStore,
  onResetToDefaults,
  onLogout
}) {
  // Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState('girls'); // 'boys' | 'girls'
  const [category, setCategory] = useState('Rompers & Sets');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [badge, setBadge] = useState('New Arrival');
  const [selectedSizes, setSelectedSizes] = useState(['2-3Y', '4-5Y']);
  const [description, setDescription] = useState('');
  const [imageMode, setImageMode] = useState('file'); // 'file' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  // Feedback
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  
  // Admin Security Settings State
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [directAccess, setDirectAccess] = useState(() => {
    return localStorage.getItem('mosslya_admin_direct_access') === 'true';
  });

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPassInput.trim() || newPassInput.length < 4) {
      setPassMessage('Password must be at least 4 characters long.');
      return;
    }
    localStorage.setItem('mosslya_admin_password', newPassInput.trim());
    setPassMessage('Admin password updated successfully!');
    setTimeout(() => {
      setPassMessage('');
      setIsChangePassOpen(false);
      setNewPassInput('');
    }, 1800);
  };

  const handleToggleDirectAccess = () => {
    const nextVal = !directAccess;
    setDirectAccess(nextVal);
    localStorage.setItem('mosslya_admin_direct_access', nextVal ? 'true' : 'false');
  };

  // Handle local image file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 8MB.');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) => 
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a product name.');
      return;
    }

    if (!price || Number(price) <= 0) {
      setError('Please enter a valid product price.');
      return;
    }

    if (selectedSizes.length === 0) {
      setError('Please select at least one available size.');
      return;
    }

    const finalImage = imageMode === 'url' ? imageUrl.trim() : imagePreview;
    if (!finalImage) {
      setError('Please upload an image file or provide an image URL.');
      return;
    }

    const newProduct = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      gender,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.4),
      rating: 5.0,
      reviews: 1,
      badge: badge.trim() || 'New Arrival',
      image: finalImage,
      description: description.trim() || `Premium quality kids ${category.toLowerCase()} crafted from gentle organic fabric.`,
      sizes: selectedSizes,
      colors: ['Default'],
      inStock: true
    };

    onAddProduct(newProduct);
    setSuccessMessage(`Product "${newProduct.name}" has been uploaded & published to the live store!`);

    // Reset Form
    setName('');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setImagePreview('');
    setImageUrl('');
    setSelectedSizes(['2-3Y', '4-5Y']);

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const filteredInventory = products.filter((p) => 
    p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.gender.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const boysCount = products.filter((p) => p.gender === 'boys').length;
  const girlsCount = products.filter((p) => p.gender === 'girls').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Storefront Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <Package className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                Admin Console
              </span>
              <span className="text-xs text-slate-500 font-semibold">• Mosslya Kids Store</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Upload & Manage Products
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Admin Security / Password Configuration */}
          <button
            type="button"
            onClick={() => setIsChangePassOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all shadow-sm"
            title="Configure Admin Password and Access Settings"
          >
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span>Admin Security</span>
          </button>

          {/* Logout / Lock Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-rose-200 transition-all shadow-sm"
              title="Lock Admin Console & Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Lock & Logout</span>
            </button>
          )}

          {/* View Live Storefront */}
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-2xl shadow-md transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>View Live Storefront</span>
          </button>
        </div>
      </div>

      {/* Inventory Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Catalog</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-0.5">{products.length} Outfits</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            📦
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase">Boys Inventory</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-0.5">{boysCount} Items</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            👦
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 uppercase">Girls Inventory</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-0.5">{girlsCount} Items</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
            👧
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 font-bold text-sm shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Upload Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Upload Form Column */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-black text-slate-900 font-display">
              Upload New Outfit
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mosslya Organic Safari Baby Romper"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Gender & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender Target <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('boys')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
                      gender === 'boys'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>👦 Boys</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girls')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
                      gender === 'girls'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>👧 Girls</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Clothing Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Badge Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="699"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  MRP / Strikeout Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="1099"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Promotional Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Arrival"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* Available Sizes Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Available Sizes ({selectedSizes.length} selected) <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleToggleSize(size)}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload Mode & Input */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Product Image <span className="text-rose-500">*</span>
                </span>
                <div className="inline-flex bg-slate-200 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setImageMode('file')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      imageMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      imageMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Paste Image URL
                  </button>
                </div>
              </div>

              {imageMode === 'file' ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-rose-400 bg-white rounded-xl p-5 text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="admin-product-file"
                    className="hidden"
                  />
                  <label
                    htmlFor="admin-product-file"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose photo from computer / mobile
                    </p>
                    <p className="text-[10px] text-slate-500">
                      PNG, JPG, WebP up to 8MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe fabrics, features, softness, and special details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {error}
              </p>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upload & Publish to Mosslya Store</span>
            </button>

          </form>
        </div>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3 text-center">
              Live Product Card Preview
            </span>

            {/* Preview Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
              <div className="relative aspect-[4/4.5] bg-slate-200 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <ImageIcon className="w-10 h-10 mx-auto mb-1 text-slate-300" />
                    <span className="text-xs font-bold">Image preview will appear here</span>
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm ${
                  gender === 'boys' ? 'bg-blue-600 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {gender === 'boys' ? '👦 Boys' : '👧 Girls'}
                </span>
                {badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                    {badge}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {name || 'Product Title'}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black font-mono text-slate-900">
                    ₹{price || '699'}
                  </span>
                  {originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-mono">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedSizes.slice(0, 4).map((s) => (
                    <span key={s} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                  {selectedSizes.length > 4 && (
                    <span className="text-[9px] text-slate-500 font-bold">
                      +{selectedSizes.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-4">
              When published, this outfit will be immediately viewable in both the catalog and the enlarged detail view.
            </p>
          </div>
        </div>

      </div>

      {/* Existing Product Inventory Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              Store Inventory Catalog ({products.length})
            </h2>
            <p className="text-xs text-slate-500">
              Manage all active clothing pieces, rompers, and sets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search inventory */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter inventory..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 w-48 sm:w-60"
              />
            </div>

            <button
              onClick={onResetToDefaults}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
              title="Reset catalog back to initial default items"
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Inventory List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="py-3 px-3">Item Photo</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Gender</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Sizes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </td>

                  <td className="py-2.5 px-3 font-bold text-slate-900 max-w-xs truncate">
                    {item.name}
                    {item.badge && (
                      <span className="ml-1.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    <span className={`font-black text-[10px] px-2 py-0.5 rounded-full ${
                      item.gender === 'boys' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.gender === 'boys' ? 'Boys' : 'Girls'}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 font-medium text-slate-600">
                    {item.category}
                  </td>

                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    ₹{item.price}
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {item.sizes.join(', ')}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onDeleteProduct(item.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl border border-rose-100 transition-colors"
                      title="Delete product from store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Admin Security Settings Modal */}
      {isChangePassOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsChangePassOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black font-display">Admin Security & Access</h3>
              </div>
              <button
                onClick={() => setIsChangePassOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Direct Open Toggle Option */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-900">Direct Open Access</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {directAccess 
                      ? 'Admin tab currently opens directly without asking for password on this device.'
                      : 'Admin tab requires password login before opening.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDirectAccess}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    directAccess 
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {directAccess ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Set New Admin Password
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new admin password..."
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Current default is <strong className="font-mono text-slate-700">admin123</strong>.
                  </p>
                </div>

                {passMessage && (
                  <p className={`text-xs font-bold p-3 rounded-xl ${
                    passMessage.includes('successfully') 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {passMessage}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePassOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
