import { adminHeaders, adminJsonFetch } from './adminFetch';

export interface AdminGorev {
  id: string;
  metin: string;
  tamamlandi: boolean;
  onemli: boolean;
  tarih: string | null;
  tarihBitis: string | null;
  olusturma: string;
  guncelleme: string;
}

export interface AdminGorevOlusturForm {
  metin: string;
  tamamlandi?: boolean;
  onemli?: boolean;
  tarih?: string | null;
  tarihBitis?: string | null;
}

export type AdminGorevGuncelleForm = Partial<AdminGorevOlusturForm>;

export async function adminGorevleriGetir(): Promise<AdminGorev[]> {
  const yanit = await adminJsonFetch<{ gorevler: AdminGorev[] }>('/gorevler', {
    headers: adminHeaders(),
  });
  return yanit.gorevler.map(gorevNormalize);
}

export async function adminGorevOlustur(form: AdminGorevOlusturForm): Promise<AdminGorev> {
  const yanit = await adminJsonFetch<{ gorev: AdminGorev }>('/gorevler', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(gorevPayload(form)),
  });
  return gorevNormalize(yanit.gorev);
}

export async function adminGorevGuncelle(id: string, form: AdminGorevGuncelleForm): Promise<AdminGorev> {
  const yanit = await adminJsonFetch<{ gorev: AdminGorev }>(`/gorevler/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(gorevPayload(form)),
  });
  return gorevNormalize(yanit.gorev);
}

export async function adminGorevSil(id: string): Promise<void> {
  await adminJsonFetch(`/gorevler/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

function gorevPayload(form: AdminGorevGuncelleForm): AdminGorevGuncelleForm {
  const payload: AdminGorevGuncelleForm = { ...form };
  if (typeof payload.metin === 'string') payload.metin = payload.metin.trim();
  return payload;
}

function gorevNormalize(gorev: AdminGorev): AdminGorev {
  return {
    ...gorev,
    id: String(gorev.id),
    tarih: tarihNormalize(gorev.tarih),
    tarihBitis: tarihNormalize(gorev.tarihBitis),
  };
}

function tarihNormalize(tarih: string | null | undefined): string | null {
  if (!tarih) return null;
  const eslesme = /^(\d{4}-\d{2}-\d{2})/.exec(String(tarih).trim());
  return eslesme ? eslesme[1] : null;
}
