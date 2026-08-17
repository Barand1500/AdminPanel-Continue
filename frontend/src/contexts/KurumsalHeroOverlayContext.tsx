import { createContext, useContext, useMemo, type ReactNode } from 'react';
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

export function KurumsalHeroOverlayProvider({
  children,
  durum = VARSAYILAN,
}: {
  children: ReactNode;
  durum?: KurumsalHeroOverlayState;
}) {
  const value = useMemo<KurumsalHeroOverlayContextValue>(
    () => ({
      ...durum,
      activate: () => {},
      deactivate: () => {},
    }),
    [durum]
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
