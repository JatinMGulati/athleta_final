export const dynamic = 'force-dynamic';

"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HolographicCross from '@/components/HolographicCross';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const n = searchParams.get('n');
    const last = sessionStorage.getItem('athleta_last_error');
    if (n && last && n === last) {
      setOk(true);
      sessionStorage.removeItem('athleta_last_error');
    } else {
      window.location.replace('/');
    }
  }, [searchParams]);

  if (!ok) return null;
  const reason = searchParams.get('reason') || 'Unknown error occurred';
  return <HolographicCross reason={reason} />;
}
