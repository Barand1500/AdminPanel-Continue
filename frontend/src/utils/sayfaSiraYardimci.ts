import type { AdminSayfa } from '@/features/admin/sayfaApi';
import { dogrudanAltSayfalar, sayfaHiyerarsisiTamamla } from '@/utils/sayfaAgaci';

function ayniSeviyeSayfalar(
  sayfalar: AdminSayfa[],
  ustSayfaId: string | null | undefined,
  haricId?: string
): AdminSayfa[] {
  const duzeltildi = sayfaHiyerarsisiTamamla(sayfalar);

  if (ustSayfaId) {
    return dogrudanAltSayfalar(duzeltildi, ustSayfaId).filter((s) => s.id !== haricId);
  }

  return duzeltildi.filter((s) => !s.ustSayfaId && s.id !== haricId);
}

/** Yeni sayfa için bir sonraki sıra (aynı üst sayfa seviyesinde). */
export function sonrakiSayfaSira(
  sayfalar: AdminSayfa[],
  ustSayfaId: string | null | undefined,
  haricId?: string
): number {
  const kardesler = ayniSeviyeSayfalar(sayfalar, ustSayfaId, haricId);
  const siralar = kardesler.map((s) => Number(s.sira)).filter((n) => Number.isFinite(n));
  if (siralar.length === 0) return 1;
  return Math.max(...siralar) + 1;
}

/** Aynı seviyede aynı sıraya sahip başka sayfa var mı? */
export function sayfaSiraCakismasiBul(
  sayfalar: AdminSayfa[],
  sira: number,
  ustSayfaId: string | null | undefined,
  haricId?: string
): AdminSayfa | null {
  const hedef = Number(sira);
  return ayniSeviyeSayfalar(sayfalar, ustSayfaId, haricId).find((s) => Number(s.sira) === hedef) ?? null;
}
