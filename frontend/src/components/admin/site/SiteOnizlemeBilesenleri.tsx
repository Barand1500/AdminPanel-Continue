import { useEffect, useMemo, useState } from 'react';
import type { SiteAyarlari } from '@/types/site';
import type { HeaderAyarlari } from '@/types/header';
import type { Kategori } from '@/data/kategoriler';
import type { NavKategoriKayit } from '@/types/navKategori';
import { headerAyarlariBirlestir } from '@/types/header';
import { SiteHeader } from '@/components/ortak/SiteHeader';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { SiteDilProvider } from '@/contexts/SiteDilContext';
import { adminSayfalariGetir } from '@/features/admin/sayfaApi';
import { navKategorileriGetir } from '@/features/admin/navKategoriApi';
import { navKategorileriMenuyeCevir } from '@/utils/navKategoriAgaci';
import { headerMenuOlustur } from '@/utils/menuYardimci';

interface SiteHeaderOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
}

export function SiteHeaderOnizleme({
  siteAdi,
  ayarlar,
  headerAyarlari: headerProp,
  iletisim,
}: SiteHeaderOnizlemeProps) {
  const [sayfalar, setSayfalar] = useState<Awaited<ReturnType<typeof adminSayfalariGetir>>>([]);
  const [navKayitlar, setNavKayitlar] = useState<NavKategoriKayit[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[] | undefined>();

  useEffect(() => {
    adminSayfalariGetir()
      .then(setSayfalar)
      .catch(() => setSayfalar([]));
    navKategorileriGetir()
      .then((k) => {
        setNavKayitlar(k);
        setKategoriler(navKategorileriMenuyeCevir(k));
      })
      .catch(() => {
        setNavKayitlar([]);
        setKategoriler(undefined);
      });
  }, []);

  const onizlemeAyarlar = useMemo((): SiteAyarlari => {
    const base = ayarlar ?? {};
    const headerJson = headerProp ?? headerAyarlariBirlestir(ayarlar);
    return {
      ...base,
      telefon: iletisim?.telefon ?? base.telefon,
      email: iletisim?.email ?? base.email,
      headerAyarlariJson: headerJson,
    };
  }, [ayarlar, headerProp, iletisim]);

  const menuOgeleri = useMemo(
    () => headerMenuOlustur(sayfalar, onizlemeAyarlar.headerAyarlariJson, onizlemeAyarlar),
    [sayfalar, onizlemeAyarlar]
  );

  return (
    <SiteDilProvider ayarlar={onizlemeAyarlar} sayfalar={sayfalar} navKategoriler={navKayitlar}>
      <div className="ap-site-header-onizleme site-public min-w-0">
        <SiteHeader
          siteAdi={siteAdi}
          ayarlar={onizlemeAyarlar}
          menuOgeleri={menuOgeleri}
          kategoriler={kategoriler}
        />
      </div>
    </SiteDilProvider>
  );
}

interface SiteFooterOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
}

export function SiteFooterOnizleme({ siteAdi, ayarlar }: SiteFooterOnizlemeProps) {
  return <SiteFooter siteAdi={siteAdi} ayarlar={ayarlar} />;
}
