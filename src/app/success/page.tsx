"use client";
import HolographicTick from '@/components/HolographicTick';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const n = params.get('n');
    const last = sessionStorage.getItem('athleta_last_success');
    if (n && last && n === last) {
      setOk(true);
      sessionStorage.removeItem('athleta_last_success');
    } else {
      router.replace('/');
    }
  }, [params, router]);

  if (!ok) return null;
  return <HolographicTick />;
}
