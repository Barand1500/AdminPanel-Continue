import type { CSSProperties } from 'react';
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
  const renkler = footer.footerTipi === 'kurumsal'
    ? {
        '--kurumsal-footer-bg': footer.tipEk?.arkaPlanRengi || '#0b2a77',
        '--kurumsal-footer-alt-bg': footer.tipEk?.altBantRengi || '#08245f',
        '--kurumsal-footer-text': footer.tipEk?.metinRengi || '#ffffff',
        '--kurumsal-footer-icon-bg': footer.tipEk?.ikonArkaPlanRengi || '#08245f',
      } as CSSProperties
    : undefined;

  return (
    <footer className={`site-footer mt-auto ${tipSinif}`} style={renkler}>
      <FooterLayoutSec siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
    </footer>
  );
}
