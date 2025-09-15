'use client';

import Image from "next/image";
// router navigation replaced by window.location.href for robustness in dev
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createAndStoreNonce } from '@/lib/utils';

const GoogleAuthButton = dynamic(() => import("@/components/GoogleAuthButton"), {
  ssr: false,
});

export default function Home() {
  const [particles, setParticles] = useState<{ left: number; top: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate particle positions client-side only to avoid SSR/client mismatch
    const generated = Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  const handleSuccess = () => {
    const nonce = createAndStoreNonce('success');
    console.debug('[Home] success nonce', nonce);
    // Use a full navigation to avoid HMR/router interruption in dev
    window.location.href = `/success?n=${encodeURIComponent(nonce)}`;
  };

  const handleError = (reason: string) => {
    const nonce = createAndStoreNonce('error');
    console.debug('[Home] error nonce', nonce, 'reason', reason);
    window.location.href = `/error?n=${encodeURIComponent(nonce)}&reason=${encodeURIComponent(reason)}`;
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/Atleta Logo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Holographic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo section */}
        <div className="mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-2xl rounded-full"></div>
            <div className="relative z-10 rounded-full shadow-2xl" style={{ width: 200, height: 200 }}>
              <Image
                src="/Atleta Logo.png"
                alt="Atleta Logo"
                fill
                sizes="200px"
                className="rounded-full object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Title and description */}
        <div className="mb-12 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
            ATLETA
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-lg mx-auto leading-relaxed">
            Claim your exclusive jersey and join the Atleta community
          </p>
        </div>

        {/* Google Auth button */}
        <div className="mb-8">
          <GoogleAuthButton onSuccess={handleSuccess} onError={handleError} />
        </div>

        {/* Additional info */}
        <div className="text-sm text-white/70 space-y-2">
          <p>• Sign in with your @rvu.edu.in Google account</p>
          <p>• One jersey per account</p>
          <p>• Limited quantity available</p>
        </div>
      </div>

      {/* Floating particles for holographic effect (client-only generated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
