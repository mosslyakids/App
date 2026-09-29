import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { HERO_SLIDES } from '../data/products';

export default function HeroSlider({ onSelectCategory }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = HERO_SLIDES;
  const currentSlide = slides[currentSlideIndex];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSelectGenderSlide = (index) => {
    setCurrentSlideIndex(index);
  };


  return (
    <section 
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quick Boys vs Girls Slider Selector Tabs */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => handleSelectGenderSlide(0, 'boys')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-sm transition-all duration-300 transform ${
            currentSlideIndex === 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105 ring-2 ring-blue-400/50'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="text-lg">👦</span>
          <span>Boys Slider</span>
          {currentSlideIndex === 0 && (
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => handleSelectGenderSlide(1, 'girls')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-sm transition-all duration-300 transform ${
            currentSlideIndex === 1
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 scale-105 ring-2 ring-rose-400/50'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="text-lg">👧</span>
          <span>Girls Slider</span>
          {currentSlideIndex === 1 && (
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
          )}
        </button>
      </div>

      {/* Main Hero Slider Frame */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-100 bg-white">
        
        {/* Decorative background gradients based on active slide */}
        <div 
          className={`absolute inset-0 opacity-10 bg-gradient-to-br ${currentSlide.themeColor} transition-colors duration-700`}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[500px]">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center z-10">
            
            {/* Tag / Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentSlide.pillColor}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {currentSlide.tagline}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                {currentSlide.badgeText}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4 font-display">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 max-w-xl">
              {currentSlide.subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {currentSlide.highlightFeatures.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 bg-slate-100/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/70"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onSelectCategory(currentSlide.gender)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-white text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  currentSlide.gender === 'boys'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                }`}
              >
                <span>{currentSlide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory(currentSlide.gender)}
                className="px-5 py-3.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm transition-all border border-slate-200"
              >
                {currentSlide.ctaSecondary}
              </button>
            </div>

          </div>

          {/* Right Image / Showcase Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center p-6 sm:p-8 bg-slate-50/50">
            
            {/* Visual Photo Card */}
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-white shadow-lg backdrop-blur-md ${
                  currentSlide.gender === 'boys' ? 'bg-blue-600/90' : 'bg-rose-500/90'
                }`}>
                  {currentSlide.gender === 'boys' ? '👦 Boys Edition' : '👧 Girls Edition'}
                </span>
              </div>

              {/* Bottom Image Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Mosslya Curated
                </p>
                <p className="text-base font-extrabold font-display">
                  {currentSlide.modelTag}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 z-20 border border-slate-200/80"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 z-20 border border-slate-200/80"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots & Slider status bar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/60 z-20">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(index)}
              className={`transition-all rounded-full ${
                index === currentSlideIndex
                  ? s.gender === 'boys'
                    ? 'w-8 h-2.5 bg-blue-600'
                    : 'w-8 h-2.5 bg-rose-500'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Switch to ${s.gender} slide`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
