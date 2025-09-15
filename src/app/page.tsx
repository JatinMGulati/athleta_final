'use client';

import Image from "next/image";
// router navigation replaced by window.location.href for robustness in dev
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createAndStoreNonce } from '@/lib/utils';
import { getAuthClient, getDb } from '@/lib/firebase';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const GoogleAuthButton = dynamic(() => import("@/components/GoogleAuthButton"), {
  ssr: false,
});

export default function Home() {
  const [particles, setParticles] = useState<{ left: number; top: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // If the user returned from a redirect sign-in (mobile), try getRedirectResult first,
    // then register an onAuthStateChanged fallback in case cookies or redirect result are missing.
    (async () => {
      const auth = getAuthClient();
      let processed = false;

      type FirebaseUser = { email?: string | null; uid?: string; displayName?: string | null };
      const processUser = async (user: FirebaseUser | null) => {
        if (!user || processed) return;
        processed = true;
        try {
          const email = user.email?.trim().toLowerCase();
          if (!email) {
            handleError('Unable to get email from Google account');
            return;
          }
          if (!email.endsWith('@rvu.edu.in')) {
            await auth.signOut();
            handleError('Please use a Google account with @rvu.edu.in email address');
            return;
          }

          const db = getDb();
          const emailDocId = email;
          const claimRef = doc(db, 'jerseyClaims', emailDocId);
          const existing = await getDoc(claimRef);
          if (existing.exists()) {
            await auth.signOut();
            handleError('This email has already been used to claim a jersey');
            return;
          }

          await setDoc(claimRef, { email, uid: user.uid, displayName: user.displayName, claimedAt: serverTimestamp(), status: 'claimed' }, { merge: false });
          handleSuccess();
        } catch (err) {
          console.error('Processing redirected user failed:', err);
          handleError('An error occurred during sign-in (redirect). Please try again.');
        }
      };

      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.debug('getRedirectResult returned user', result.user.email);
          await processUser(result.user);
        } else {
          // register auth-state fallback
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              console.debug('onAuthStateChanged detected user after redirect', user.email);
              await processUser(user);
              unsubscribe();
            }
          });
          // Optional: cleanup when component unmounts
          // We'll rely on the closure; nothing else required here.
        }
      } catch (e) {
        console.error('Redirect sign-in handling failed:', e);
        // Don't fail silently; let user know something went wrong
        handleError('An error occurred during sign-in (redirect). Please try again.');
      }
    })();

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
          Claim your jersey and join the Atleta community{" "}
          <a
          href="https://www.instagram.com/atleta_rvu/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:underline"
          >
            @atleta_rvu
          </a>
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
