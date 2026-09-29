import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  LogOut,
  BellRing
} from 'lucide-react';

export default function CustomerMobileModal({
  isOpen,
  onClose,
  customerMobile,
  customerName,
  onSaveCustomer
}) {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState(
    customerMobile ? customerMobile.replace(/^\+\d+\s*/, '') : ''
  );
  const [name, setName] = useState(customerName || '');
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');

    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStep('otp');
  };

  const handleVerifyAndSave = (e) => {
    e?.preventDefault();
    setError('');

    if (otp !== '1234' && otp.length !== 4) {
      setError('Please enter the 4-digit code (use demo code: 1234)');
      return;
    }

    const fullMobile = `${countryCode} ${mobileNumber.replace(/\D/g, '')}`;
    onSaveCustomer(fullMobile, name.trim() || 'Parent / Shopper');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setStep('input');
      onClose();
    }, 1200);
  };

  const handleRemoveNumber = () => {
    onSaveCustomer('', '');
    setMobileNumber('');
    setName('');
    setStep('input');
    setOtp('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#fbf6f0] border border-amber-200/70 p-1 mx-auto flex items-center justify-center shadow-md mb-3 overflow-hidden">
            <img 
              src="/mosslya-logo.png" 
              alt="Mosslya Kids" 
              className="w-full h-full object-cover object-top"
            />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-display">
            {customerMobile ? 'Customer Profile' : 'Add Customer Mobile'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {customerMobile 
              ? 'Your mobile number is registered for express dispatch and order updates.' 
              : 'Enter your mobile number to get instant WhatsApp dispatch alerts and fast checkout.'}
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center mb-4 flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Mobile Number Saved Successfully!</span>
          </div>
        )}

        {/* Already Registered State */}
        {customerMobile && step === 'input' && !isSuccess ? (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Customer
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                {customerName || 'Shopper'}
              </p>
              <p className="text-lg font-mono font-black text-slate-800 tracking-wide mt-0.5">
                {customerMobile}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <BellRing className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Active Benefits:</span>
              </div>
              <p className="pl-6">• Real-time WhatsApp tracking sent to this number.</p>
              <p className="pl-6">• One-click instant checkout enabled.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('input-edit')}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all"
              >
                Change Number
              </button>
              <button
                type="button"
                onClick={handleRemoveNumber}
                className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all"
                title="Remove registered mobile number"
              >
                <LogOut className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : step === 'otp' ? (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyAndSave} className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Verification code sent to:</span>
              <p className="font-mono font-black text-sm text-slate-800 mt-0.5">
                {countryCode} {mobileNumber}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Enter 4-Digit Code
              </label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full text-center tracking-[0.6em] text-2xl font-mono font-extrabold py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                autoFocus
              />
              
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setOtp('1234')}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-800 underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-fill demo code (1234)
                </button>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  Edit number
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-98"
            >
              Verify & Save Customer Mobile
            </button>
          </form>
        ) : (
          /* Step 1: Input Mobile Number */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent / Customer Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma or John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl shadow-sm border border-slate-300 focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-rose-400 overflow-hidden">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-slate-50 px-3 py-2.5 text-xs font-bold border-r border-slate-300 text-slate-700 focus:outline-none"
                >
                  <option value="+91">🇮🇳 +91 (IN)</option>
                  <option value="+1">🇺🇸 +1 (US)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+61">🇦🇺 +61 (AU)</option>
                </select>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-800 placeholder:font-sans placeholder:text-xs placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                We never spam. Used solely for parcel dispatch & delivery alerts.
              </p>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md shadow-rose-200 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Continue with Mobile</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
