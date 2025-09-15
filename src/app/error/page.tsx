'use client';

import { useSearchParams } from 'next/navigation';
import HolographicCross from '@/components/HolographicCross';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Unknown error occurred';

  return <HolographicCross reason={reason} />;
}
