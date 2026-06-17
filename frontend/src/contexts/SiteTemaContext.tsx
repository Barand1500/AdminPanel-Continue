import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type SiteTema = 'acik' | 'koyu';

const STORAGE_KEY = 'gt_site_tema';

interface SiteTemaContextDeger {
  tema: SiteTema;
  temaDegistir: () => void;
  koyuMu: boolean;
}

const SiteTemaContext = createContext<SiteTemaContextDeger | null>(null);

function temaOku(): SiteTema {
  try {
    const kayit = localStorage.getItem(STORAGE_KEY);
    return kayit === 'koyu' ? 'koyu' : 'acik';
  } catch {
    return 'acik';
  }
}

export function SiteTemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<SiteTema>(temaOku);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tema);
    document.documentElement.setAttribute('data-site-tema', tema);
    return () => document.documentElement.removeAttribute('data-site-tema');
  }, [tema]);

  const temaDegistir = useCallback(() => {
    setTema((t) => (t === 'acik' ? 'koyu' : 'acik'));
  }, []);

  return (
    <SiteTemaContext.Provider value={{ tema, temaDegistir, koyuMu: tema === 'koyu' }}>
      {children}
    </SiteTemaContext.Provider>
  );
}

export function useSiteTema() {
  const ctx = useContext(SiteTemaContext);
  if (!ctx) {
    return {
      tema: 'acik' as SiteTema,
      koyuMu: false,
      temaDegistir: () => {},
    };
  }
  return ctx;
}
