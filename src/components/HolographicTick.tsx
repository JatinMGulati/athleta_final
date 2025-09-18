'use client';

import { useEffect, useState } from 'react';

export default function HolographicTick() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Metallic animated background */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#0ea5e9_0deg,#9333ea_120deg,#ef4444_240deg,#0ea5e9_360deg)] opacity-10 animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18),transparent_65%)]" />
      {/* Moving scanlines and grain make screenshots obvious */}
      <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.5)_100%)] bg-[length:100%_4px] animate-[scan_1.2s_linear_infinite]" />
      <div className="pointer-events-none absolute inset-0 opacity-10 animate-[grain_0.6s_steps(6)_infinite] bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'1\'/><feColorMatrix type=\'saturate\' values=\'0\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>')] bg-[length:200px_200px]" />

      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative mb-8">
          <div className="w-40 h-40 mx-auto relative">
            {/* Metallic ring with shifting specular highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-teal-600 blur-xl opacity-40" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffffff22_0deg,#ffffff88_45deg,#ffffff11_90deg,#ffffff22_180deg,#ffffff88_225deg,#ffffff11_270deg,#ffffff22_360deg)] animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#1f2937] to-[#111827] shadow-[0_0_40px_rgba(16,185,129,0.3)]" />

            {/* Holographic tick with parallax shine */
            <div className="relative w-full h-full rounded-full flex items-center justify-center">
              <svg className="w-20 h-20 relative z-10" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="tickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <path d="M5 13l4 4L19 7" fill="none" stroke="url(#tickGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* moving specular highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent,white,transparent)] opacity-25 animate-[spin_2.2s_linear_infinite]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#a7f3d0,#34d399,#10b981,#6ee7b7)] bg-[length:200%_200%] animate-[bg-pan_4s_ease_infinite]">Jersey Claimed!</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-md mx-auto flex items-center justify-center gap-3">
            Verified success
            <span className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/70">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-[pulse_0.9s_ease_in_out_infinite] shadow-[0_0_12px_#34d399]" />
              Live
            </span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bg-pan { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        @keyframes scan { 0% { background-position-y: 0 } 100% { background-position-y: 4px } }
        @keyframes grain { 0% { background-position: 0 0 } 100% { background-position: 200px 200px } }
      `}</style>
    </div>
  );
}
