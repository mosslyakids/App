import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Maximize2, 
  X,
  Phone
} from 'lucide-react';

export default function ProductDetailPage({ 
  product, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  customerMobile,
  onOpenMobileModal 
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuy = () => {
    onAddToCart(product, selectedSize, quantity);
    onBuyNow();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-xl transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Outfits</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="hover:text-slate-800 cursor-pointer" onClick={onBack}>Mosslya Store</span>
          <span>/</span>
          <span className="capitalize">{product.gender}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Enlarged Image View */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* Main Large Image Container */}
          <div className="relative aspect-[3.8/4.5] sm:aspect-[4/4.5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-lg group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Enlarge / Fullscreen Lightbox Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-2xl shadow-md backdrop-blur-md transition-all hover:scale-110 flex items-center gap-1.5 text-xs font-bold"
              title="Click to view full screen enlarged photo"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Enlarge</span>
            </button>

            {/* Badges on Enlarged Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm ${
                product.gender === 'boys'
                  ? 'bg-blue-600 text-white'
                  : 'bg-rose-500 text-white'
              }`}>
                {product.gender === 'boys' ? '👦 Boys Collection' : '👧 Girls Collection'}
              </span>
              {product.badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                  ★ {product.badge}
                </span>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-2xl">
              <span className="font-semibold">✨ Mosslya Kids High-Res Photo</span>
              <span className="font-mono text-amber-300 font-bold">100% Quality Fabric</span>
            </div>
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-extrabold text-slate-800">100% Organic Cotton</p>
              <p className="text-[10px] text-slate-500">Gentle on skin</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
              <RotateCcw className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <p className="text-[11px] font-extrabold text-slate-800">7-Day Free Returns</p>
              <p className="text-[10px] text-slate-500">Doorstep exchange</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
              <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-[11px] font-extrabold text-slate-800">Express Dispatch</p>
              <p className="text-[10px] text-slate-500">Fast delivery</p>
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Information & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          
          {/* Category & Ratings */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-xs font-black text-slate-900">{product.rating}</span>
              <span className="text-xs text-slate-500 font-medium">({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display leading-tight mb-3">
            {product.name}
          </h1>

          {/* Price Header */}
          <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-slate-200">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-base sm:text-lg text-slate-400 line-through font-mono">
                ₹{product.originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {discountPercent}% SAVINGS
              </span>
            )}
            <span className="text-xs font-bold text-slate-400 ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Size Selector with Size Guide */}
          <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Select Age / Size:
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
              >
                {showSizeGuide ? 'Hide Size Guide' : '📏 Size Chart Guide'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedSize === size
                      ? product.gender === 'boys'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-400'
                        : 'bg-rose-500 text-white shadow-md shadow-rose-200 ring-2 ring-rose-400'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Expandable Size Guide */}
            {showSizeGuide && (
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1.5 animate-in fade-in">
                <p className="font-bold text-slate-800">Standard Kids Size Chart:</p>
                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                  <div><strong>0-6 Months:</strong> 62-68 cm</div>
                  <div><strong>1-2 Years:</strong> 86-92 cm</div>
                  <div><strong>3-4 Years:</strong> 98-104 cm</div>
                  <div><strong>5-6 Years:</strong> 110-116 cm</div>
                  <div><strong>7-8 Years:</strong> 122-128 cm</div>
                  <div><strong>9-12 Years:</strong> 134-152 cm</div>
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-extrabold text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-extrabold text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
              </span>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-extrabold text-sm transition-all shadow-md active:scale-98 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : product.gender === 'boys'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} to Cart (₹{product.price * quantity})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuy}
                className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-amber-200 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Buy Now</span>
              </button>
            </div>
          </div>

          {/* Customer Mobile Dispatch Information Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {customerMobile ? (
                    <>SMS Dispatch Connected: <strong className="font-mono">{customerMobile}</strong></>
                  ) : (
                    <>Add Customer Mobile for Instant WhatsApp Courier Tracking</>
                  )}
                </p>
                <p className="text-[11px] text-slate-600">
                  Receive live package updates directly on your mobile device.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenMobileModal}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex-shrink-0"
            >
              {customerMobile ? 'Edit' : 'Connect'}
            </button>
          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox Modal when clicking Enlarge */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            aria-label="Close fullscreen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}

    </div>
  );
}
