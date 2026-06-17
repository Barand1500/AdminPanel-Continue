import type { AdminSayfa } from '@/features/admin/sayfaApi';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import type { MenuOgesi, SayfaAcilisModu } from '@/types/site';
import { idString } from '@/utils/idKarsilastir';

export interface SayfaAgacDugumu {
  sayfa: AdminSayfa;
  altSayfalar: AdminSayfa[];
}

interface SayfaMenuKaynak {
  id: string | number;
  baslik: string;
  slug: string;
  sira?: number;
  menudeGoster?: boolean;
  acilisModu?: SayfaAcilisModu;
  ustSayfaId?: string | number | null;
}

/** Bir ana sayfanın alt menü öğelerini (dropdown) üretir. */
export function sayfaAltMenuOgeleriOlustur(
  ustSayfaId: string | number,
  sayfalar: SayfaMenuKaynak[]
): MenuOgesi[] {
  return sayfalar
    .filter(
      (s) =>
        s.ustSayfaId != null &&
        idString(s.ustSayfaId) === idString(ustSayfaId) &&
        s.menudeGoster !== false
    )
    .sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0))
    .map((alt) => ({
      baslik: alt.baslik,
      yol: sayfaYolunuBul(alt.slug),
      acilisModu: alt.acilisModu ?? 'normal',
      yeniSekme: alt.acilisModu === 'yeni_sekme',
    }));
}

/** Kök sayfalar ve alt sayfalarını gruplar (tek seviye hiyerarşi). */
export function sayfaAgaciOlustur(sayfalar: AdminSayfa[]): SayfaAgacDugumu[] {
  const kokler = sayfalar
    .filter((s) => !s.ustSayfaId)
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'));

  return kokler.map((sayfa) => ({
    sayfa,
    altSayfalar: sayfalar
      .filter((s) => s.ustSayfaId && idString(s.ustSayfaId) === idString(sayfa.id))
      .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr')),
  }));
}

/** Üst sayfa seçenekleri: yalnızca kök sayfalar, kendisi hariç. */
export function ustSayfaSecenekleri(
  sayfalar: AdminSayfa[],
  haricId?: string | null
): AdminSayfa[] {
  return sayfalar
    .filter((s) => !s.ustSayfaId && s.id !== haricId)
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'));
}

export function altSayfaSayisi(sayfalar: AdminSayfa[], ustId: string): number {
  return sayfalar.filter((s) => s.ustSayfaId && idString(s.ustSayfaId) === idString(ustId)).length;
}

export function ustSayfaBul(
  sayfalar: AdminSayfa[],
  ustSayfaId: string | null | undefined
): AdminSayfa | undefined {
  if (!ustSayfaId) return undefined;
  return sayfalar.find((s) => idString(s.id) === idString(ustSayfaId));
}
