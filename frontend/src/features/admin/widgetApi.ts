import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import { tokenAl } from '@/features/auth/authApi';
import { jsonYanitOku } from '@/utils/jsonFetch';
import {
  adminWidgetNormalize,
  formSayfaId,
  widgetFormNormalize,
} from '@/utils/widgetFormYardimci';
import { AKTIF_WIDGET_TIPLERI, DEPRECATED_WIDGET_TIPLERI } from '@/types/widget';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import {
  kurumsalHeroFormdanYerelWidget,
  kurumsalHeroYerelGuncelle,
  kurumsalHeroYerelIdMi,
  kurumsalHeroYerelKayitId,
  kurumsalHeroYerelKayitVarMi,
  kurumsalHeroYerelOlustur,
  kurumsalHeroYerelSil,
  kurumsalHeroYerelWidgetlariBirlestir,
} from '@/utils/kurumsalHeroLocalDepo';
import {
  KURUMSAL_HERO_PROXY_TIP,
  kurumsalHeroApiPayloadDonustur,
  kurumsalHeroApiPayloadGerekli,
  kurumsalHeroWidgetNormalize,
  kurumsalHeroWidgetlariNormalize,
} from '@/utils/kurumsalHeroProxy';

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

function sayfaIdPayload(form: WidgetFormDegeri): string | null {
  const metin = formSayfaId(form.sayfaId).trim();
  return metin.length > 0 ? metin : null;
}

function payloadHazirla(form: WidgetFormDegeri, guncelleme = false) {
  form = widgetFormNormalize(form);
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

function apiPayloadHazirla(form: WidgetFormDegeri, guncelleme = false) {
  const payload = payloadHazirla(form, guncelleme);
  return kurumsalHeroApiPayloadGerekli(payload) ? kurumsalHeroApiPayloadDonustur(payload) : payload;
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

function adminWidgetApiNormalize(widget: AdminWidget): AdminWidget {
  return kurumsalHeroWidgetNormalize(adminWidgetNormalize(widget));
}

export async function widgetlariGetir(tip?: string): Promise<AdminWidget[]> {
  const apiTip = tip === 'KURUMSAL_HERO' ? KURUMSAL_HERO_PROXY_TIP : tip;
  const query = apiTip ? `?tip=${encodeURIComponent(apiTip)}` : '';
  const yanit = await fetch(`${API_URL}/admin/widgetlar${query}`, {
    headers: authHeaders(),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined>; widgetlar?: AdminWidget[] }>(yanit);
  if (!yanit.ok) throw new Error(apiHataMesaji(veri, 'Widgetlar alinamadi'));
  const apiWidgetlar = kurumsalHeroWidgetlariNormalize(
    (veri.widgetlar as AdminWidget[]).map(adminWidgetNormalize),
  );
  const birlesik = kurumsalHeroYerelWidgetlariBirlestir(apiWidgetlar);
  if (!tip) return birlesik;
  return birlesik.filter((w) => w.tip === tip);
}

async function kurumsalHeroYerelKaydet(
  form: WidgetFormDegeri,
  payload: Record<string, unknown>,
  id?: string,
): Promise<AdminWidget> {
  const yerelId = id ? kurumsalHeroYerelKayitId(id) : undefined;
  const taslak = kurumsalHeroFormdanYerelWidget(form, payload, yerelId);
  if (id && kurumsalHeroYerelKayitVarMi(id)) {
    return kurumsalHeroYerelGuncelle(yerelId!, taslak);
  }
  return kurumsalHeroYerelOlustur(taslak);
}

export async function widgetOlustur(form: WidgetFormDegeri): Promise<AdminWidget> {
  const payload = payloadHazirla(form);
  const apiPayload = apiPayloadHazirla(form);

  const yanit = await fetch(`${API_URL}/admin/widgetlar`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(apiPayload),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined>; widget?: AdminWidget }>(yanit);
  if (!yanit.ok) {
    if (form.tip === 'KURUMSAL_HERO') {
      return kurumsalHeroYerelKaydet(form, payload);
    }
    throw new Error(apiHataMesaji(veri, 'Widget olusturulamadi'));
  }
  return adminWidgetApiNormalize(veri.widget as AdminWidget);
}

export async function widgetGuncelle(id: string, form: WidgetFormDegeri): Promise<AdminWidget> {
  const payload = payloadHazirla(form, true);
  const apiPayload = apiPayloadHazirla(form, true);

  if (kurumsalHeroYerelIdMi(id)) {
    return kurumsalHeroYerelGuncelle(id, kurumsalHeroFormdanYerelWidget(form, payload, id));
  }

  const yanit = await fetch(`${API_URL}/admin/widgetlar/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(apiPayload),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined>; widget?: AdminWidget }>(yanit);
  if (!yanit.ok) {
    if (form.tip === 'KURUMSAL_HERO') {
      return kurumsalHeroYerelKaydet(form, payload, id);
    }
    throw new Error(apiHataMesaji(veri, 'Widget guncellenemedi'));
  }
  return adminWidgetApiNormalize(veri.widget as AdminWidget);
}

export async function widgetSil(id: string): Promise<void> {
  if (kurumsalHeroYerelIdMi(id) || kurumsalHeroYerelKayitVarMi(id)) {
    kurumsalHeroYerelSil(kurumsalHeroYerelKayitId(id));
    return;
  }

  const yanit = await fetch(`${API_URL}/admin/widgetlar/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const veri = await jsonYanitOku<{ mesaj?: string; hatalar?: Record<string, string[] | undefined> }>(yanit);
  if (!yanit.ok) throw new Error(apiHataMesaji(veri, 'Widget silinemedi'));
}
