import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { Sayfa } from '@/types/site';
import { idString } from '@/utils/idKarsilastir';

export function useAktifSayfaId(sayfalar: Sayfa[]): string | null {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (pathname === '/' || pathname === '') return null;
    const slug = pathname.replace(/^\/+/, '').split('/')[0];
    const sayfa = sayfalar.find((s) => s.slug === slug);
    return sayfa ? idString(sayfa.id) : null;
  }, [pathname, sayfalar]);
}
