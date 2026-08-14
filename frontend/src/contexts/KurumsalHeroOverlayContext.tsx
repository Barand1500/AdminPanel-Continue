import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { KurumsalHeroYukseklik } from '@/types/kurumsalHero';

export interface KurumsalHeroOverlayState {
  active: boolean;
  yukseklik: KurumsalHeroYukseklik;
  ustBantGoster: boolean;
}

interface KurumsalHeroOverlayContextValue extends KurumsalHeroOverlayState {
  activate: (opts: { yukseklik?: KurumsalHeroYukseklik; ustBantGoster?: boolean }) => void;
  deactivate: () => void;
}

const VARSAYILAN: KurumsalHeroOverlayState = {
  active: false,
  yukseklik: '85vh',
  ustBantGoster: true,
};

const KurumsalHeroOverlayContext = createContext<KurumsalHeroOverlayContextValue | null>(null);

export function KurumsalHeroOverlayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KurumsalHeroOverlayState>(VARSAYILAN);

  const activate = useCallback(
    (opts: { yukseklik?: KurumsalHeroYukseklik; ustBantGoster?: boolean }) => {
      setState({
        active: true,
        yukseklik: opts.yukseklik ?? '85vh',
        ustBantGoster: opts.ustBantGoster ?? true,
      });
    },
    []
  );

  const deactivate = useCallback(() => {
    setState(VARSAYILAN);
  }, []);

  const value = useMemo(
    () => ({ ...state, activate, deactivate }),
    [state, activate, deactivate]
  );

  return (
    <KurumsalHeroOverlayContext.Provider value={value}>{children}</KurumsalHeroOverlayContext.Provider>
  );
}

export function useKurumsalHeroOverlay() {
  const ctx = useContext(KurumsalHeroOverlayContext);
  if (!ctx) {
    return {
      ...VARSAYILAN,
      activate: () => {},
      deactivate: () => {},
    };
  }
  return ctx;
}
