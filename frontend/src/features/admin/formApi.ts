import { adminHeaders, adminJsonFetch } from './adminFetch';
import {
  ayarlariBirlestir,
  type FormAlani,
  type FormAyarlar,
} from '@/types/formYonetimi';

export type { FormAlani, FormAyarlar };
export type { FormAlanTipi, FormEditorSekmeId, FormKosul } from '@/types/formYonetimi';

export interface FormGonderim {
  id: string;
  formId: string;
  veriJson: Record<string, unknown>;
  okundu: boolean;
  olusturma: string;
}

export interface AdminForm {
  id: string;
  ad: string;
  slug: string;
  aciklama?: string | null;
  alanlarJson: FormAlani[];
  ayarlarJson?: FormAyarlar | null;
  aktif: boolean;
  bildirimEmail?: string | null;
  olusturma: string;
  guncelleme: string;
  _count?: { gonderimler: number };
  gonderimler?: FormGonderim[];
}

export interface FormFormDegeri {
  ad: string;
  slug: string;
  aciklama: string;
  alanlarJson: FormAlani[];
  ayarlarJson: FormAyarlar;
  aktif: boolean;
  bildirimEmail: string;
}

export async function adminFormlariGetir(): Promise<AdminForm[]> {
  const veri = await adminJsonFetch<{ formlar: AdminForm[] }>('/formlar', { headers: adminHeaders() });
  return veri.formlar.map(normalizeForm);
}

export async function adminFormDetay(id: string): Promise<AdminForm> {
  const veri = await adminJsonFetch<{ form: AdminForm }>(`/formlar/${id}`, { headers: adminHeaders() });
  return normalizeForm(veri.form);
}

export async function adminFormOlustur(form: FormFormDegeri): Promise<AdminForm> {
  const veri = await adminJsonFetch<{ form: AdminForm }>('/formlar', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  return normalizeForm(veri.form);
}

export async function adminFormGuncelle(id: string, form: FormFormDegeri): Promise<AdminForm> {
  const veri = await adminJsonFetch<{ form: AdminForm }>(`/formlar/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  return normalizeForm(veri.form);
}

export async function adminFormSil(id: string): Promise<void> {
  await adminJsonFetch(`/formlar/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function adminFormGonderimleriGetir(formId: string): Promise<FormGonderim[]> {
  const veri = await adminJsonFetch<{ gonderimler: FormGonderim[] }>(`/formlar/${formId}/gonderimler`, {
    headers: adminHeaders(),
  });
  return veri.gonderimler;
}

export async function adminGonderimOkundu(formId: string, gonderimId: string): Promise<void> {
  await adminJsonFetch(`/formlar/${formId}/gonderimler/${gonderimId}/okundu`, {
    method: 'PATCH',
    headers: adminHeaders(),
  });
}

export async function adminGonderimSil(formId: string, gonderimId: string): Promise<void> {
  await adminJsonFetch(`/formlar/${formId}/gonderimler/${gonderimId}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

function normalizeForm(form: AdminForm): AdminForm {
  const alanlar = form.alanlarJson;
  return {
    ...form,
    alanlarJson: Array.isArray(alanlar) ? alanlar : [],
    ayarlarJson: ayarlariBirlestir(form.ayarlarJson as Partial<FormAyarlar> | null),
  };
}

function payloadHazirla(form: FormFormDegeri) {
  const ayarlar = { ...form.ayarlarJson };
  const gorunum = ayarlar.gorunumTipi;
  const gorunumTipi =
    gorunum === 'sayfa-ici'
      ? 'inline'
      : gorunum === 'yuzucu' || gorunum === 'sabit-alt'
        ? 'modal'
        : gorunum;

  return {
    ad: form.ad.trim(),
    slug: form.slug.trim() || undefined,
    aciklama: form.aciklama.trim() || null,
    alanlarJson: form.alanlarJson,
    ayarlarJson: { ...ayarlar, gorunumTipi },
    aktif: form.aktif,
    bildirimEmail: form.bildirimEmail.trim() || null,
  };
}

export function formdanDeger(f: AdminForm): FormFormDegeri {
  return {
    ad: f.ad,
    slug: f.slug,
    aciklama: f.aciklama ?? '',
    alanlarJson: f.alanlarJson,
    ayarlarJson: ayarlariBirlestir(f.ayarlarJson),
    aktif: f.aktif,
    bildirimEmail: f.bildirimEmail ?? '',
  };
}

export const bosForm: FormFormDegeri = {
  ad: '',
  slug: '',
  aciklama: '',
  alanlarJson: [],
  ayarlarJson: ayarlariBirlestir(),
  aktif: true,
  bildirimEmail: '',
};
