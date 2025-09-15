'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface JerseyClaimFormProps {
  onSuccess: () => void;
  onError: (reason: string) => void;
}

export default function JerseyClaimForm({ onSuccess, onError }: JerseyClaimFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const rvuEmailRegex = /^[a-zA-Z0-9._%+-]+@rvu\.edu\.in$/;
    return rvuEmailRegex.test(email);
  };

  const checkEmailUniqueness = async (email: string): Promise<boolean> => {
    try {
      const q = query(collection(db, 'jerseyClaims'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email format
      if (!validateEmail(email)) {
        onError('Please use a valid @rvu.edu.in email address');
        return;
      }

      // Check if email is unique
      const isUnique = await checkEmailUniqueness(email);
      if (!isUnique) {
        onError('This email has already been used to claim a jersey');
        return;
      }

      // Add claim to Firestore
      await addDoc(collection(db, 'jerseyClaims'), {
        email: email,
        claimedAt: new Date(),
        status: 'claimed'
      });

      onSuccess();
    } catch (error) {
      console.error('Error claiming jersey:', error);
      onError('An error occurred while claiming your jersey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@rvu.edu.in"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Claiming Jersey...</span>
            </div>
          ) : (
            'Claim My Jersey'
          )}
        </button>
      </form>
    </div>
  );
}
