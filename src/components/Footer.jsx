import React from 'react';
import { ShieldCheck, Truck, RotateCcw, HeartHandshake, Phone } from 'lucide-react';


export default function Footer({ 
  onShopBoys, 
  onShopGirls, 
  onOpenMobileModal,
  onNavigateToAdmin,
  onOpenDownloadModal
}) {
  return (
    <footer className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/10 text-rose-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy 7-Day Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Kid-Safe Fabrics</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% gentle organic cotton</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">SMS Updates</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant parcel notifications</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#fbf6f0] border border-amber-200/50 p-0.5 flex-shrink-0">
                <img 
                  src="/mosslya-logo.png" 
                  alt="Mosslya Kids Official Logo" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white font-display tracking-wider">
                  MOSSLYA <span className="text-[#e29d9d]">KIDS</span>
                </span>
                <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  Clothing for Little Moments
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated everyday fashion for vibrant little humans. Designed with ultra-comfortable fabrics, playful colors, and endless movement in mind.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Helpline: +91 98000 12345</span>
            </div>
          </div>

          {/* Boys Collection */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">
              Boys Collection
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={onShopBoys} className="hover:text-white transition-colors">Dino & Graphic Tees</button></li>
              <li><button onClick={onShopBoys} className="hover:text-white transition-colors">Rugged Denim & Joggers</button></li>
              <li><button onClick={onShopBoys} className="hover:text-white transition-colors">Casual Linen Shirts</button></li>
              <li><button onClick={onShopBoys} className="hover:text-white transition-colors">Speedster Sneakers</button></li>
            </ul>
          </div>

          {/* Girls Collection */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400">
              Girls Collection
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={onShopGirls} className="hover:text-white transition-colors">Twirl Muslin Dresses</button></li>
              <li><button onClick={onShopGirls} className="hover:text-white transition-colors">Pastel Knitted Cardigans</button></li>
              <li><button onClick={onShopGirls} className="hover:text-white transition-colors">Fairy Tulle Party Sets</button></li>
              <li><button onClick={onShopGirls} className="hover:text-white transition-colors">Glitter Ballerina Flats</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Customer Services & Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={onOpenMobileModal} className="hover:text-white transition-colors">Manage Customer Mobile</button></li>
              <li><button onClick={onOpenDownloadModal} className="hover:text-amber-400 transition-colors font-bold text-slate-300">📲 Download & Install App</button></li>
              <li><button onClick={onNavigateToAdmin} className="hover:text-rose-400 transition-colors font-bold text-slate-300">⚙️ Admin Product Manager</button></li>
              <li><span className="hover:text-white cursor-pointer">Shipping & Delivery Policies</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Mosslya Kids Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Safe Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
