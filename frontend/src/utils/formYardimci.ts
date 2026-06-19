import type { FormAlani, FormAyarlar, FormKosul } from '@/types/formYonetimi';
import { ayarlariBirlestir } from '@/types/formYonetimi';

export function kosulSaglaniyor(kosul: FormKosul, degerler: Record<string, string>): boolean {
  const deger = degerler[kosul.alanId] ?? '';
  switch (kosul.operator) {
    case 'esit':
      return deger === (kosul.deger ?? '');
    case 'farkli':
      return deger !== (kosul.deger ?? '');
    case 'dolu':
      return deger.trim().length > 0;
    case 'bos':
      return deger.trim().length === 0;
    case 'icerir':
      return deger.toLowerCase().includes((kosul.deger ?? '').toLowerCase());
    default:
      return true;
  }
}

export function alanGorunur(alan: FormAlani, degerler: Record<string, string>): boolean {
  if (!alan.kosullar?.length) return true;
  const sonuclar = alan.kosullar.map((k) => kosulSaglaniyor(k, degerler));
  return alan.kosulMantigi === 'veya' ? sonuclar.some(Boolean) : sonuclar.every(Boolean);
}

export function pathnameDenSayfaSlug(pathname: string): string {
  const temiz = pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
  if (temiz === '/') return 'ana-sayfa';
  return temiz.replace(/^\//, '');
}

export interface PublicFormKayit {
  id: string;
  ad: string;
  slug: string;
  aciklama?: string | null;
  alanlarJson: FormAlani[];
  ayarlarJson?: Partial<FormAyarlar> | null;
  aktif: boolean;
}

export function formSayfadaGoster(form: PublicFormKayit, sayfaSlug: string): boolean {
  if (!form.aktif) return false;
  const ayar = ayarlariBirlestir(form.ayarlarJson);
  if (ayar.gorunumTipi === 'yuzucu') return false;
  if (ayar.tumSayfalarda) return true;
  if (ayar.sayfaSluglari.length === 0) return false;
  return ayar.sayfaSluglari.some((s) => s === sayfaSlug || s.replace(/^\//, '') === sayfaSlug);
}

export function formKonumda(form: PublicFormKayit, konum: FormAyarlar['sayfaKonumu']): boolean {
  const ayar = ayarlariBirlestir(form.ayarlarJson);
  return ayar.sayfaKonumu === konum;
}

export function yuzucuFormlar(formlar: PublicFormKayit[]): PublicFormKayit[] {
  return formlar.filter((f) => f.aktif && ayarlariBirlestir(f.ayarlarJson).gorunumTipi === 'yuzucu');
}

export function formVerisiOlustur(
  alanlar: FormAlani[],
  degerler: Record<string, string>
): Record<string, unknown> {
  const veri: Record<string, unknown> = {};
  for (const alan of alanlar) {
    if (!alanGorunur(alan, degerler)) continue;
    const ham = degerler[alan.id] ?? '';
    const anahtar = alan.etiket.trim() || alan.id;
    if (alan.tip === 'checkbox') {
      if (ham === 'true') veri[anahtar] = true;
    } else if (ham.trim()) {
      veri[anahtar] = ham;
    }
  }
  return veri;
}

export function formDogrula(
  alanlar: FormAlani[],
  degerler: Record<string, string>,
  ayar: FormAyarlar,
  kvkkOnay?: boolean
): string | null {
  for (const alan of alanlar) {
    if (!alanGorunur(alan, degerler)) continue;
    if (alan.zorunlu && !(degerler[alan.id] ?? '').trim()) {
      return `"${alan.etiket}" alanı zorunludur`;
    }
  }
  if (ayar.kvkkOnayZorunlu && !kvkkOnay) {
    return 'Devam etmek için onay kutusunu işaretleyin';
  }
  return null;
}
