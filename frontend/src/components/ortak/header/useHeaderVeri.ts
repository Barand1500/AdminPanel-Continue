import { useMemo } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { Kategori } from '@/data/kategoriler';
import {
  headerAyarlariBirlestir,
  headerMarkaMetni,
  type HeaderAyarlari,
  type HeaderTipEkAyarlari,
  type HeaderTipi,
  type ParaBirimiKaydi,
} from '@/types/header';
import { headerLogoUrl } from '@/types/logo';
import { useSiteDil } from '@/contexts/SiteDilContext';
import { menuOgeleriCevir, kategorileriCevir, kategoriBaslikCevir } from '@/utils/menuYardimci';
import { headerTipiNormalize, tipEkBirlestir } from '@/data/headerTipleri';

export interface HeaderVeri {
  header: HeaderAyarlari;
  headerTipi: HeaderTipi;
  tipEk: HeaderTipEkAyarlari;
  tipSinifi: string;
  cevrilmisMenu: MenuOgesi[];
  cevrilmisKategoriler?: Kategori[];
  menuSol: MenuOgesi[];
  menuSag: MenuOgesi[];
  varsayilanMenuStil: {
    mega: boolean;
    kolonSayisi: 3 | 4 | 5;
  };
  kategoriMenuGoster: boolean;
  kategoriBaslikMetni: string;
  kurlar: ParaBirimiKaydi[];
  anaRenk: string;
  ikincilRenk: string;
  logoUrl?: string | null;
  markaMetni: string;
}

export const varsayilanMenuStil: HeaderVeri['varsayilanMenuStil'] = {
  mega: false,
  kolonSayisi: 4,
};

export function kurDegeri(kur: ParaBirimiKaydi): string {
  if (kur.kod === 'TRY') return '1,0000';
  const deger = kur.guncelKur ?? kur.manuelKur;
  if (deger == null) return '-';
  return deger.toLocaleString('tr-TR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function aramaSinifi(stil: 'yuvarlak' | 'kare' | 'minimal'): string {
  if (stil === 'kare') return 'input-search input-search-kare';
  if (stil === 'minimal') return 'input-search input-search-minimal';
  return 'input-search';
}

export function headerTipSinifi(tip: HeaderTipi): string {
  return `site-header-${tip}`;
}

export function bolunmusMenu(menu: MenuOgesi[], bolmeNoktasi?: number): [MenuOgesi[], MenuOgesi[]] {
  const oran = Number.isFinite(bolmeNoktasi) ? Number(bolmeNoktasi) : 50;
  const guvenliOran = Math.max(10, Math.min(90, oran));
  const bolmeIndeksi = Math.max(1, Math.min(menu.length - 1, Math.round((menu.length * guvenliOran) / 100)));
  return [menu.slice(0, bolmeIndeksi), menu.slice(bolmeIndeksi)];
}

interface UseHeaderVeriArgs {
  ayarlar?: SiteAyarlari | null;
  menuOgeleri: MenuOgesi[];
  kategoriler?: Kategori[];
}

export function useHeaderVeri({ ayarlar, menuOgeleri, kategoriler }: UseHeaderVeriArgs): HeaderVeri {
  const { dilKodu, sayfaBaslik, cevir } = useSiteDil();

  const cevrilmisMenu = useMemo(
    () => menuOgeleriCevir(menuOgeleri, sayfaBaslik, cevir),
    [menuOgeleri, sayfaBaslik, cevir, dilKodu]
  );
  const cevrilmisKategoriler = useMemo(
    () => (kategoriler ? kategorileriCevir(kategoriler, cevir) : undefined),
    [kategoriler, cevir, dilKodu]
  );

  const header = headerAyarlariBirlestir(ayarlar);
  const headerTipi = headerTipiNormalize(header.headerTipi);
  const tipEk = tipEkBirlestir(headerTipi, header.tipEk);
  const menuStili = {
    mega: headerTipi === 'mega-menu',
    kolonSayisi: tipEk.megaMenuKolon ?? varsayilanMenuStil.kolonSayisi,
  } as HeaderVeri['varsayilanMenuStil'];
  const [menuSol, menuSag] = bolunmusMenu(cevrilmisMenu, tipEk.menuBolmeNoktasi);

  return {
    header,
    headerTipi,
    tipEk,
    tipSinifi: headerTipSinifi(headerTipi),
    cevrilmisMenu,
    cevrilmisKategoriler,
    menuSol,
    menuSag,
    varsayilanMenuStil: menuStili,
    kategoriMenuGoster:
      header.kategori?.menuGoster !== false &&
      Boolean(cevrilmisKategoriler?.length),
    kategoriBaslikMetni: kategoriBaslikCevir(cevir, header.kategori?.baslikMetni ?? ''),
    kurlar: (header.kurlar ?? []).filter((k) => k.kod !== 'TRY').sort((a, b) => a.sira - b.sira),
    anaRenk: ayarlar?.anaRenk ?? '#7c3aed',
    ikincilRenk: ayarlar?.ikincilRenk ?? '#a78bfa',
    logoUrl: headerLogoUrl(ayarlar),
    markaMetni: headerMarkaMetni(header),
  };
}
