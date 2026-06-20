import type { AdminSayfa } from '@/features/admin/sayfaApi';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import type { MenuOgesi, SayfaAcilisModu } from '@/types/site';
import { idString } from '@/utils/idKarsilastir';
import { sayfaDuzenEtiketiKaldir } from '@/utils/sayfaIcerikIsle';

export function sayfaIcerikVar(icerik?: string | null): boolean {
  const metin = sayfaDuzenEtiketiKaldir(icerik ?? '').replace(/<[^>]*>/g, '').trim();
  return Boolean(metin);
}

export type AltMenuGorunum = 'dikey' | 'yatay';
export type AltMenuTetikleyici = 'hover' | 'tikla';

export interface SayfaAgacDugumu {
  sayfa: AdminSayfa;
  altSayfalar: SayfaAgacDugumu[];
}

interface SayfaMenuKaynak {
  id: string | number;
  baslik: string;
  slug: string;
  icerik?: string;
  ikon?: string | null;
  sira?: number;
  menudeGoster?: boolean;
  acilisModu?: SayfaAcilisModu;
  ustSayfaId?: string | number | null;
  altMenuGorunum?: AltMenuGorunum;
  altMenuTetikleyici?: AltMenuTetikleyici;
}

export function sayfaSegmentSlug(slug: string): string {
  const parcalar = slug.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return parcalar[parcalar.length - 1] ?? slug;
}

export function sayfaTamSlugOlustur(ustSlug: string | null | undefined, segment: string): string {
  const seg = segment.replace(/^\/+|\/+$/g, '').split('/').pop() ?? segment;
  if (!ustSlug) return seg;
  return `${ustSlug.replace(/\/+$/g, '')}/${seg}`;
}

function ustSlugYolu(slug: string): string | null {
  const parcalar = slug.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (parcalar.length < 2) return null;
  return parcalar.slice(0, -1).join('/');
}

/** ustSayfaId bos ise slug yolundan ust sayfayi tahmin eder (gorunum icin). */
export function sayfaHiyerarsisiTamamla<T extends { id: string | number; slug: string; ustSayfaId?: string | number | null }>(
  sayfalar: T[]
): T[] {
  const slugIndeks = new Map(
    sayfalar.map((s) => [s.slug.replace(/^\/+|\/+$/g, ''), s] as const)
  );

  return sayfalar.map((sayfa) => {
    if (sayfa.ustSayfaId) return sayfa;
    const ustSlug = ustSlugYolu(sayfa.slug);
    if (!ustSlug) return sayfa;
    const ust = slugIndeks.get(ustSlug);
    if (!ust || ust.id === sayfa.id) return sayfa;
    return { ...sayfa, ustSayfaId: idString(ust.id) };
  });
}

function cocuklariSirala<T extends { sira?: number; baslik: string }>(liste: T[]): T[] {
  return [...liste].sort(
    (a, b) => (a.sira ?? 0) - (b.sira ?? 0) || a.baslik.localeCompare(b.baslik, 'tr')
  );
}

function menuOgesiUret(sayfa: SayfaMenuKaynak, sayfalar: SayfaMenuKaynak[]): MenuOgesi {
  const altKaynaklar = cocuklariSirala(
    sayfalar.filter(
      (s) => s.ustSayfaId != null && idString(s.ustSayfaId) === idString(sayfa.id) && s.menudeGoster !== false
    )
  );

  const altOgeler = altKaynaklar.map((alt) => menuOgesiUret(alt, sayfalar));
  const icerikVar = sayfaIcerikVar(sayfa.icerik);

  return {
    baslik: sayfa.baslik,
    yol: sayfaYolunuBul(sayfa.slug),
    ikon: sayfa.ikon ?? null,
    acilisModu: sayfa.acilisModu ?? 'normal',
    yeniSekme: sayfa.acilisModu === 'yeni_sekme',
    icerikVar,
    altMenuGorunum: sayfa.altMenuGorunum ?? 'dikey',
    altMenuTetikleyici: sayfa.altMenuTetikleyici ?? 'hover',
    ...(altOgeler.length > 0 ? { altOgeler } : {}),
  };
}

