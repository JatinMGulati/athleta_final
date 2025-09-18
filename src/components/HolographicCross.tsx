'use client';

import { useEffect, useState } from 'react';

interface HolographicCrossProps {
  reason: string;
}

export default function HolographicCross({ reason }: HolographicCrossProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Metallic animated background */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444_0deg,#a855f7_120deg,#3b82f6_240deg,#ef4444_360deg)] opacity-10 animate-[spin_12s_linear_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_60%)]" />

      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative mb-8">
          <div className="w-40 h-40 mx-auto relative">
            {/* Metallic ring with shifting specular highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-300 to-pink-600 blur-xl opacity-40" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffffff22_0deg,#ffffff88_45deg,#ffffff11_90deg,#ffffff22_180deg,#ffffff88_225deg,#ffffff11_270deg,#ffffff22_360deg)] animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#1f2937] to-[#111827] shadow-[0_0_40px_rgba(239,68,68,0.3)]" />

            {/* Holographic cross with parallax shine */}
            <div className="relative w-full h-full rounded-full flex items-center justify-center">
              <svg className="w-20 h-20 relative z-10" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>
                <path d="M6 18L18 6M6 6l12 12" fill="none" stroke="url(#crossGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent,white,transparent)] opacity-20 animate-[spin_2.8s_linear_infinite]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#fecaca,#f87171,#ef4444,#fca5a5)] bg-[length:200%_200%] animate-[bg-pan_4s_ease_infinite]">Claim Rejected</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-md mx-auto">{reason}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bg-pan { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
      `}</style>
    </div>
  );
}
