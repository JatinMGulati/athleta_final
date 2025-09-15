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
    const last = sessionStorage.getItem('athleta_last_error');
    if (n && last && n === last) {
      setReason(r || 'Unknown error occurred');
      setOk(true);
      sessionStorage.removeItem('athleta_last_error');
    } else {
      window.location.replace('/');
    }
  }, []);

  if (!ok) return null;
  return <HolographicCross reason={reason} />;
}
