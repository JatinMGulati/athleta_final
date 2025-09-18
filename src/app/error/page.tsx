"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import HolographicCross from '@/components/HolographicCross';

export default function ErrorPage() {
  const [ok, setOk] = useState(false);
  const [reason, setReason] = useState('Unknown error occurred');

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const n = params.get('n');
    const r = params.get('reason');
    const last = typeof window !== 'undefined' ? (sessionStorage.getItem('athleta_last_error') || localStorage.getItem('athleta_last_error')) : null;
    if (n && last && n === last) {
      setReason(r || 'Unknown error occurred');
      setOk(true);
      try { sessionStorage.removeItem('athleta_last_error'); } catch {}
      try { localStorage.removeItem('athleta_last_error'); } catch {}
    } else {
      window.location.replace('/');
    }
  }, []);

  if (!ok) return null;
  return <HolographicCross reason={reason} />;
}
