import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ImageEnlargeModal({ 
  product, 
  allProducts = [], 
  onClose, 
  onAddToCart, 
  onViewDetail 
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!product || !allProducts.length) return 0;
    const idx = allProducts.findIndex((p) => p.id === product.id);
    return idx >= 0 ? idx : 0;
  });
  const [isAdded, setIsAdded] = useState(false);

  const currentProduct = allProducts[currentIndex] || product;

  // Sync index if product prop changes
  useEffect(() => {
    if (product && allProducts.length) {
      const idx = allProducts.findIndex((p) => p.id === product.id);
      if (idx >= 0) setCurrentIndex(idx);
    }
    setZoomLevel(1);
  }, [product, allProducts]);

  // Handle keyboard navigation: Esc to close, Left/Right arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && allProducts.length > 1) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && allProducts.length > 1) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allProducts.length]);

  if (!currentProduct) return null;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev === 0 ? allProducts.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev === allProducts.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(2.5, +(prev + 0.3).toFixed(1)));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(1, +(prev - 0.3).toFixed(1)));
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev > 1 ? 1 : 1.7));
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    const defaultSize = currentProduct.sizes?.[0] || 'Standard';
    onAddToCart(currentProduct, defaultSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Floating Controls Bar */}
      <div 
        className="w-full max-w-5xl flex items-center justify-between gap-3 text-white z-10 py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
            currentProduct.gender === 'boys' ? 'bg-blue-600 text-white' : 'bg-rose-500 text-white'
          }`}>
            {currentProduct.gender === 'boys' ? '👦 Boys' : '👧 Girls'}
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            {currentProduct.category}
          </span>
          {allProducts.length > 1 && (
            <span className="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              {currentIndex + 1} / {allProducts.length}
            </span>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md rounded-2xl px-2 py-1 shadow-lg">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1.5 rounded-xl hover:bg-white/15 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-200 font-bold px-1 select-none min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            className="p-1.5 rounded-xl hover:bg-white/15 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-xl hover:bg-white/15 text-amber-300 transition-all"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md group"
          title="Close Enlarged View (Esc)"
          aria-label="Close enlarged image"
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {allProducts.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-white text-white hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all shadow-xl backdrop-blur-sm"
            title="Previous outfit (Left arrow key)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Image Container with Zoom */}
        <div 
          className="relative max-h-[72vh] max-w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 cursor-zoom-in"
          onClick={toggleZoom}
          title="Click to toggle zoom in / out"
        >
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-auto h-auto max-h-[72vh] max-w-[90vw] object-contain transition-transform duration-300 ease-out select-none"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          />

          {/* Badge over photo */}
          {currentProduct.badge && (
            <div className="absolute top-4 left-4 bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-lg pointer-events-none">
              ★ {currentProduct.badge}
            </div>
          )}

          {discountPercent > 0 && (
            <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg pointer-events-none">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Next Button */}
        {allProducts.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-white text-white hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all shadow-xl backdrop-blur-sm"
            title="Next outfit (Right arrow key)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Outfit Summary and Quick Action Bar */}
      <div 
        className="w-full max-w-4xl bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-400">
              {currentProduct.category}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Sizes: {currentProduct.sizes?.join(', ')}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white font-display line-clamp-1">
            {currentProduct.name}
          </h3>
          <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-0.5">
            <span className="text-xl font-black text-amber-400 font-mono">
              ₹{currentProduct.price}
            </span>
            {currentProduct.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-mono">
                ₹{currentProduct.originalPrice}
              </span>
            )}
            <span className="text-[10px] text-emerald-400 font-bold">
              Inclusive of all taxes
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onViewDetail && (
            <button
              onClick={() => {
                onClose();
                onViewDetail(currentProduct);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all shadow-sm"
              title="Open full outfit product details page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Details</span>
            </button>
          )}

          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
