import { useMemo, useState, useEffect, type CSSProperties } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { Kategori } from '@/data/kategoriler';
import type { HeaderAyarlari, ParaBirimiKaydi } from '@/types/header';
import { headerAyarlariBirlestir, headerMarkaMetni } from '@/types/header';
import { headerLogoUrl } from '@/types/logo';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { menuOgeleriCevir, kategorileriCevir, kategoriBaslikCevir } from '@/utils/menuYardimci';
import { headerTipiNormalize } from '@/data/headerTipleri';

export interface HeaderVeri {
  header: HeaderAyarlari;
  tip: ReturnType<typeof headerTipiNormalize>;
  ustBant: NonNullable<HeaderAyarlari['ustBant']>;
  ikonlar: NonNullable<HeaderAyarlari['ikonlar']>;
  kategori: NonNullable<HeaderAyarlari['kategori']>;
  arama: NonNullable<HeaderAyarlari['arama']>;
  tipEk: NonNullable<HeaderAyarlari['tipEk']>;
  cevrilmisMenu: MenuOgesi[];
  cevrilmisKategoriler?: Kategori[];
  kategoriMenuGoster: boolean;
  kategoriBaslikMetni: string;
  kurlar: ParaBirimiKaydi[];
  anaRenk: string;
  ikincilRenk: string;
  logoUrl: string | null;
  markaMetni: string;
  ikinciLogoUrl: string | null;
  menuAcik: boolean;
  setMenuAcik: (v: boolean | ((a: boolean) => boolean)) => void;
  seffafMod: boolean;
  cevir: (key: string, fallback: string) => string;
}

export function useHeaderVeri(
  ayarlar: SiteAyarlari | null | undefined,
  menuOgeleri: MenuOgesi[],
  kategoriler?: Kategori[]
): HeaderVeri {
  const [menuAcik, setMenuAcik] = useState(false);
  const [seffafMod, setSeffafMod] = useState(false);
  const { dilKodu, sayfaBaslik, cevir } = useSiteDil();

  const header = headerAyarlariBirlestir(ayarlar);
  const tip = headerTipiNormalize(header.headerTipi);

  const cevrilmisMenu = useMemo(
    () => menuOgeleriCevir(menuOgeleri, sayfaBaslik, cevir),
    [menuOgeleri, sayfaBaslik, cevir, dilKodu]
  );
  const cevrilmisKategoriler = useMemo(
    () => (kategoriler ? kategorileriCevir(kategoriler, cevir) : undefined),
    [kategoriler, cevir, dilKodu]
  );

  const kategori = header.kategori!;
  const kategoriMenuGoster =
    kategori.menuGoster !== false && Boolean(cevrilmisKategoriler?.length);

  useEffect(() => {
    if (tip !== 'seffaf-hero' || !header.tipEk?.seffafBaslangic) {
      setSeffafMod(false);
      return;
    }
    setSeffafMod(window.scrollY < 40);
    function scrollHandler() {
      setSeffafMod(window.scrollY < 40);
    }
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [tip, header.tipEk?.seffafBaslangic]);

  return {
    header,
    tip,
    ustBant: header.ustBant!,
    ikonlar: header.ikonlar!,
    kategori,
    arama: header.arama!,
    tipEk: header.tipEk!,
    cevrilmisMenu,
    cevrilmisKategoriler,
    kategoriMenuGoster,
    kategoriBaslikMetni: kategoriBaslikCevir(cevir, kategori.baslikMetni),
    kurlar: (header.kurlar ?? []).filter((k) => k.kod !== 'TRY').sort((a, b) => a.sira - b.sira),
    anaRenk: ayarlar?.anaRenk ?? '#7c3aed',
    ikincilRenk: ayarlar?.ikincilRenk ?? '#a78bfa',
    logoUrl: headerLogoUrl(ayarlar),
    markaMetni: headerMarkaMetni(header),
    ikinciLogoUrl: header.tipEk?.ikinciLogoUrl ?? null,
    menuAcik,
    setMenuAcik,
    seffafMod,
    cevir,
  };
}

export function kurDegeri(k: ParaBirimiKaydi): string {
  if (k.kod === 'TRY') return '1,0000';
  const deger = k.guncelKur ?? k.manuelKur;
  if (deger == null) return '—';
  return deger.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export function aramaSinifi(stil: 'yuvarlak' | 'kare' | 'minimal') {
  if (stil === 'kare') return 'input-search input-search-kare';
  if (stil === 'minimal') return 'input-search input-search-minimal';
  return 'input-search';
}

export function headerTipSinifi(tip: string, seffafMod?: boolean): string {
  const siniflar = [`site-header--${tip}`];
  if (tip === 'seffaf-hero' && seffafMod) siniflar.push('site-header--seffaf');
  return siniflar.join(' ');
}

export function bolunmusMenu(
  menu: MenuOgesi[],
  bolmeYuzdesi = 50
): { sol: MenuOgesi[]; sag: MenuOgesi[] } {
  if (menu.length <= 1) return { sol: menu, sag: [] };
  const idx = Math.max(1, Math.round((menu.length * bolmeYuzdesi) / 100));
  return { sol: menu.slice(0, idx), sag: menu.slice(idx) };
}

export type MenuLinkStil = {
  linkClassName: string;
  style?: CSSProperties;
};

export const varsayilanMenuStil: MenuLinkStil = {
  linkClassName: 'site-menu-nav-link text-sm font-medium transition hover:text-primary',
  style: { color: 'var(--color-text-muted)' },
};
