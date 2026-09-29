import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Minus, 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  RotateCcw,
  Tag
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  customerMobile,
  onOpenMobileModal,
  onShopBoys,
  onShopGirls,
  couponCode,
  setCouponCode,
  appliedDiscount,
  setAppliedDiscount
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [lastRemovedItem, setLastRemovedItem] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  const discountAmount = appliedDiscount 
    ? Math.round((subtotal * appliedDiscount) / 100) 
    : 0;

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (couponInput.trim().toUpperCase() === 'MOSSLYA20') {
      setAppliedDiscount(20);
      setCouponCode('MOSSLYA20');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon. Try "MOSSLYA20" for 20% off!');
    }
  };

  const handleRemoveItemWithUndo = (item) => {
    setLastRemovedItem(item);
    onRemoveItem(item.cartItemId);
    // Auto clear undo after 6 seconds
    setTimeout(() => {
      setLastRemovedItem((current) => (current?.cartItemId === item.cartItemId ? null : current));
    }, 6000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 font-display">
                  Your Kids Cart
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {cartItems.length} unique items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-100"
                  title="Remove all items from cart"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Undo notification banner if an item was recently removed */}
          {lastRemovedItem && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-1.5 truncate">
                <Trash2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span className="truncate">Removed: <strong>{lastRemovedItem.name}</strong></span>
              </div>
              <button
                onClick={() => {
                  onUpdateQuantity(lastRemovedItem.cartItemId, 1, lastRemovedItem);
                  setLastRemovedItem(null);
                }}
                className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline flex-shrink-0 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Undo
              </button>
            </div>
          )}

          {/* Free shipping progress */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs">
              {subtotal >= 999 ? (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🎉 Awesome! You unlocked <strong>FREE Express Shipping</strong>!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-slate-600 font-medium mb-1">
                    <span>Add <strong>₹{999 - subtotal}</strong> more for FREE delivery</span>
                    <span className="font-bold font-mono">₹{subtotal}/₹999</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-[#fbf6f0] border-2 border-dashed border-amber-300 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                  <img 
                    src="/mosslya-logo.png" 
                    alt="Mosslya Kids Logo" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 font-display">
                    Your Cart is Empty
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">
                    Looks like you haven't added any cute outfits yet. Explore our latest collections!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs pt-2">
                  <button
                    onClick={() => { onClose(); onShopBoys(); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm"
                  >
                    👦 Shop Boys
                  </button>
                  <button
                    onClick={() => { onClose(); onShopGirls(); }}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm"
                  >
                    👧 Shop Girls
                  </button>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.cartItemId}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex gap-3 relative group hover:border-slate-300 transition-all"
                >
                  {/* Item Image */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-top"
                    />
                    <span className={`absolute top-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded ${
                      item.gender === 'boys' ? 'bg-blue-600 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {item.gender === 'boys' ? 'BOY' : 'GIRL'}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          Size: {item.selectedSize}
                        </span>
                        <span className="text-xs text-slate-600 font-mono">
                          ₹{item.price} each
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls & Dedicated Remove Button */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
                      
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity === 1) {
                              handleRemoveItemWithUndo(item);
                            } else {
                              onUpdateQuantity(item.cartItemId, item.quantity - 1);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold font-mono text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <span className="text-xs font-extrabold font-mono text-slate-900">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Explicit "Remove" button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItemWithUndo(item)}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1.5 rounded-lg border border-rose-200 transition-all active:scale-95"
                        title={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
              
              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. MOSSLYA20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
              )}

              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="font-semibold">🎉 Promo code {couponCode} applied!</span>
                  <span className="font-mono font-bold">-{appliedDiscount}%</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-800">₹{subtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Kids Express Shipping</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200 font-display">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base text-rose-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Customer Mobile Number Notice */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="text-[11px] truncate">
                    {customerMobile ? (
                      <div>
                        <span className="text-slate-600">SMS / WhatsApp dispatch to:</span>{' '}
                        <strong className="text-slate-900 font-mono">{customerMobile}</strong>
                      </div>
                    ) : (
                      <span className="text-amber-700 font-semibold">
                        Add mobile number for dispatch updates
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenMobileModal}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline flex-shrink-0"
                >
                  {customerMobile ? 'Change' : 'Add Now'}
                </button>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Secure Checkout
                </span>
                <span>•</span>
                <span>Easy 7-Day Returns</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
