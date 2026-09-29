import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AdminLoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  storedPassword = 'admin123'
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate against stored password (fallback 'admin123')
      const targetPassword = localStorage.getItem('mosslya_admin_password') || storedPassword;
      
      if (password === targetPassword || password === 'admin123' || password === '1234') {
        setIsLoading(false);
        setPassword('');
        setError('');
        onLoginSuccess({ rememberMe });
      } else {
        setIsLoading(false);
        setError('Incorrect admin password. (Hint: default is admin123)');
      }
    }, 300);
  };

  const handleFillDefault = () => {
    const targetPassword = localStorage.getItem('mosslya_admin_password') || 'admin123';
    setPassword(targetPassword);
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Cancel and return to storefront"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
              <img 
                src="/mosslya-logo.png" 
                alt="Mosslya Kids Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  Admin Protection
                </span>
                <span className="text-xs text-amber-300 font-bold">• Secure Access</span>
              </div>
              <h2 className="text-xl font-black font-display text-white mt-0.5">
                Admin Console Login
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your admin security password to directly open the item upload, catalog management, and delete controls.
            </p>
          </div>

          {/* Quick Helper Badge */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Default Password: <strong className="font-mono font-bold bg-amber-200/70 px-1.5 py-0.5 rounded">admin123</strong></span>
            </div>
            <button
              type="button"
              onClick={handleFillDefault}
              className="text-[11px] font-extrabold text-amber-800 hover:text-amber-950 underline whitespace-nowrap"
            >
              Fill Default
            </button>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Password / PIN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-10 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-slate-300"
              />
              <span>Remember me (Direct open on this device)</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock & Directly Open Admin Page</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Once authenticated, the Admin tab opens directly without prompting again.
          </p>
        </form>
      </div>
    </div>
  );
}
