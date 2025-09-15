'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HolographicCross from '@/components/HolographicCross';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const n = searchParams.get('n');
    const last = sessionStorage.getItem('athleta_last_error');
    if (n && last && n === last) {
      setOk(true);
      sessionStorage.removeItem('athleta_last_error');
    } else {
      router.replace('/');
    }
  }, [searchParams, router]);

  if (!ok) return null;
  const reason = searchParams.get('reason') || 'Unknown error occurred';
  return <HolographicCross reason={reason} />;
}
