import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { headerAyarlariBirlestir } from '@/types/header';
import { aktifDiller, SITE_DIL_STORAGE } from '@/data/siteDilleri';
import { siteCeviriBirlestir, SLUG_SITE_ANAHTAR, sayfaSlugCeviriAnahtarlari, menuMetinCeviriAnahtar } from '@/i18n/siteSozluk';
import { sayfaSegmentSlug } from '@/utils/sayfaAgaci';
import type { SiteAyarlari, Sayfa } from '@/types/site';

interface SiteDilContextDegeri {
  dilKodu: string;
  dilAyarla: (kod: string) => void;
  cevir: (anahtar: string, varsayilan?: string) => string;
  sayfaBaslik: (slug: string, varsayilan: string) => string;
}

const SiteDilContext = createContext<SiteDilContextDegeri | null>(null);

export function SiteDilProvider({
  ayarlar,
  sayfalar,
  children,
}: {
  ayarlar?: SiteAyarlari | null;
  sayfalar?: Sayfa[];
  children: ReactNode;
}) {
  const header = headerAyarlariBirlestir(ayarlar);
  const dilDestegi = header.dilDestegi!;
  const [dilKodu, setDilKodu] = useState(dilDestegi.varsayilanDil);

  useEffect(() => {
    const kayitli = localStorage.getItem(SITE_DIL_STORAGE);
    const aktif = aktifDiller(dilDestegi);
    if (kayitli && aktif.some((d) => d.kod === kayitli)) {
      setDilKodu(kayitli);
    } else {
      setDilKodu(dilDestegi.varsayilanDil);
    }
  }, [dilDestegi.varsayilanDil, dilDestegi.diller]);

  useEffect(() => {
    function dinle(e: Event) {
      const kod = (e as CustomEvent<string>).detail;
      if (kod) setDilKodu(kod);
    }
    window.addEventListener('site-dil-degisti', dinle);
    return () => window.removeEventListener('site-dil-degisti', dinle);
  }, []);

  const menuMetinleri = useMemo(() => {
    const fromMenu = (header.ustMenu ?? []).map((m) => m.ad);
    const fromSayfa = sayfalar?.filter((s) => s.menudeGoster !== false).map((s) => s.baslik) ?? [];
    return [...new Set([...fromMenu, ...fromSayfa])];
  }, [header.ustMenu, sayfalar]);

  const sozluk = useMemo(
    () =>
      siteCeviriBirlestir(
        dilKodu,
        dilDestegi.ceviriler?.[dilKodu],
        sayfalar?.map((s) => ({ slug: s.slug, baslik: s.baslik })),
        dilDestegi.varsayilanDil,
        menuMetinleri,
        dilDestegi.ceviriler
      ),
    [dilKodu, dilDestegi.ceviriler, dilDestegi.varsayilanDil, sayfalar, menuMetinleri]
  );

  const sayfaBaslik = useCallback(
    (slug: string, varsayilan: string) => {
      const temiz = slug.replace(/^\/+|\/+$/g, '');
      for (const key of sayfaSlugCeviriAnahtarlari(temiz)) {
        if (sozluk[key]) return sozluk[key];
      }
      const siteKey = SLUG_SITE_ANAHTAR[temiz] ?? SLUG_SITE_ANAHTAR[sayfaSegmentSlug(temiz)];
      if (siteKey && sozluk[siteKey]) return sozluk[siteKey];
      const menuKey = menuMetinCeviriAnahtar(varsayilan);
      if (menuKey && sozluk[menuKey]) return sozluk[menuKey];
      return varsayilan;
    },
    [sozluk]
  );

  const cevir = useCallback(
    (anahtar: string, varsayilan = '') => sozluk[anahtar] ?? varsayilan,
    [sozluk]
  );

  const deger = useMemo(
    () => ({ dilKodu, dilAyarla: setDilKodu, cevir, sayfaBaslik }),
    [dilKodu, cevir, sayfaBaslik]
  );

  return <SiteDilContext.Provider value={deger}>{children}</SiteDilContext.Provider>;
}

export function useSiteDil() {
  const ctx = useContext(SiteDilContext);
  if (!ctx) {
    return {
      dilKodu: 'TR',
      dilAyarla: () => {},
      cevir: (_k: string, v?: string) => v ?? '',
      sayfaBaslik: (_s: string, v: string) => v,
    };
  }
  return ctx;
}
