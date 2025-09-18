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
      <div
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, #0ea5e9 0deg, #9333ea 120deg, #ef4444 240deg, #0ea5e9 360deg)',
          opacity: 0.10,
          animation: 'spin 10s linear infinite',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18), transparent 65%)',
        }}
      />
      {/* Moving scanlines and grain make screenshots obvious */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen"
        style={{
          backgroundImage: 'linear-gradient(transparent 95%, rgba(255,255,255,0.5) 100%)',
          backgroundSize: '100% 4px',
          animation: 'scan 1.2s linear infinite',
        }}
      />
      {/* Subtle flicker layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15), transparent 45%)',
          animation: 'flicker 1.8s steps(6) infinite',
        }}
      />

      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative mb-8">
          <div className="w-40 h-40 mx-auto relative">
            {/* Metallic ring with shifting specular highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-teal-600 blur-xl opacity-40" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffffff22_0deg,#ffffff88_45deg,#ffffff11_90deg,#ffffff22_180deg,#ffffff88_225deg,#ffffff11_270deg,#ffffff22_360deg)] animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#1f2937] to-[#111827] shadow-[0_0_40px_rgba(16,185,129,0.3)]" />

            {/* Holographic tick with parallax shine */}
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
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 180deg, transparent, white, transparent)',
                  opacity: 0.25,
                  animation: 'spin 2.2s linear infinite',
                }}
              />
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
        @keyframes flicker { 0% { opacity: .03 } 50% { opacity: .12 } 100% { opacity: .03 } }
      `}</style>
    </div>
  );
}
