import { adminHeaders, adminJsonFetch } from './adminFetch';

export interface SiteAyarlariForm {
  logoUrl: string;
  faviconUrl: string;
  anaRenk: string;
  ikincilRenk: string;
  slogan: string;
  font: string;
  telefon: string;
  email: string;
  adres: string;
  whatsapp: string;
  telifYazisi: string;
  sosyalMedya: Record<string, string>;
}

export interface SiteAyarlariYanit {
  site: { id: string; ad: string; slug: string };
  ayarlar: {
    logoUrl?: string | null;
    faviconUrl?: string | null;
    anaRenk?: string;
    ikincilRenk?: string;
    slogan?: string | null;
    font?: string;
    telefon?: string | null;
    email?: string | null;
    adres?: string | null;
    whatsapp?: string | null;
    telifYazisi?: string | null;
    sosyalMedyaJson?: Record<string, string> | null;
  } | null;
}

const URL_PLATFORMLARI = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin'];

function sosyalMedyaPayload(sosyal: Record<string, string>): Record<string, string> {
  const json: Record<string, string> = {};
  for (const [anahtar, deger] of Object.entries(sosyal)) {
    const temiz = deger.trim();
    if (!temiz) continue;
    if (anahtar.endsWith('_icon')) {
      json[anahtar] = temiz;
    } else if (URL_PLATFORMLARI.includes(anahtar)) {
      json[anahtar] = temiz;
    }
  }
  return json;
}

export function formdanSiteAyarlari(ayarlar: SiteAyarlariYanit['ayarlar']): SiteAyarlariForm {
  const sosyal = { ...(ayarlar?.sosyalMedyaJson ?? {}) };
  return {
    logoUrl: ayarlar?.logoUrl ?? '',
    faviconUrl: ayarlar?.faviconUrl ?? '',
    anaRenk: ayarlar?.anaRenk ?? '#7c3aed',
    ikincilRenk: ayarlar?.ikincilRenk ?? '#a78bfa',
    slogan: ayarlar?.slogan ?? '',
    font: ayarlar?.font ?? 'Inter',
    telefon: ayarlar?.telefon ?? '',
    email: ayarlar?.email ?? '',
    adres: ayarlar?.adres ?? '',
    whatsapp: ayarlar?.whatsapp ?? '',
    telifYazisi: ayarlar?.telifYazisi ?? '',
    sosyalMedya: sosyal,
  };
}

export async function siteAyarlariGetir(): Promise<SiteAyarlariYanit> {
  return adminJsonFetch<SiteAyarlariYanit>('/site-ayarlari', { headers: adminHeaders() });
}

export async function siteAyarlariGuncelle(form: SiteAyarlariForm) {
  return adminJsonFetch<{ ayarlar: unknown }>('/site-ayarlari', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({
      logoUrl: form.logoUrl.trim() || null,
      faviconUrl: form.faviconUrl.trim() || null,
      anaRenk: form.anaRenk,
      ikincilRenk: form.ikincilRenk,
      slogan: form.slogan.trim() || null,
      font: form.font,
      telefon: form.telefon.trim() || null,
      email: form.email.trim() || null,
      adres: form.adres.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      telifYazisi: form.telifYazisi.trim() || null,
      sosyalMedyaJson: sosyalMedyaPayload(form.sosyalMedya),
    }),
  });
}
