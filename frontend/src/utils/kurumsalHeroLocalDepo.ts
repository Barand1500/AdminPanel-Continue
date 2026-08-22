import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import type { Widget } from '@/types/site';
import { adminWidgetNormalize, widgetFormNormalize } from '@/utils/widgetFormYardimci';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

const STORAGE_KEY = 'cms-local-kurumsal-hero-v1';
export const KURUMSAL_HERO_YEREL_ID_ONEKI = 'local-kh-';

/** Geliştirme ortamında Kurumsal Hero backend'e gitmeden localStorage'da tutulur. */
export function kurumsalHeroYerelMod(): boolean {
  if (import.meta.env.VITE_KURUMSAL_HERO_YEREL === 'false') return false;
  if (import.meta.env.VITE_KURUMSAL_HERO_YEREL === 'true') return true;
  return import.meta.env.DEV;
}

export function kurumsalHeroYerelIdMi(id: string): boolean {
  return id.startsWith(KURUMSAL_HERO_YEREL_ID_ONEKI);
}

export function kurumsalHeroYerelKayitId(id: string): string {
  return kurumsalHeroYerelIdMi(id) ? id : `${KURUMSAL_HERO_YEREL_ID_ONEKI}${id}`;
}

export function kurumsalHeroYerelKayitVarMi(id: string): boolean {
  const yerelId = kurumsalHeroYerelKayitId(id);
  return okuHam().some((w) => w.id === yerelId || w.id === id);
}

function okuHam(): AdminWidget[] {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    if (!ham) return [];
    const parsed = JSON.parse(ham) as AdminWidget[];
    return Array.isArray(parsed) ? parsed.map(adminWidgetNormalize) : [];
  } catch {
    return [];
  }
}

function yaz(liste: AdminWidget[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));
  siteVerisiGuncellendiYayinla();
}

function siteWidgetCevir(w: AdminWidget): Widget {
  return {
    id: w.id,
    ad: w.ad,
    tip: w.tip,
    sira: w.sira,
    aktif: w.aktif,
    baslik: w.baslik,
    altBaslik: w.altBaslik,
    aciklama: w.aciklama,
    gorselUrl: w.gorselUrl,
    butonMetni: w.butonMetni,
    butonLink: w.butonLink,
    arkaPlanRenk: w.arkaPlanRenk,
    yaziRenk: w.yaziRenk,
    mobilGoster: w.mobilGoster,
    masaustuGoster: w.masaustuGoster,
    configJson: w.configJson,
    sayfaId: w.sayfaId,
  };
}

export function kurumsalHeroYerelWidgetlariGetir(): AdminWidget[] {
  return okuHam().sort((a, b) => a.sira - b.sira || a.ad.localeCompare(b.ad, 'tr'));
}

export function kurumsalHeroYerelSiteWidgetlariGetir(): Widget[] {
  return kurumsalHeroYerelWidgetlariGetir().map(siteWidgetCevir);
}

export function kurumsalHeroYerelOlustur(
  widget: Omit<AdminWidget, 'id' | 'olusturma' | 'guncelleme'> & { id?: string }
): AdminWidget {
  const now = new Date().toISOString();
  const kayit = adminWidgetNormalize({
    ...widget,
    id: widget.id ?? `${KURUMSAL_HERO_YEREL_ID_ONEKI}${Date.now()}`,
    tip: 'KURUMSAL_HERO',
    olusturma: now,
    guncelleme: now,
  });
  const liste = okuHam();
  liste.push(kayit);
  yaz(liste);
  return kayit;
}

export function kurumsalHeroYerelGuncelle(id: string, widget: Partial<AdminWidget>): AdminWidget {
  const liste = okuHam();
  const index = liste.findIndex((w) => w.id === id);
  if (index < 0) {
    throw new Error('Yerel Kurumsal Hero widget bulunamadi');
  }
  const mevcut = liste[index];
  const guncel = adminWidgetNormalize({
    ...mevcut,
    ...widget,
    id,
    tip: 'KURUMSAL_HERO',
    olusturma: mevcut.olusturma,
    guncelleme: new Date().toISOString(),
  });
  liste[index] = guncel;
  yaz(liste);
  return guncel;
}

export function kurumsalHeroYerelSil(id: string): void {
  yaz(okuHam().filter((w) => w.id !== id));
}

export function kurumsalHeroFormdanYerelWidget(
  form: WidgetFormDegeri,
  payload: Record<string, unknown>,
  id?: string,
  siteId = '1'
): AdminWidget {
  const f = widgetFormNormalize(form);
  let configJson: Record<string, unknown> | null = null;
  const cfg = f.configJsonMetin.trim();
  if (cfg) {
    configJson = JSON.parse(cfg) as Record<string, unknown>;
  }

  return adminWidgetNormalize({
    id: id ?? `${KURUMSAL_HERO_YEREL_ID_ONEKI}${Date.now()}`,
    siteId,
    ad: String(payload.ad ?? f.ad),
    tip: 'KURUMSAL_HERO',
    sayfaId: (payload.sayfaId as string | null | undefined) ?? null,
    sira: Number(payload.sira) || 0,
    aktif: Boolean(payload.aktif),
    baslik: (payload.baslik as string | null | undefined) ?? null,
    altBaslik: (payload.altBaslik as string | null | undefined) ?? null,
    aciklama: (payload.aciklama as string | null | undefined) ?? null,
    gorselUrl: (payload.gorselUrl as string | null | undefined) ?? null,
    butonMetni: (payload.butonMetni as string | null | undefined) ?? null,
    butonLink: (payload.butonLink as string | null | undefined) ?? null,
    arkaPlanRenk: (payload.arkaPlanRenk as string | null | undefined) ?? null,
    yaziRenk: (payload.yaziRenk as string | null | undefined) ?? null,
    mobilGoster: Boolean(payload.mobilGoster ?? true),
    masaustuGoster: Boolean(payload.masaustuGoster ?? true),
    configJson,
    olusturma: new Date().toISOString(),
    guncelleme: new Date().toISOString(),
  });
}

/** API widget listesine yerel Kurumsal Hero kayitlarini birlestirir (yedek). */
export function kurumsalHeroYerelWidgetlariBirlestir(widgetlar: AdminWidget[]): AdminWidget[] {
  // Yerel taslaklar yalnızca açıkça etkinleştirilen geliştirme modunda
  // kullanılmalı. Production'da tarayıcıdaki geçici kayıtların API verisini
  // ezmesi, local ve sunucu görünümünün birbirinden kopmasına yol açıyordu.
  if (!kurumsalHeroYerelMod()) return widgetlar;

  const apiKhHaric = widgetlar.filter((w) => w.tip !== 'KURUMSAL_HERO');
  const yerel = kurumsalHeroYerelWidgetlariGetir();
  if (yerel.length === 0) return widgetlar;
  return [...apiKhHaric, ...yerel].sort((a, b) => a.sira - b.sira || a.ad.localeCompare(b.ad, 'tr'));
}

/** Site verisine yerel Kurumsal Hero widgetlarini ekler (yedek). */
export function kurumsalHeroYerelSiteWidgetlariBirlestir(widgetlar: Widget[]): Widget[] {
  if (!kurumsalHeroYerelMod()) return widgetlar;

  const apiKhHaric = widgetlar.filter((w) => w.tip !== 'KURUMSAL_HERO');
  const yerel = kurumsalHeroYerelSiteWidgetlariGetir();
  if (yerel.length === 0) return widgetlar;
  return [...apiKhHaric, ...yerel].sort((a, b) => a.sira - b.sira || a.ad.localeCompare(b.ad, 'tr'));
}
