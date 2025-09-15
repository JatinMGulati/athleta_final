"use client";

export const dynamic = 'force-dynamic';

import HolographicTick from '@/components/HolographicTick';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const n = params.get('n');
    const last = sessionStorage.getItem('athleta_last_success');
    if (n && last && n === last) {
      setOk(true);
      sessionStorage.removeItem('athleta_last_success');
    } else {
      window.location.replace('/');
    }
  }, []);

  if (!ok) return null;
  return <HolographicTick />;
}
