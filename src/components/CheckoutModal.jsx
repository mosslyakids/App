import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  CreditCard, 
  Banknote, 
  Truck, 
  Sparkles
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  grandTotal,
  customerMobile,
  customerName,
  onOrderCompleted
}) {
  const [mobile, setMobile] = useState(customerMobile || '');
  const [name, setName] = useState(customerName || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setError('');

    if (!mobile || mobile.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number for order delivery.');
      return;
    }

    if (!address.trim() || !pincode.trim()) {
      setError('Please fill in complete delivery address and pincode.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `MOSSLYA-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrder({
        orderId,
        mobile,
        name: name || 'Shopper',
        items: [...cartItems],
        total: grandTotal,
        address: `${address}, ${city} - ${pincode}`,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online'
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const handleFinish = () => {
    onOrderCompleted();
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={completedOrder ? handleFinish : onClose}
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={completedOrder ? handleFinish : onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                Order Confirmed!
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-display mt-0.5">
                Thank You, {completedOrder.name}!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Order ID: <strong className="font-mono text-slate-800">{completedOrder.orderId}</strong>
              </p>
            </div>

            {/* Delivery & SMS status */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  SMS updates sent to: <strong className="font-mono text-slate-900">{completedOrder.mobile}</strong>
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Delivering to: {completedOrder.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Estimated Kids Express Delivery: <strong>2-3 Business Days</strong></span>
              </div>
            </div>

            {/* Items Recap */}
            <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/80 text-left">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                <span>Items ({completedOrder.items.length})</span>
                <span className="font-mono text-rose-600 text-sm">₹{completedOrder.total}</span>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-[11px] text-slate-600">
                {completedOrder.items.map((i) => (
                  <div key={i.cartItemId} className="flex justify-between">
                    <span className="truncate">{i.quantity}x {i.name} ({i.selectedSize})</span>
                    <span className="font-mono font-semibold">₹{i.price * i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all"
            >
              Continue Shopping Mosslya Kids
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#fbf6f0] border border-amber-200/70 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                <img 
                  src="/mosslya-logo.png" 
                  alt="Mosslya Kids Logo" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Express Checkout
                </h3>
                <p className="text-xs text-slate-500">
                  Total Payable: <strong className="font-mono text-rose-600 text-sm">₹{grandTotal}</strong> ({cartItems.length} items)
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Customer Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Order status & courier tracking code will be dispatched to this mobile number.
                </span>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aditi Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address & House No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, Flat No., Street, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai / Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'online'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>UPI / GPay / Card</span>
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Place Order (₹{grandTotal})</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
