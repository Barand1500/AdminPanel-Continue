import { Outlet, useMatches } from 'react-router-dom';
import { SiteHeader } from '@/components/ortak/SiteHeader';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { BakimEkrani } from '@/components/ortak/BakimEkrani';
import { FloatingButonlar } from '@/components/eticaret/FloatingButonlar';
import { SiteTemaProvider } from '@/contexts/SiteTemaContext';
import { SiteAuthProvider } from '@/contexts/SiteAuthContext';
import { useSiteVerisi } from '@/hooks/useSiteVerisi';
import { useSiteTemaUygula } from '@/hooks/useSiteTemaUygula';
import { headerAyarlariBirlestir } from '@/types/header';
import { headerMenuOlustur } from '@/utils/menuYardimci';
import { varsayilanSayfa404 } from '@/types/sistemAyarlari';
import type { SiteAyarlari } from '@/types/site';
import type { SistemAyarlariJson } from '@/types/sistemAyarlari';

function sistemCoz(ayarlar: SiteAyarlari | null): SistemAyarlariJson | null {
  const json = (ayarlar as { sistemAyarlariJson?: unknown } | null)?.sistemAyarlariJson;
  if (!json || typeof json !== 'object') return null;
  return json as SistemAyarlariJson;
}

function SiteLayoutIcerik() {
  const { veri, yukleniyor } = useSiteVerisi();
  const { site } = veri;
  const headerAyarlari = headerAyarlariBirlestir(site.ayarlar);
  const menuOgeleri = headerMenuOlustur(veri.sayfalar, headerAyarlari, site.ayarlar);
  const sistem = sistemCoz(site.ayarlar);
  const matches = useMatches() as { handle?: { is404?: boolean } }[];
  const is404 = matches.some((m) => m.handle?.is404);
  const menuTipi = { ...varsayilanSayfa404, ...sistem?.sayfa404 }.menuTipi;

  useSiteTemaUygula(site.ayarlar, site.ad);

  const headerGoster = !is404 || menuTipi === 'ust' || menuTipi === 'her-ikisi';
  const footerGoster = !is404 || menuTipi === 'footer' || menuTipi === 'her-ikisi';

  if (yukleniyor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (sistem?.bakimModu) {
    return <BakimEkrani siteAdi={site.ad} ayarlar={site.ayarlar} />;
  }

  return (
    <div className="site-public flex min-h-screen flex-col">
      {headerGoster && <SiteHeader siteAdi={site.ad} ayarlar={site.ayarlar} menuOgeleri={menuOgeleri} />}
      <main className="flex-1">
        <Outlet context={veri} />
      </main>
      {footerGoster && <SiteFooter siteAdi={site.ad} ayarlar={site.ayarlar} />}
      <FloatingButonlar ayarlar={site.ayarlar} />
    </div>
  );
}

export function SiteLayout() {
  return (
    <SiteTemaProvider>
      <SiteAuthProvider>
        <SiteLayoutIcerik />
      </SiteAuthProvider>
    </SiteTemaProvider>
  );
}
