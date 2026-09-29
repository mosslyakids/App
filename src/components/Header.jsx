import React from 'react';
import { ShoppingBag, Phone, UserCheck, Sparkles, Search, X, Settings, Download } from 'lucide-react';

export default function Header({
  activeGender,
  setActiveGender,
  customerMobile,
  customerName,
  setIsMobileModalOpen,
  cartCount,
  cartTotal,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  onShopCategory,
  currentView,
  onNavigateToAdmin,
  onNavigateToStore,
  onOpenDownloadModal
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>✨ Special Launch: Use code <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">MOSSLYA20</span> for 20% Off! Fast dispatch on all orders.</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { onNavigateToStore && onNavigateToStore(); setActiveGender('all'); setSearchQuery(''); }}
            className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-amber-200/70 shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 bg-[#fbf6f0] flex items-center justify-center">
              <img 
                src="/mosslya-logo.png" 
                alt="Mosslya Kids Logo" 
                className="w-full h-full object-cover object-top transform scale-110"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 font-display">
                  MOSSLYA
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#c07d7d] font-display">
                  KIDS
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase -mt-0.5">
                Clothing for Little Moments
              </p>
            </div>
          </div>

          {/* Center Navigation: Boys / Girls Direct Switch */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200/80">
            <button
              onClick={() => onShopCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeGender === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Outfits
            </button>
            <button
              onClick={() => onShopCategory('boys')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeGender === 'boys'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>👦 Boys Zone</span>
            </button>
            <button
              onClick={() => onShopCategory('girls')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeGender === 'girls'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'text-slate-600 hover:text-rose-500'
              }`}
            >
              <span>👧 Girls Zone</span>
            </button>
          </nav>

          {/* Search bar */}
          <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tees, dresses, denim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-150 focus:bg-white text-xs font-medium rounded-full border border-transparent focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-600 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Customer Mobile & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Customer Mobile Number Badge / Login Button */}
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                customerMobile
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title={customerMobile ? `Customer Mobile: ${customerMobile}` : "Click to add customer mobile number"}
            >
              {customerMobile ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div className="text-left hidden sm:block">
                    <span className="block text-[10px] uppercase tracking-wider text-emerald-600 font-extrabold leading-none">
                      {customerName ? customerName : 'Customer'}
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-800">
                      {customerMobile}
                    </span>
                  </div>
                  <span className="sm:hidden font-mono text-xs">
                    {customerMobile.slice(-4)}
                  </span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Add Mobile No.</span>
                  <span className="sm:hidden">Add Mobile</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </>
              )}
            </button>

            {/* Admin Panel Link / Switcher */}
            {currentView === 'admin' ? (
              <button
                onClick={onNavigateToStore}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition-all"
                title="Go back to live store"
              >
                <span>🛍️ Store</span>
              </button>
            ) : (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm transition-all"
                title="Open Admin Product Upload & Management"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Download App Button */}
            <button
              onClick={onOpenDownloadModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-black bg-gradient-to-r from-rose-50 to-amber-50 hover:from-rose-100 hover:to-amber-100 text-rose-700 border border-rose-200 shadow-sm transition-all active:scale-95"
              title="Download or Install Mosslya App"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">App</span>
            </button>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {cartTotal > 0 && (
                <span className="hidden md:inline font-mono text-amber-300 font-semibold border-l border-slate-700 pl-2">
                  ₹{cartTotal}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile secondary navigation: Quick Category switch + search on mobile */}
        <div className="md:hidden pb-3 pt-1 flex flex-col gap-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search kids fashion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100 text-xs font-medium rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onShopCategory('all')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                activeGender === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              All Outfits
            </button>
            <button
              onClick={() => onShopCategory('boys')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                activeGender === 'boys'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              👦 Boys
            </button>
            <button
              onClick={() => onShopCategory('girls')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                activeGender === 'girls'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              👧 Girls
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
