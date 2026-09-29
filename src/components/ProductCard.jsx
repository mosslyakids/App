import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Heart, Maximize2 } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onViewDetail, onEnlargeImage }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (onEnlargeImage) {
      onEnlargeImage(product);
    } else if (onViewDetail) {
      onViewDetail(product);
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image Container (Clickable to Enlarge) */}
      <div 
        onClick={handleImageClick}
        className="relative aspect-[4/4.5] overflow-hidden bg-slate-100 cursor-zoom-in"
        title="Click to enlarge image"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover Enlarge Hint Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 bg-white/95 text-slate-900 text-xs font-black px-3.5 py-2 rounded-2xl shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Maximize2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Click to Enlarge</span>
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          <span
            className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm ${
              product.gender === 'boys'
                ? 'bg-blue-600 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {product.gender === 'boys' ? '👦 Boys' : '👧 Girls'}
          </span>
          {product.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-sm'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm z-10">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-600">({product.reviews})</span>
          </div>
        </div>

        {/* Product Name (Clickable) */}
        <h3 
          onClick={() => onViewDetail && onViewDetail(product)}
          className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2 hover:text-rose-600 cursor-pointer transition-colors"
          title="Click to view full outfit details"
        >
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Size Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
            <span>Select Size:</span>
            <span className="text-slate-700 font-bold">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  selectedSize === size
                    ? product.gender === 'boys'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 font-mono">
                ₹{product.price}
              </span>
              <span className="text-xs text-slate-600 line-through font-mono">
                ₹{product.originalPrice}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">
              Tax Incl.
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all transform active:scale-95 shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : product.gender === 'boys'
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200'
                : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-rose-200'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
