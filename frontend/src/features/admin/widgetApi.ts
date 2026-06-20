import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import { tokenAl } from '@/features/auth/authApi';
import { jsonYanitOku } from '@/utils/jsonFetch';
import { idString } from '@/utils/idKarsilastir';
import { AKTIF_WIDGET_TIPLERI, DEPRECATED_WIDGET_TIPLERI } from '@/types/widget';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';

function widgetAdUret(form: WidgetFormDegeri) {
  const ad = form.ad.trim();
  if (ad.length >= 2) return ad;
  const baslik = form.baslik.trim();
  if (baslik.length >= 2) return baslik;
  const tipAd = tipEtiketi(form.tip) || 'Widget';
  return ad.length === 1 ? `${ad} — ${tipAd}` : tipAd;
}

function apiHataMesaji(veri: { mesaj?: string; hatalar?: Record<string, string[] | undefined> }, varsayilan: string) {
  if (veri.hatalar && typeof veri.hatalar === 'object') {
    const satirlar = Object.entries(veri.hatalar)
      .flatMap(([alan, liste]) => (liste ?? []).map((m) => `${alan}: ${m}`));
    if (satirlar.length > 0) return satirlar.join(' · ');
  }
  return veri.mesaj ?? varsayilan;
}

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

const widgetTipleri = [...AKTIF_WIDGET_TIPLERI, ...DEPRECATED_WIDGET_TIPLERI];

function temizleOpsiyonel(metin: string) {
  const trimmed = metin.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** API sayfaId'yi sayı döndürebilir; kayıt öncesi string'e çevir */
function sayfaIdPayload(form: WidgetFormDegeri): string | null {
  const ham = form.sayfaId;
  if (ham == null || ham === '') return null;
  const metin = idString(ham).trim();
  return metin.length > 0 ? metin : null;
}

function adminWidgetNormalize(widget: AdminWidget): AdminWidget {
  return {
    ...widget,
    id: idString(widget.id),
    siteId: idString(widget.siteId),
    sayfaId: widget.sayfaId != null && widget.sayfaId !== '' ? idString(widget.sayfaId) : null,
  };
}

function payloadHazirla(form: WidgetFormDegeri, guncelleme = false) {
  if (!widgetTipleri.includes(form.tip as (typeof widgetTipleri)[number])) {
    throw new Error('Geçersiz widget tipi');
  }
  if (!guncelleme && (DEPRECATED_WIDGET_TIPLERI as readonly string[]).includes(form.tip)) {
    throw new Error('Bu widget tipi artık desteklenmiyor');
  }

  let configJson: Record<string, unknown> | null = null;
  const cfg = form.configJsonMetin.trim();
  if (cfg) {
    try {
      configJson = JSON.parse(cfg) as Record<string, unknown>;
    } catch {
      throw new Error('Config JSON geçersiz');
    }
  }

  return {
    ad: widgetAdUret(form),
    tip: form.tip,
    sira: Number(form.sira) || 0,
    aktif: form.aktif,
    baslik: temizleOpsiyonel(form.baslik),
    altBaslik: temizleOpsiyonel(form.altBaslik),
    aciklama: temizleOpsiyonel(form.aciklama),
    gorselUrl: temizleOpsiyonel(form.gorselUrl),
    butonMetni: temizleOpsiyonel(form.butonMetni),
    butonLink: temizleOpsiyonel(form.butonLink),
    arkaPlanRenk: temizleOpsiyonel(form.arkaPlanRenk),
    yaziRenk: temizleOpsiyonel(form.yaziRenk),
    mobilGoster: form.mobilGoster,
    masaustuGoster: form.masaustuGoster,
    configJson,
    sayfaId: sayfaIdPayload(form),
  };
}

function authHeaders() {
  const token = tokenAl();
  if (!token) {
    throw new Error('Oturum bulunamadi');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function widgetlariGetir(tip?: string): Promise<AdminWidget[]> {
  const query = tip ? `?tip=${encodeURIComponent(tip)}` : '';
  const yanit = await fetch(`${API_URL}/admin/widgetlar${query}`, {
    headers: authHeaders(),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined>; widgetlar?: AdminWidget[] }>(yanit);
  if (!yanit.ok) throw new Error(apiHataMesaji(veri, 'Widgetlar alinamadi'));
  return (veri.widgetlar as AdminWidget[]).map(adminWidgetNormalize);
}

export async function widgetOlustur(form: WidgetFormDegeri): Promise<AdminWidget> {
  const yanit = await fetch(`${API_URL}/admin/widgetlar`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payloadHazirla(form)),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined>; widget?: AdminWidget }>(yanit);
  if (!yanit.ok) throw new Error(apiHataMesaji(veri, 'Widget olusturulamadi'));
  return adminWidgetNormalize(veri.widget as AdminWidget);
}

export async function widgetGuncelle(id: string, form: WidgetFormDegeri): Promise<AdminWidget> {
  const yanit = await fetch(`${API_URL}/admin/widgetlar/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payloadHazirla(form, true)),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined>; widget?: AdminWidget }>(yanit);
  if (!yanit.ok) throw new Error(apiHataMesaji(veri, 'Widget guncellenemedi'));
  return adminWidgetNormalize(veri.widget as AdminWidget);
}

export async function widgetSil(id: string): Promise<void> {
  const yanit = await fetch(`${API_URL}/admin/widgetlar/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined> }>(yanit);
  if (!yanit.ok) throw new Error(apiHataMesaji(veri, 'Widget silinemedi'));
}
