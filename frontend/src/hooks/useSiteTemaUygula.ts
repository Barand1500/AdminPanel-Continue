import { useEffect } from 'react';
import type { SiteAyarlari } from '@/types/site';
import { temaAyarlariBirlestir } from '@/types/temaAyarlari';
import { useSiteTema } from '@/contexts/SiteTemaContext';
import {
  aktifPaletiHesapla,
  paletiCssVarsTemizle,
  paletiCssVarsUygula,
} from '@/utils/temaRenkleri';

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

/** Admin panelden kaydedilen site ayarlarini public siteye uygular */
export function useSiteTemaUygula(ayarlar?: SiteAyarlari | null, siteAd?: string) {
  const { tema } = useSiteTema();

  useEffect(() => {
    const root = document.documentElement;
    const anaRenk = ayarlar?.anaRenk ?? '#7c3aed';
    const ikincilRenk = ayarlar?.ikincilRenk ?? '#a78bfa';
    const temaAyarlari = temaAyarlariBirlestir(ayarlar?.temaAyarlariJson);

    const palet = aktifPaletiHesapla(tema, anaRenk, ikincilRenk, temaAyarlari.geceSablon);
    paletiCssVarsUygula(root, palet);

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
      paletiCssVarsTemizle(root);
      root.style.removeProperty('--font-sans');
    };
  }, [ayarlar, siteAd, tema]);
}
