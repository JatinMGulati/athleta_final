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
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const pushLog = (msg: string) => {
    // keep recent logs at top
    setDebugLogs((s) => [msg, ...s].slice(0, 10));
    console.debug(msg);
  };
  const [showOpenInBrowser, setShowOpenInBrowser] = useState(false);

  const openInSystemBrowser = () => {
    if (typeof window !== 'undefined') {
      // Open the same URL in a new tab/window — many in-app browsers will open an external browser
      window.open(window.location.href, '_blank', 'noopener');
    }
  };

  useEffect(() => {
    // If the user returned from a redirect sign-in (mobile), try getRedirectResult first,
    // then register an onAuthStateChanged fallback in case cookies or redirect result are missing.
    (async () => {
      const auth = getAuthClient();
      let processed = false;

      // quick environment checks for mobile debugging
      try {
        if (typeof window !== 'undefined') {
          pushLog('location: ' + window.location.href);
          pushLog('cookies: ' + (document.cookie || '<empty>'));
          try {
            pushLog('session success key: ' + (sessionStorage.getItem('athleta_last_success') ?? '<none>'));
            pushLog('session error key: ' + (sessionStorage.getItem('athleta_last_error') ?? '<none>'));
          } catch (e) {
            pushLog('sessionStorage unavailable: ' + String(e));
          }
        }
      } catch (e) {
        console.warn('debug env probes failed', e);
      }

      type FirebaseUser = { email?: string | null; uid?: string; displayName?: string | null };
      const processUser = async (user: FirebaseUser | null) => {
        if (!user || processed) return;
        processed = true;
        try {
          pushLog(`processing user: ${user?.email ?? 'no-email'}`);
          const email = user.email?.trim().toLowerCase();
          if (!email) {
            pushLog('no email on user object');
            handleError('Unable to get email from Google account');
            return;
          }
          if (!email.endsWith('@rvu.edu.in')) {
            pushLog('email domain not allowed: ' + email);
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
          pushLog('processing user failed: ' + String(err));
          handleError('An error occurred during sign-in (redirect). Please try again.');
        }
      };

      try {
  const result = await getRedirectResult(auth);
  pushLog('getRedirectResult completed: ' + (result ? 'has-result' : 'no-result'));
        if (result && result.user) {
          pushLog('getRedirectResult returned user: ' + (result.user.email ?? 'no-email'));
          await processUser(result.user);
        } else {
          pushLog('no redirect result; registering onAuthStateChanged fallback');
          // register auth-state fallback
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            pushLog('onAuthStateChanged invoked; user: ' + (user ? user.email : 'null'));
            if (user) {
              pushLog('onAuthStateChanged detected user after redirect: ' + (user.email ?? 'no-email'));
              await processUser(user);
              unsubscribe();
            }
          });
          // If nothing arrives shortly, offer to open in system browser (helpful for in-app browsers)
          setTimeout(() => {
            try {
              const cookies = typeof document !== 'undefined' ? document.cookie : '';
              const hasSession = typeof window !== 'undefined' && ((localStorage.getItem('athleta_last_success') ?? sessionStorage.getItem('athleta_last_success')) || (localStorage.getItem('athleta_last_error') ?? sessionStorage.getItem('athleta_last_error')));
              if (!processed && !cookies && !hasSession) {
                pushLog('No cookies or session detected after redirect — offering system browser fallback');
                setShowOpenInBrowser(true);
              }
            } catch (e) {
              // ignore
            }
          }, 800);
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
          {/* Debug logs (visible during testing) */}
          <div className="mt-4 text-left text-xs text-white/70 max-w-md mx-auto p-3 bg-black/40 rounded">
            <div className="font-semibold text-white/90 mb-2">Debug logs (mobile)</div>
            {debugLogs.length === 0 ? (
              <div className="text-white/50">no logs yet</div>
            ) : (
              <ul className="space-y-1">
                {debugLogs.map((l, i) => (
                  <li key={i} className="truncate">{l}</li>
                ))}
              </ul>
            )}
          </div>
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
