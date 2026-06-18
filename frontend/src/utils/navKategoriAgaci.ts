import type { NavKategoriAgacDugumu, NavKategoriKayit } from '@/types/navKategori';
import type { Kategori } from '@/data/kategoriler';
import { idString } from '@/utils/idKarsilastir';

function sirala<T extends { sira: number; baslik: string }>(liste: T[]): T[] {
  return [...liste].sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'));
}

export function navKategoriAgaciOlustur(
  kayitlar: NavKategoriKayit[],
  sadeceAktif = false
): NavKategoriAgacDugumu[] {
  const liste = sadeceAktif ? kayitlar.filter((k) => k.aktif) : kayitlar;

  function dal(ustId: string | null): NavKategoriAgacDugumu[] {
    return sirala(
      liste.filter((k) =>
        ustId ? k.ustKategoriId && idString(k.ustKategoriId) === idString(ustId) : !k.ustKategoriId
      )
    ).map((k) => {
      const alt = dal(k.id);
      return {
        id: k.id,
        baslik: k.baslik,
        slug: k.slug,
        ...(k.yol ? { yol: k.yol } : {}),
        ...(alt.length > 0 ? { altKategoriler: alt } : {}),
      };
    });
  }

  return dal(null);
}

/** Public header menüsü için NavKategoriKayit → Kategori ağacı */
export function navKategorileriMenuyeCevir(
  kayitlar: NavKategoriKayit[] | null | undefined
): Kategori[] | undefined {
  if (!kayitlar?.length) return undefined;
  const agac = navKategoriAgaciOlustur(kayitlar, true);
  return agac.length > 0 ? (agac as Kategori[]) : undefined;
}

export function navKategoriDerinlik(kayitlar: NavKategoriKayit[], id: string | null): number {
  if (!id) return 0;
  const k = kayitlar.find((x) => x.id === id);
  if (!k?.ustKategoriId) return 1;
  return 1 + navKategoriDerinlik(kayitlar, k.ustKategoriId);
}

export function navKategoriUstSecenekleri(
  kayitlar: NavKategoriKayit[],
  haricId?: string | null
): NavKategoriKayit[] {
  const haric = new Set<string>();
  if (haricId) {
    function topla(cid: string) {
      haric.add(cid);
      kayitlar.filter((k) => k.ustKategoriId === cid).forEach((k) => topla(k.id));
    }
    topla(haricId);
  }
  return sirala(kayitlar.filter((k) => !haric.has(k.id) && navKategoriDerinlik(kayitlar, k.id) < 3));
}
