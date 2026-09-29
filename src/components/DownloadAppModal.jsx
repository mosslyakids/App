import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Apple, 
  CheckCircle2, 
  Sparkles, 
  FolderArchive,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function DownloadAppModal({ 
  isOpen, 
  onClose, 
  installPrompt, 
  isInstalled 
}) {
  const [activeTab, setActiveTab] = useState('install'); // 'install' | 'android' | 'ios' | 'desktop'
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onClose();
      }
    } else {
      // Guide user to the appropriate tab
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isAndroid = /Android/.test(navigator.userAgent);
      if (isIOS) setActiveTab('ios');
      else if (isAndroid) setActiveTab('android');
      else setActiveTab('desktop');
    }
  };

  const handleDownloadZip = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/mosslya-kids-app.zip';
    link.download = 'Mosslya-Kids-App.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Mosslya Branding */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/mosslya-logo.png" 
                alt="Mosslya Kids Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                Progressive Web App
              </span>
              <h2 className="text-xl font-black font-display tracking-tight mt-0.5">
                Download Mosslya Kids
              </h2>
              <p className="text-xs text-white/90">
                Install to your phone or PC for lightning fast shopping
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-white text-slate-900 border-t-2 border-rose-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>1-Click Download</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'android'
                ? 'bg-white text-slate-900 border-t-2 border-blue-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ios'
                ? 'bg-white text-slate-900 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-slate-800" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'desktop'
                ? 'bg-white text-slate-900 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-amber-500" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Native PWA Install Button */}
              {installPrompt ? (
                <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 text-center">
                  <span className="text-2xl block mb-2">⚡</span>
                  <h4 className="text-sm font-black text-slate-900 font-display">
                    Ready to Install on this Device
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 mb-4">
                    Install Mosslya Kids directly to your Home Screen or Applications list.
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Mosslya App Now</span>
                  </button>
                </div>
              ) : isInstalled ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-emerald-900">App Already Installed!</h4>
                    <p className="text-xs text-emerald-700">You are using or have installed the standalone app.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Home Screen Installation</h4>
                    <p className="text-[11px] text-slate-600">Select your device tab above for simple 2-second install steps.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('android')}
                    className="text-xs font-extrabold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View Steps</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Direct Offline Package ZIP Download */}
              <div className="border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                    <FolderArchive className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 font-display">
                        Offline App Package (.ZIP)
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        ~2.2 MB
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 mb-3">
                      Download the complete project bundle with high-res logo, assets, and source code.
                    </p>
                    <button
                      onClick={handleDownloadZip}
                      disabled={downloadStarted}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      {downloadStarted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Downloading ZIP Archive...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-amber-400" />
                          <span>Download Mosslya-Kids-App.zip</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-base block">🚀</span>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">Instant Launch</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-base block">📶</span>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">Offline Access</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-base block">🔒</span>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">Admin Included</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">How to install on Android (Chrome / Edge / Samsung)</h3>
              </div>
              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">1</span>
                  <span>Open this website in <strong>Google Chrome</strong> or <strong>Edge</strong> on your phone.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">2</span>
                  <span>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">3</span>
                  <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">4</span>
                  <span>Tap <strong>Install</strong>. The Mosslya Kids logo app icon will now appear on your home screen!</span>
                </li>
              </ol>

              {installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Prompt Install Dialog Now
                </button>
              )}
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-900" />
                <h3 className="text-sm font-black text-slate-900">How to install on iPhone & iPad (Safari)</h3>
              </div>
              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">1</span>
                  <span>Open this website in <strong>Safari</strong> on your iPhone or iPad.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">2</span>
                  <span>Tap the <strong>Share button</strong> (square with arrow pointing up ⬆) at the bottom.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">3</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">4</span>
                  <span>Tap <strong>Add</strong> at the top right. Launch Mosslya Kids anytime directly from your iOS apps!</span>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">How to install on Windows PC or Mac</h3>
              </div>
              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">1</span>
                  <span>Look at the right side of your browser URL bar for the <strong>Install App icon (⊕ or 💻)</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">2</span>
                  <span>Click <strong>Install</strong> when prompted.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-[11px] flex-shrink-0">3</span>
                  <span>Mosslya Kids will run in its own independent desktop application window!</span>
                </li>
              </ol>

              {installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Install Desktop App Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Mosslya Kids v1.0.0</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-950"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
