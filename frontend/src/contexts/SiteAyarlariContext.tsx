import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { adminSiteApi, type AdminSiteBilgi } from '@/features/site/adminSiteApi';
import type { SiteAyarlari } from '@/types/site';
import type { HeaderAyarlari } from '@/types/header';
import { headerAyarlariBirlestir } from '@/types/header';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

interface SiteAyarlariContextType {
  site: AdminSiteBilgi | null;
  siteAd: string;
  ayarlar: SiteAyarlari | null;
  headerAyarlari: HeaderAyarlari;
  yukleniyor: boolean;
  hata: string | null;
  kirli: boolean;
  kaydediliyor: boolean;
  alanGuncelle: <K extends keyof SiteAyarlari>(alan: K, deger: SiteAyarlari[K]) => void;
  headerGuncelle: (header: HeaderAyarlari) => void;
  siteAdGuncelle: (ad: string) => void;
  kaydet: () => Promise<void>;
  yenile: () => Promise<void>;
}

const SiteAyarlariContext = createContext<SiteAyarlariContextType | null>(null);

export function SiteAyarlariProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<AdminSiteBilgi | null>(null);
  const [ayarlar, setAyarlar] = useState<SiteAyarlari | null>(null);
  const [orijinal, setOrijinal] = useState<string>('');
  const [siteAd, setSiteAd] = useState('');
  const [orijinalSiteAd, setOrijinalSiteAd] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const headerAyarlari = useMemo(
    () => headerAyarlariBirlestir(ayarlar),
    [ayarlar]
  );

  const kirli = useMemo(() => {
    const ayarlarJson = JSON.stringify(ayarlar ?? {});
    return ayarlarJson !== orijinal || siteAd !== orijinalSiteAd;
  }, [ayarlar, orijinal, siteAd, orijinalSiteAd]);

  const yenile = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const veri = await adminSiteApi.ayarlariGetir();
      setSite(veri.site);
      setSiteAd(veri.site.ad);
      setOrijinalSiteAd(veri.site.ad);
      setAyarlar(veri.ayarlar ?? {});
      setOrijinal(JSON.stringify(veri.ayarlar ?? {}));
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Veri yuklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    yenile();
  }, [yenile]);

  const alanGuncelle = useCallback(<K extends keyof SiteAyarlari>(
    alan: K,
    deger: SiteAyarlari[K]
  ) => {
    setAyarlar((onceki) => ({ ...(onceki ?? {}), [alan]: deger }));
  }, []);

  const headerGuncelle = useCallback((header: HeaderAyarlari) => {
    setAyarlar((onceki) => ({
      ...(onceki ?? {}),
      headerAyarlariJson: header,
    }));
  }, []);

  const siteAdGuncelle = useCallback((ad: string) => {
    setSiteAd(ad);
  }, []);

  const kaydet = useCallback(async () => {
    if (!ayarlar) return;
    setKaydediliyor(true);
    setHata(null);
    try {
      const payload: Record<string, unknown> = {
        logoUrl: ayarlar.logoUrl ?? null,
        faviconUrl: ayarlar.faviconUrl ?? null,
        anaRenk: ayarlar.anaRenk,
        ikincilRenk: ayarlar.ikincilRenk,
        font: ayarlar.font,
        telefon: ayarlar.telefon ?? null,
        email: ayarlar.email ?? null,
        whatsapp: ayarlar.whatsapp ?? null,
        adres: ayarlar.adres ?? null,
        telifYazisi: ayarlar.telifYazisi ?? null,
        sosyalMedyaJson: ayarlar.sosyalMedyaJson ?? null,
        headerAyarlariJson: ayarlar.headerAyarlariJson ?? null,
        heroJson: ayarlar.heroJson ?? null,
        footerAyarlariJson: ayarlar.footerAyarlariJson ?? null,
        blogAyarlariJson: ayarlar.blogAyarlariJson ?? null,
        temaAyarlariJson: ayarlar.temaAyarlariJson ?? null,
      };
      if (siteAd !== orijinalSiteAd) payload.siteAd = siteAd;

      const veri = await adminSiteApi.ayarlariGuncelle(payload);
      setSite(veri.site);
      setSiteAd(veri.site.ad);
      setOrijinalSiteAd(veri.site.ad);
      setAyarlar(veri.ayarlar ?? {});
      setOrijinal(JSON.stringify(veri.ayarlar ?? {}));
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayit basarisiz');
    } finally {
      setKaydediliyor(false);
    }
  }, [ayarlar, siteAd, orijinalSiteAd]);

  return (
    <SiteAyarlariContext.Provider
      value={{
        site,
        siteAd,
        ayarlar,
        headerAyarlari,
        yukleniyor,
        hata,
        kirli,
        kaydediliyor,
        alanGuncelle,
        headerGuncelle,
        siteAdGuncelle,
        kaydet,
        yenile,
      }}
    >
      {children}
    </SiteAyarlariContext.Provider>
  );
}

export function useSiteAyarlariYonetimi() {
  const ctx = useContext(SiteAyarlariContext);
  if (!ctx) {
    throw new Error('useSiteAyarlariYonetimi SiteAyarlariProvider icinde kullanilmali');
  }
  return ctx;
}
