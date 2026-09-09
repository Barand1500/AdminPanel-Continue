import type { CSSProperties } from 'react';
import type { SiteAyarlari } from '@/types/site';
import { footerAyarlariBirlestir, type FooterAyarlari } from '@/types/footer';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { FooterLayoutSec, footerTipSinifi } from './footer/FooterLayouts';

function saydamRenk(hex: string, opaklik: number): string {
  const temiz = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(temiz)) return hex;
  const r = Number.parseInt(temiz.slice(0, 2), 16);
  const g = Number.parseInt(temiz.slice(2, 4), 16);
  const b = Number.parseInt(temiz.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, opaklik))})`;
}

function lineerGradient(baslangic: string, bitis: string, aci: number, opaklik: number): string {
  return `linear-gradient(${aci}deg, ${saydamRenk(baslangic, opaklik)} 0%, ${saydamRenk(bitis, opaklik)} 100%)`;
}

function footerRenkStili(footer: FooterAyarlari): CSSProperties | undefined {
  const ek = footer.tipEk;
  if (footer.footerTipi === 'kurumsal') {
    const opaklik = ek?.arkaPlanSaydamlik ?? 1;
    const gradient = ek?.gradientEtkin === true;
    const aci = ek?.gradientAcisi ?? 90;
    const anaRenk = ek?.arkaPlanRengi || '#0b2a77';
    const altRenk = ek?.altBantRengi || '#08245f';
    return {
      '--kurumsal-footer-bg': gradient ? lineerGradient(anaRenk, ek?.gradientBitisRengi || '#fb923c', aci, opaklik) : saydamRenk(anaRenk, opaklik),
      '--kurumsal-footer-alt-bg': gradient ? lineerGradient(altRenk, ek?.altBantGradientBitisRengi || '#ea580c', aci, opaklik) : saydamRenk(altRenk, opaklik),
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
