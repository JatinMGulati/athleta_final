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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 opacity-50"></div>
      
      {/* Holographic effect layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-red-400/10 to-blue-400/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Holographic cross */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 opacity-30 blur-xl animate-pulse"></div>
            
            {/* Main cross circle */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-2xl">
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
              
              {/* Cross mark */}
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
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Claim Rejected
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-md mx-auto">
            {reason}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
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
