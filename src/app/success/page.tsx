export const dynamic = 'force-dynamic';

"use client";
import HolographicTick from '@/components/HolographicTick';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const n = params.get('n');
    const last = sessionStorage.getItem('athleta_last_success');
    if (n && last && n === last) {
      setOk(true);
      sessionStorage.removeItem('athleta_last_success');
    } else {
      window.location.replace('/');
    }
  }, [params]);

  if (!ok) return null;
  return <HolographicTick />;
}
