import { adminHeaders, adminJsonFetch } from './adminFetch';
import { idString } from '@/utils/idKarsilastir';

import type { SayfaAcilisModu } from '@/types/site';

export interface AdminSayfa {
  id: string;
  baslik: string;
  slug: string;
  icerik: string;
  kapakGorsel?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  yayinda: boolean;
  menudeGoster: boolean;
  sira: number;
  acilisModu: SayfaAcilisModu;
  ustSayfaId?: string | null;
}

export interface SayfaFormDegeri {
  baslik: string;
  slug: string;
  icerik: string;
  kapakGorsel: string;
  seoTitle: string;
  seoDesc: string;
  yayinda: boolean;
  menudeGoster: boolean;
  sira: number;
  acilisModu: SayfaAcilisModu;
  ustSayfaId: string | null;
}

export async function adminSayfalariGetir(): Promise<AdminSayfa[]> {
  const veri = await adminJsonFetch<{ sayfalar: AdminSayfa[] }>('/sayfalar', { headers: adminHeaders() });
  return veri.sayfalar.map(normalizeSayfa);
}

export async function adminSayfaOlustur(form: SayfaFormDegeri): Promise<AdminSayfa> {
  const veri = await adminJsonFetch<{ sayfa: AdminSayfa }>('/sayfalar', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  return normalizeSayfa(veri.sayfa);
}

export async function adminSayfaGuncelle(id: string, form: SayfaFormDegeri): Promise<AdminSayfa> {
  const veri = await adminJsonFetch<{ sayfa: AdminSayfa }>(`/sayfalar/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  return normalizeSayfa(veri.sayfa);
}

export async function adminSayfaSil(id: string): Promise<void> {
  await adminJsonFetch(`/sayfalar/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function adminMenuGuncelle(ogeler: { id: string; sira: number; menudeGoster: boolean }[]): Promise<AdminSayfa[]> {
  const veri = await adminJsonFetch<{ sayfalar: AdminSayfa[] }>('/menu', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ ogeler }),
  });
  return veri.sayfalar.map(normalizeSayfa);
}

function normalizeSayfa(sayfa: AdminSayfa): AdminSayfa {
  return {
    ...sayfa,
    id: idString(sayfa.id),
    acilisModu: sayfa.acilisModu ?? 'normal',
    ustSayfaId: sayfa.ustSayfaId != null ? idString(sayfa.ustSayfaId) : null,
  };
}

function payloadHazirla(form: SayfaFormDegeri) {
  return {
    baslik: form.baslik.trim(),
    slug: form.slug.trim() || undefined,
    icerik: form.icerik,
    kapakGorsel: form.kapakGorsel.trim() || null,
    seoTitle: form.seoTitle.trim() || null,
    seoDesc: form.seoDesc.trim() || null,
    yayinda: form.yayinda,
    menudeGoster: form.menudeGoster,
    sira: form.sira,
    acilisModu: form.acilisModu,
    ustSayfaId: form.ustSayfaId ? Number(form.ustSayfaId) : null,
  };
}
