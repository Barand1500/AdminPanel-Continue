import { useEffect } from 'react';
import type { SiteAyarlari } from '@/types/site';

const FONT_MAP: Record<string, string> = {
  Inter: 'Inter',
  Roboto: 'Roboto',
  'Open Sans': 'Open+Sans',
  Lato: 'Lato',
  Poppins: 'Poppins',
  Montserrat: 'Montserrat',
  Nunito: 'Nunito',
  Raleway: 'Raleway',
  'Playfair Display': 'Playfair+Display',
  'DM Sans': 'DM+Sans',
};

function fontLinkYukle(font: string) {
  const ailesi = FONT_MAP[font] ?? 'Inter';
  const id = 'gt-site-font';
  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = `https://fonts.googleapis.com/css2?family=${ailesi}:wght@400;500;600;700&display=swap`;
}

function ikincilRenkAcik(renk: string) {
  return `${renk}22`;
}

/** Admin panelden kaydedilen site ayarlarini public siteye uygular */
export function useSiteTemaUygula(ayarlar?: SiteAyarlari | null, siteAd?: string) {
  useEffect(() => {
    const root = document.documentElement;

    if (ayarlar?.anaRenk) {
      root.style.setProperty('--color-primary', ayarlar.anaRenk);
      root.style.setProperty('--color-primary-dark', ayarlar.anaRenk);
    }

    if (ayarlar?.ikincilRenk) {
      root.style.setProperty('--color-primary-light', ayarlar.ikincilRenk);
      root.style.setProperty('--color-accent', ikincilRenkAcik(ayarlar.ikincilRenk));
    }

    if (ayarlar?.font) {
      fontLinkYukle(ayarlar.font);
      root.style.setProperty('--font-sans', `"${ayarlar.font}", system-ui, sans-serif`);
    }

    if (ayarlar?.faviconUrl) {
      let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = ayarlar.faviconUrl;
    }

    if (siteAd) {
      document.title = siteAd;
    }

    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-primary-dark');
      root.style.removeProperty('--color-primary-light');
      root.style.removeProperty('--color-accent');
      root.style.removeProperty('--font-sans');
    };
  }, [ayarlar, siteAd]);
}
