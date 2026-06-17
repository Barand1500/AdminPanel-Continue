import { useMemo } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { HeaderAyarlari } from '@/types/header';
import { headerAyarlariBirlestir } from '@/types/header';
import { SiteHeader } from '@/components/ortak/SiteHeader';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { SiteDilProvider } from '@/contexts/SiteDilContext';

interface SiteHeaderOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
  menuOgeleri: MenuOgesi[];
}

export function SiteHeaderOnizleme({
  siteAdi,
  ayarlar,
  headerAyarlari: headerProp,
  iletisim,
  menuOgeleri,
}: SiteHeaderOnizlemeProps) {
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

  return (
    <SiteDilProvider ayarlar={onizlemeAyarlar}>
      <div className="ap-site-header-onizleme site-public min-w-0">
        <SiteHeader siteAdi={siteAdi} ayarlar={onizlemeAyarlar} menuOgeleri={menuOgeleri} />
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
