"use client";

export const dynamic = 'force-dynamic';

import HolographicTick from '@/components/HolographicTick';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const n = params.get('n');
    const last = typeof window !== 'undefined' ? (sessionStorage.getItem('athleta_last_success') || localStorage.getItem('athleta_last_success')) : null;
    if (n && last && n === last) {
      setOk(true);
      try { sessionStorage.removeItem('athleta_last_success'); } catch {}
      try { localStorage.removeItem('athleta_last_success'); } catch {}
    } else {
      window.location.replace('/');
    }
  }, []);

  if (!ok) return null;
  return <HolographicTick />;
}
