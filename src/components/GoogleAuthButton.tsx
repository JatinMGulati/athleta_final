"use client";

import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { getAuthClient, getGoogleProvider } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { validateRVUEmail } from '@/lib/utils';

interface GoogleAuthButtonProps {
  onSuccess: () => void;
  onError: (reason: string) => void;
}

export default function GoogleAuthButton({ onSuccess, onError }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Try popup first, fallback to redirect if blocked
      const result = await signInWithPopup(getAuthClient(), getGoogleProvider());
      const user = result.user;
      const email = user.email?.trim();

      if (!email) {
        onError('Unable to get email from Google account');
        return;
      }

      // Validate email format
      if (!validateRVUEmail(email)) {
        await signOut(getAuthClient());
        onError('Please use a Google account with @rvu.edu.in email address');
        return;
      }

      // Check for existing claim
      const db = getDb();
      const emailDocId = email; // Use exact email as doc ID
      const claimRef = doc(db, 'jerseyClaims', emailDocId);
      
      try {
        const existing = await getDoc(claimRef);
        if (existing.exists()) {
          await signOut(getAuthClient());
          onError('This email has already been used to claim a jersey');
          return;
        }
      } catch (e) {
        console.error('[ClaimCheckError]', e);
        // Continue to write attempt
      }

      // Create the claim
      try {
        await setDoc(
          claimRef,
          {
            email: email,
            uid: user.uid,
            displayName: user.displayName,
            claimedAt: serverTimestamp(),
            status: 'claimed',
          },
          { merge: false }
        );
        
        onSuccess();
      } catch (e: unknown) {
        console.error('[ClaimWriteError]', e);
        const error = e as { code?: string; message?: string };
        if (error?.code === 'permission-denied' || String(error?.message).includes('Missing or insufficient permissions')) {
          await signOut(getAuthClient());
          onError('This email is not eligible or has already claimed a jersey');
          return;
        }
        onError(`An error occurred while writing claim: ${error?.message || String(e)}`);
        return;
      }
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      const authError = error as { code?: string; message?: string };
      
      if (authError?.code === 'auth/popup-closed-by-user') {
        onError('Sign-in was cancelled');
      } else if (authError?.code === 'auth/popup-blocked') {
        // Fallback to redirect for mobile/in-app browsers
        try {
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(getAuthClient(), getGoogleProvider());
          return;
        } catch {
          onError('Popup blocked. Please allow popups or try again.');
        }
      } else {
        onError(`An error occurred during sign-in: ${authError?.message || String(error)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

   return (
     <div className="max-w-md mx-auto">
       <button
         onClick={handleGoogleSignIn}
         disabled={isLoading}
         className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-3"
       >
         {isLoading ? (
           <>
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             <span>Signing in...</span>
           </>
         ) : (
           <>
             <svg className="w-5 h-5" viewBox="0 0 24 24">
               <path
                 fill="currentColor"
                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
               />
               <path
                 fill="currentColor"
                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
               />
               <path
                 fill="currentColor"
                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
               />
               <path
                 fill="currentColor"
                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
               />
             </svg>
             <span>Sign in with Google</span>
           </>
         )}
       </button>
       
       <p className="text-sm text-white/70 mt-4 text-center">
         Only @rvu.edu.in Google accounts are accepted
       </p>
     </div>
   );
 }
