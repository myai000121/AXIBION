import React from 'react';
import { ShieldCheck, Truck, Cpu, ChevronRight, Zap } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onCybersecurityClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onCybersecurityClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#050505] border-b border-[#1a1e27] pt-8 pb-16 md:pt-12 md:pb-20">
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#087BFF]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#087BFF]/10 border border-[#087BFF]/30 text-xs font-semibold text-[#00D9FF]">
              <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>OFFICIAL MARKETPLACE</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">CASH ON DELIVERY</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                AXIBION
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#00D9FF] text-2xl sm:text-3xl lg:text-4xl font-semibold mt-2">
                  A World of Technology.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                Specialized marketplace for cutting-edge electronics, flagship mobile hardware, high-performance computing, and legitimate ethical hacking & cybersecurity diagnostic equipment.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#087BFF] to-[#0066d6] hover:brightness-110 shadow-lg shadow-[#087BFF]/25 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <span>Explore Catalog</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onCybersecurityClick}
                className="px-6 py-3.5 rounded-lg text-sm font-semibold text-[#00D9FF] bg-[#0c0d12] hover:bg-[#151922] border border-[#00D9FF]/40 hover:border-[#00D9FF] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-[#00D9FF]" />
                <span>Ethical Hacking Lab</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1a1e27] max-w-lg">
              <div>
                <p className="text-xs text-slate-500">Payment</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">Cash on Delivery</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Dispatch</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">24-48h Express</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Authentication</p>
                <p className="text-sm font-bold text-[#00D9FF] mt-0.5">100% Genuine</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#1a1e27] shadow-2xl bg-[#0c0d12] group">
              <img
                src="/src/assets/images/hero_axibion_tech_quantum_1794037986324.jpg"
                alt="AXIBION Next-Gen Technology Hardware"
                className="w-full h-[340px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#050505]/80 backdrop-blur-md border border-[#1a1e27] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#00D9FF] uppercase tracking-wider">
                    FEATURED HARDWARE
                  </span>
                  <p className="text-sm font-bold text-white">Quantum Circuit & RF Dev Kits</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Available</span>
                  <p className="text-xs font-semibold text-emerald-400">Ready to Ship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
