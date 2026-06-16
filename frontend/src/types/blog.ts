export type BlogGorunumKonum = 'urunler-ustu' | 'widgetlar-ustu' | 'widgetlar-alti';

export interface BlogAyarlari {
  headerMenu: boolean;
  anaSayfa: boolean;
  anaSayfaKonum: BlogGorunumKonum;
  hizmetlerAlani: boolean;
  listeAdet: number;
}

export interface BlogYazisiOzet {
  id: string;
  baslik: string;
  slug: string;
  ozet?: string | null;
  kapakGorsel?: string | null;
  yazar?: string | null;
  kategori?: string | null;
  oneCikan: boolean;
  olusturma: string;
}

export interface BlogYazisiDetay extends BlogYazisiOzet {
  icerik: string;
  guncelleme?: string;
}

export const BLOG_GORUNUM_KONUM_ETIKET: Record<BlogGorunumKonum, string> = {
  'urunler-ustu': 'Ürün bloklarından önce',
  'widgetlar-ustu': 'Widget alanından önce',
  'widgetlar-alti': 'Widget alanından sonra',
};

export function varsayilanBlogAyarlari(): BlogAyarlari {
  return {
    headerMenu: true,
    anaSayfa: true,
    anaSayfaKonum: 'urunler-ustu',
    hizmetlerAlani: false,
    listeAdet: 3,
  };
}

export function blogAyarlariBirlestir(
  ayarlar?: { blogAyarlariJson?: BlogAyarlari | null } | null
): BlogAyarlari {
  const varsayilan = varsayilanBlogAyarlari();
  const ham = ayarlar?.blogAyarlariJson;
  if (!ham) return varsayilan;

  return {
    headerMenu: ham.headerMenu ?? varsayilan.headerMenu,
    anaSayfa: ham.anaSayfa ?? varsayilan.anaSayfa,
    anaSayfaKonum: ham.anaSayfaKonum ?? varsayilan.anaSayfaKonum,
    hizmetlerAlani: ham.hizmetlerAlani ?? varsayilan.hizmetlerAlani,
    listeAdet: ham.listeAdet ?? varsayilan.listeAdet,
  };
}

/** Öne çıkan önce, sonra tarih sırası; adet sınırı */
export function blogOnizlemeListesi(
  bloglar: BlogYazisiOzet[],
  adet: number
): BlogYazisiOzet[] {
  const sirali = [...bloglar].sort((a, b) => {
    if (a.oneCikan !== b.oneCikan) return a.oneCikan ? -1 : 1;
    return new Date(b.olusturma).getTime() - new Date(a.olusturma).getTime();
  });
  return sirali.slice(0, Math.max(1, Math.min(adet, 12)));
}

export function blogTarihFormatla(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}