export function sayfaMenuAgaciOlustur(sayfalar: SayfaMenuKaynak[]): MenuOgesi[] {
  const duzeltildi = sayfaHiyerarsisiTamamla(sayfalar);
  const kokler = cocuklariSirala(
    duzeltildi.filter((s) => !s.ustSayfaId && s.menudeGoster !== false)
  );
  return kokler.map((sayfa) => menuOgesiUret(sayfa, duzeltildi));
}

/** Bir ana sayfanın doğrudan alt menü öğelerini üretir. */
export function sayfaAltMenuOgeleriOlustur(
  ustSayfaId: string | number,
  sayfalar: SayfaMenuKaynak[]
): MenuOgesi[] {
  return cocuklariSirala(
    sayfalar.filter(
      (s) =>
        s.ustSayfaId != null &&
        idString(s.ustSayfaId) === idString(ustSayfaId) &&
        s.menudeGoster !== false
    )
  ).map((alt) => menuOgesiUret(alt, sayfalar));
}

/** Sınırsız derinlikte sayfa ağacı. */
export function sayfaAgaciOlustur(sayfalar: AdminSayfa[]): SayfaAgacDugumu[] {
  const duzeltildi = sayfaHiyerarsisiTamamla(sayfalar);

  function dal(ustId: string | null): SayfaAgacDugumu[] {
    return cocuklariSirala(
      duzeltildi.filter((s) =>
        ustId ? s.ustSayfaId && idString(s.ustSayfaId) === idString(ustId) : !s.ustSayfaId
      )
    ).map((sayfa) => ({
      sayfa,
      altSayfalar: dal(sayfa.id),
    }));
  }

  return dal(null);
}

/** Üst sayfa seçenekleri: kendisi ve alt ağacı hariç tüm sayfalar. */
export function ustSayfaSecenekleri(
  sayfalar: AdminSayfa[],
  haricId?: string | null
): AdminSayfa[] {
  const haric = new Set<string>();
  if (haricId) {
    function topla(id: string) {
      haric.add(id);
      sayfalar
        .filter((s) => s.ustSayfaId && idString(s.ustSayfaId) === idString(id))
        .forEach((s) => topla(s.id));
    }
    topla(haricId);
  }

  return cocuklariSirala(sayfalar.filter((s) => !haric.has(s.id)));
}

export function altSayfaSayisi(sayfalar: AdminSayfa[], ustId: string): number {
  return dogrudanAltSayfalar(sayfalar, ustId).length;
}

export function dogrudanAltSayfalar(sayfalar: AdminSayfa[], ustId: string): AdminSayfa[] {
  const duzeltildi = sayfaHiyerarsisiTamamla(sayfalar);
  return cocuklariSirala(
    duzeltildi.filter((s) => s.ustSayfaId && idString(s.ustSayfaId) === idString(ustId))
  );
}

export function ustSayfaBul(
  sayfalar: AdminSayfa[],
  ustSayfaId: string | null | undefined
): AdminSayfa | undefined {
  if (!ustSayfaId) return undefined;
  return sayfalar.find((s) => idString(s.id) === idString(ustSayfaId));
}

/** hedefId, kaynakId'nin torunu mu? */
export function sayfaTorunMu(sayfalar: AdminSayfa[], kaynakId: string, hedefId: string): boolean {
  if (kaynakId === hedefId) return true;
  const duzeltildi = sayfaHiyerarsisiTamamla(sayfalar);
  let current = duzeltildi.find((s) => idString(s.id) === idString(hedefId));
  while (current?.ustSayfaId) {
    const ustId = idString(current.ustSayfaId);
    if (ustId === idString(kaynakId)) return true;
    current = duzeltildi.find((s) => idString(s.id) === ustId);
  }
  return false;
}
