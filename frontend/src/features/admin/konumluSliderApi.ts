import { adminHeaders, adminJsonFetch } from './adminFetch';
import { idString } from '@/utils/idKarsilastir';
import {
  konumluSliderConfigOku,
  type KonumluSliderConfig,
  type KonumluSliderFormDegeri,
  type KonumluSliderKayit,
} from '@/types/konumluSlider';

export async function konumluSliderlariGetir(): Promise<KonumluSliderKayit[]> {
  const veri = await adminJsonFetch<{ sliderlar: KonumluSliderKayit[] }>('/konumlu-sliderlar', {
    headers: adminHeaders(),
  });
  return veri.sliderlar.map(normalize);
}

export async function konumluSliderOlustur(form: KonumluSliderFormDegeri): Promise<KonumluSliderKayit> {
  const veri = await adminJsonFetch<{ slider: KonumluSliderKayit }>('/konumlu-sliderlar', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload(form)),
  });
  return normalize(veri.slider);
}

export async function konumluSliderGuncelle(
  id: string,
  form: KonumluSliderFormDegeri
): Promise<KonumluSliderKayit> {
  const veri = await adminJsonFetch<{ slider: KonumluSliderKayit }>(`/konumlu-sliderlar/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload(form)),
  });
  return normalize(veri.slider);
}

export async function konumluSliderSil(id: string): Promise<void> {
  await adminJsonFetch(`/konumlu-sliderlar/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

function normalize(s: KonumluSliderKayit): KonumluSliderKayit {
  return {
    ...s,
    id: idString(s.id),
    siteId: idString(s.siteId),
    sayfaId: s.sayfaId != null ? idString(s.sayfaId) : null,
    configJson: konumluSliderConfigOku(s.configJson),
  };
}

function payload(form: KonumluSliderFormDegeri) {
  return {
    ad: form.ad.trim(),
    sayfaId: form.sayfaId ? form.sayfaId : null,
    aktif: form.aktif,
    sira: form.sira,
    configJson: form.configJson as KonumluSliderConfig,
  };
}
