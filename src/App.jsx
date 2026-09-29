import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CustomerMobileModal from './components/CustomerMobileModal';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ProductDetailPage from './components/ProductDetailPage';
import ImageEnlargeModal from './components/ImageEnlargeModal';
import DownloadAppModal from './components/DownloadAppModal';
import AdminLoginModal from './components/AdminLoginModal';
import { PRODUCTS } from './data/products';
import { 
  Filter, 
  ArrowUpDown, 
  ShoppingBag, 
  Phone, 
  CheckCircle, 
  X,
  Download,
  Settings,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation View State: 'store' | 'admin' | 'detail'
  const [currentView, setCurrentView] = useState('store');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Admin Authentication & Login Modal State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('mosslya_admin_auth') === 'true';
  });

  // Enlarged Image Lightbox State
  const [enlargedProduct, setEnlargedProduct] = useState(null);

  // Download / Install App Modal State
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Dynamic Product Catalog State (with LocalStorage persistence)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mosslya_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return PRODUCTS;
  });

  // Customer Mobile & Profile State (with LocalStorage)
  const [customerMobile, setCustomerMobile] = useState(() => {
    return localStorage.getItem('mosslya_customer_mobile') || '';
  });
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('mosslya_customer_name') || '';
  });

  // Cart State (with LocalStorage persistence)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('mosslya_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Initial sample items showcasing real Mosslya pieces
    return [
      {
        cartItemId: 'sample-m-safari-6-12M',
        id: 'm-safari-romper',
        name: 'Mosslya Safari Friends Organic Cotton Romper',
        gender: 'boys',
        category: 'Rompers & Sets',
        price: 649,
        originalPrice: 999,
        image: '/products/mosslya-safari-romper.jpg',
        selectedSize: '6-12M',
        quantity: 1
      },
      {
        cartItemId: 'sample-m-butterfly-3-4Y',
        id: 'm-butterfly-set',
        name: 'Mosslya Pastel Butterfly Cotton Loungewear Set',
        gender: 'girls',
        category: 'Loungewear & Sets',
        price: 699,
        originalPrice: 1099,
        image: '/products/mosslya-butterfly-set.jpg',
        selectedSize: '3-4Y',
        quantity: 1
      }
    ];
  });

  // Filtering & Search
  const [activeGender, setActiveGender] = useState('all'); // 'all' | 'boys' | 'girls'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState(null);

  const productSectionRef = useRef(null);

  // PWA Install prompt listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      showToast('Mosslya Kids app installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle direct URL admin link (?admin=true or #admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || window.location.hash === '#admin') {
      const directAccess = localStorage.getItem('mosslya_admin_direct_access') === 'true';
      if (isAdminAuthenticated || directAccess) {
        setCurrentView('admin');
      } else {
        setIsAdminLoginOpen(true);
      }
    }
  }, [isAdminAuthenticated]);

  // Sync Products Catalog with LocalStorage
  useEffect(() => {
    localStorage.setItem('mosslya_products', JSON.stringify(products));
  }, [products]);

  // Sync Customer info with LocalStorage
  useEffect(() => {
    if (customerMobile) {
      localStorage.setItem('mosslya_customer_mobile', customerMobile);
    } else {
      localStorage.removeItem('mosslya_customer_mobile');
    }
    if (customerName) {
      localStorage.setItem('mosslya_customer_name', customerName);
    } else {
      localStorage.removeItem('mosslya_customer_name');
    }
  }, [customerMobile, customerName]);

  // Sync Cart with LocalStorage
  useEffect(() => {
    localStorage.setItem('mosslya_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3200);
  };

  // Admin Catalog Handlers
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Published "${newProduct.name}" to store catalog!`);
  };

  const handleDeleteProduct = (productId) => {
    const itemToDelete = products.find((p) => p.id === productId);
    const itemName = itemToDelete ? itemToDelete.name : 'Product';
    if (window.confirm(`Are you sure you want to delete "${itemName}" from the store catalog?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast(`Removed "${itemName}" from catalog.`);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all catalog items back to default collection? Any custom added items will be replaced.')) {
      setProducts(PRODUCTS);
      showToast('Catalog restored to default collection.');
    }
  };

  // Admin Access & Authentication Actions
  const handleAdminAccess = () => {
    const directAccess = localStorage.getItem('mosslya_admin_direct_access') === 'true';
    if (isAdminAuthenticated || directAccess) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = ({ rememberMe }) => {
    setIsAdminAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('mosslya_admin_auth', 'true');
    }
    setIsAdminLoginOpen(false);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Admin unlocked! Directly opening Admin Console.');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('mosslya_admin_auth');
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Admin logged out. Admin Console is now locked.');
  };

  // Cart operations
  const handleAddToCart = (product, selectedSize, quantity = 1) => {
    const size = selectedSize || product.sizes?.[0] || 'Standard';
    const cartItemId = `${product.id}-${size}`;
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          gender: product.gender,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          selectedSize: size,
          quantity: quantity
        }
      ];
    });
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${product.name}" (${size}) to cart`);
  };

  const handleUpdateQuantity = (cartItemId, newQuantity, fallbackItem = null) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prevItems) => {
      const exists = prevItems.some((i) => i.cartItemId === cartItemId);
      if (!exists && fallbackItem) {
        return [...prevItems, { ...fallbackItem, quantity: newQuantity }];
      }
      return prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveItem = (cartItemId) => {
    const itemToRemove = cartItems.find((item) => item.cartItemId === cartItemId);
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.name}" from cart`);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      setCartItems([]);
      showToast('All items have been removed from your cart');
    }
  };

  const handleSaveCustomer = (mobile, name) => {
    setCustomerMobile(mobile);
    setCustomerName(name);
    if (mobile) {
      showToast(`Welcome! Mobile number ${mobile} saved.`);
    } else {
      showToast('Mobile number removed.');
    }
  };

  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
    setAppliedDiscount(0);
    setCouponCode('');
    showToast('Order confirmed! We sent an SMS with delivery tracking.');
  };

  const scrollToProducts = (gender = 'all') => {
    if (currentView !== 'store') {
      setCurrentView('store');
    }
    setActiveGender(gender);
    setSelectedCategory('All');
    setTimeout(() => {
      if (productSectionRef.current) {
        productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  const discountAmount = appliedDiscount 
    ? Math.round((cartSubtotal * appliedDiscount) / 100) 
    : 0;
  const shipping = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shipping);

  // Available subcategories based on dynamic products state
  const availableCategories = useMemo(() => {
    const filteredByGender = activeGender === 'all' 
      ? products 
      : products.filter((p) => p.gender === activeGender);
    const set = new Set(filteredByGender.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [activeGender, products]);

  // Filtered and Sorted Products based on dynamic products state
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Gender filter
      if (activeGender !== 'all' && product.gender !== activeGender) {
        return false;
      }
      // Subcategory filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesCat = product.category?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // 'featured' retains curated order
    });
  }, [activeGender, selectedCategory, searchQuery, sortBy, products]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Navigation, Admin Tab, Download App and Cart */}
      <Header
        activeGender={activeGender}
        setActiveGender={setActiveGender}
        customerMobile={customerMobile}
        customerName={customerName}
        setIsMobileModalOpen={setIsMobileModalOpen}
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onShopCategory={scrollToProducts}
        currentView={currentView}
        onNavigateToAdmin={handleAdminAccess}
        onNavigateToStore={() => { 
          setCurrentView('store'); 
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }}
        onOpenDownloadModal={() => setIsDownloadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: ADMIN DASHBOARD */}
        {currentView === 'admin' ? (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onBackToStore={() => { 
              setCurrentView('store'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            onResetToDefaults={handleResetToDefaults}
            onLogout={handleAdminLogout}
          />
        ) : currentView === 'detail' && selectedProduct ? (
          /* VIEW 2: PRODUCT DETAIL PAGE */
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => { 
              setCurrentView('store'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            onAddToCart={handleAddToCart}
            onBuyNow={() => {
              setIsCheckoutOpen(true);
            }}
            customerMobile={customerMobile}
            onOpenMobileModal={() => setIsMobileModalOpen(true)}
          />
        ) : (
          /* VIEW 3: LIVE STOREFRONT CATALOG */
          <>
            {/* Top Prompt Banners: Mobile Alerts & App Download */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 space-y-2.5">
              
              {/* Download App Banner Prompt */}
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/15 to-indigo-500/10 border border-rose-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Download className="w-5 h-5 text-white animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">
                        New App Feature
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 font-display">
                        Install & Download Mosslya Kids App
                      </h4>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                      Get 1-click home screen access, instant offline browsing, and seamless shopping on Android, iOS & PC.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleAdminAccess}
                    className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-600" />
                    <span>Admin Tab</span>
                  </button>
                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md shadow-rose-200 transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download App</span>
                  </button>
                </div>
              </div>

              {/* Customer Mobile Banner Prompt if not yet added */}
              {!customerMobile && (
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 font-display">
                        Add Customer Mobile for Instant WhatsApp & SMS Dispatch Alerts
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-600">
                        Get real-time package delivery tracking, personalized kids size recommendations, and special coupons.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileModalOpen(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all whitespace-nowrap active:scale-95"
                  >
                    + Add Customer Mobile
                  </button>
                </div>
              )}

            </div>

            {/* Hero Slider: Boys & Girls Slider */}
            <HeroSlider onSelectCategory={scrollToProducts} />

            {/* Product Catalog Section */}
            <section ref={productSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Section Heading & Category Tabs */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200/70">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      {activeGender === 'all' ? 'All Collections' : activeGender === 'boys' ? 'Boys World' : 'Girls World'}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      • {filteredProducts.length} Outfits Available
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    {activeGender === 'all' 
                      ? 'Trending Kids Apparel' 
                      : activeGender === 'boys' 
                      ? 'Boys Cool & Active Collection' 
                      : 'Girls Twirl & Party Collection'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any image to enlarge photo in high-definition zoom mode.
                  </p>
                </div>

                {/* Filter Controls: Gender Pill Toggle & Sort */}
                <div className="flex flex-wrap items-center gap-2.5">
                  
                  {/* Gender selector */}
                  <div className="inline-flex bg-slate-200/80 p-1 rounded-xl">
                    <button
                      onClick={() => { setActiveGender('all'); setSelectedCategory('All'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeGender === 'all'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => { setActiveGender('boys'); setSelectedCategory('All'); }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeGender === 'boys'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      <span>👦 Boys</span>
                    </button>
                    <button
                      onClick={() => { setActiveGender('girls'); setSelectedCategory('All'); }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeGender === 'girls'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-rose-500'
                      }`}
                    >
                      <span>👧 Girls</span>
                    </button>
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="relative inline-flex items-center">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-7 pr-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-xl text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
                    >
                      <option value="featured">Featured Picks</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated (4.8+)</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Subcategory Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1 flex-shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                  Category:
                </span>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto my-8">
                  <span className="text-4xl">🔍</span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-3 font-display">
                    No matching outfits found
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 mb-4">
                    We couldn't find anything matching "{searchQuery}". Try resetting filters or adding an outfit in the Admin tab.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setActiveGender('all');
                      }}
                      className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Upload Item (Admin)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetail={(p) => {
                        setSelectedProduct(p);
                        setCurrentView('detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onEnlargeImage={(p) => setEnlargedProduct(p)}
                    />
                  ))}
                </div>
              )}

            </section>
          </>
        )}

      </main>

      {/* Enlarged Image Lightbox Modal */}
      {enlargedProduct && (
        <ImageEnlargeModal
          product={enlargedProduct}
          allProducts={filteredProducts.length > 0 ? filteredProducts : products}
          onClose={() => setEnlargedProduct(null)}
          onAddToCart={handleAddToCart}
          onViewDetail={(p) => {
            setEnlargedProduct(null);
            setSelectedProduct(p);
            setCurrentView('detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Download / Install App Modal */}
      <DownloadAppModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        installPrompt={installPrompt}
        isInstalled={isInstalled}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckoutStart}
        customerMobile={customerMobile}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
        onShopBoys={() => scrollToProducts('boys')}
        onShopGirls={() => scrollToProducts('girls')}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
      />

      {/* Customer Mobile Number Modal */}
      <CustomerMobileModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        customerMobile={customerMobile}
        customerName={customerName}
        onSaveCustomer={handleSaveCustomer}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        grandTotal={grandTotal}
        customerMobile={customerMobile}
        customerName={customerName}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Admin Login Modal Gatekeeper */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Floating Cart Button for Mobile Screens */}
      {cartCount > 0 && !isCartOpen && currentView !== 'admin' && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="md:hidden fixed bottom-5 right-5 z-30 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-extrabold text-xs animate-bounce"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart ({cartCount})</span>
          <span className="bg-white/25 px-2 py-0.5 rounded-full font-mono">
            ₹{cartSubtotal}
          </span>
        </button>
      )}

      {/* Footer */}
      <Footer
        onShopBoys={() => scrollToProducts('boys')}
        onShopGirls={() => scrollToProducts('girls')}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
        onNavigateToAdmin={handleAdminAccess}
        onOpenDownloadModal={() => setIsDownloadOpen(true)}
      />

    </div>
  );
}
