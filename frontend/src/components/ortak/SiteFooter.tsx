import type { SiteAyarlari } from '@/types/site';
import { footerAyarlariBirlestir } from '@/types/footer';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { FooterLayoutSec, footerTipSinifi } from './footer/FooterLayouts';

interface SiteFooterProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
}

export function SiteFooter({ siteAdi, ayarlar }: SiteFooterProps) {
  const { cevir } = useSiteDil();
  const footer = footerAyarlariBirlestir(ayarlar);
  const tipSinif = footerTipSinifi(footer.footerTipi);

  return (
    <footer className={`site-footer mt-auto ${tipSinif}`}>
      <FooterLayoutSec siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
    </footer>
  );
}
