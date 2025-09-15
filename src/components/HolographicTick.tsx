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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-50"></div>
      
      {/* Holographic effect layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-red-400/10 to-blue-400/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Holographic tick */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-30 blur-xl animate-pulse"></div>
            
            {/* Main tick circle */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
              
              {/* Tick mark */}
              <svg 
                className="w-16 h-16 text-white drop-shadow-lg relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={4} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Success message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Jersey Claimed!
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-md mx-auto">
            Your jersey has been successfully claimed. Check your email for confirmation details.
          </p>
        </div>

        {/* Holographic particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
