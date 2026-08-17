import type { CSSProperties } from 'react';
import type { SiteAyarlari } from '@/types/site';
import { footerAyarlariBirlestir, type FooterAyarlari } from '@/types/footer';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { FooterLayoutSec, footerTipSinifi } from './footer/FooterLayouts';

function footerRenkStili(footer: FooterAyarlari): CSSProperties | undefined {
  const ek = footer.tipEk;
  if (footer.footerTipi === 'kurumsal') {
    return {
      '--kurumsal-footer-bg': ek?.arkaPlanRengi || '#0b2a77',
      '--kurumsal-footer-alt-bg': ek?.altBantRengi || '#08245f',
      '--kurumsal-footer-text': ek?.metinRengi || '#ffffff',
      '--kurumsal-footer-icon-bg': ek?.ikonArkaPlanRengi || '#08245f',
    } as CSSProperties;
  }
  if (footer.footerTipi === 'split') {
    return {
      '--footer-split-bg': ek?.arkaPlanRengi || '#0f172a',
      '--footer-split-text': ek?.metinRengi || '#ffffff',
    } as CSSProperties;
  }
  if (footer.footerTipi === 'cta-serit') {
    return {
      '--footer-cta-bg': ek?.arkaPlanRengi || 'var(--color-primary)',
      '--footer-cta-text': ek?.metinRengi || '#ffffff',
    } as CSSProperties;
  }
  return undefined;
}

interface SiteFooterProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
}

export function SiteFooter({ siteAdi, ayarlar }: SiteFooterProps) {
  const { cevir } = useSiteDil();
  const footer = footerAyarlariBirlestir(ayarlar);
  const tipSinif = footerTipSinifi(footer.footerTipi);
  const renkler = footerRenkStili(footer);

  return (
    <footer className={`site-footer mt-auto ${tipSinif}`} style={renkler}>
      <FooterLayoutSec siteAdi={siteAdi} ayarlar={ayarlar} footer={footer} cevir={cevir} />
    </footer>
  );
}
