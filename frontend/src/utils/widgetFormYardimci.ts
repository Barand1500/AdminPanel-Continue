import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import { varsayilanConfig } from '@/types/widget';
import { idString } from '@/utils/idKarsilastir';

/** Form / API metin alanlarını güvenli string'e çevirir */
function formMetin(deger: unknown): string {
  if (deger == null) return '';
  return String(deger);
}

/** sayfaId: API sayı döndürebilir; form her zaman string bekler */
export function formSayfaId(deger: unknown): string {
  if (deger == null || deger === '') return '';
  return idString(deger);
}

/** Kayıt ve state güncellemelerinden önce formu normalize eder */
export function widgetFormNormalize(form: WidgetFormDegeri): WidgetFormDegeri {
  return {
    ...form,
    ad: formMetin(form.ad),
    baslik: formMetin(form.baslik),
    altBaslik: formMetin(form.altBaslik),
    aciklama: formMetin(form.aciklama),
    gorselUrl: formMetin(form.gorselUrl),
    butonMetni: formMetin(form.butonMetni),
    butonLink: formMetin(form.butonLink),
    arkaPlanRenk: formMetin(form.arkaPlanRenk),
    yaziRenk: formMetin(form.yaziRenk),
    configJsonMetin: formMetin(form.configJsonMetin),
    sayfaId: formSayfaId(form.sayfaId),
  };
}

export function adminWidgetNormalize(widget: AdminWidget): AdminWidget {
  return {
    ...widget,
    id: idString(widget.id),
    siteId: idString(widget.siteId),
    sayfaId: widget.sayfaId != null && widget.sayfaId !== '' ? idString(widget.sayfaId) : null,
  };
}

export function widgettenForma(widget: AdminWidget): WidgetFormDegeri {
  const w = adminWidgetNormalize(widget);
  const cfg =
    w.configJson && Object.keys(w.configJson).length > 0
      ? w.configJson
      : varsayilanConfig(w.tip);
  return widgetFormNormalize({
    ad: w.ad,
    tip: w.tip,
    sira: w.sira,
    aktif: w.aktif,
    baslik: w.baslik ?? '',
    altBaslik: w.altBaslik ?? '',
    aciklama: w.aciklama ?? '',
    gorselUrl: w.gorselUrl ?? '',
    butonMetni: w.butonMetni ?? '',
    butonLink: w.butonLink ?? '',
    arkaPlanRenk: w.arkaPlanRenk ?? '',
    yaziRenk: w.yaziRenk ?? '',
    mobilGoster: w.mobilGoster,
    masaustuGoster: w.masaustuGoster,
    configJsonMetin: JSON.stringify(cfg, null, 2),
    sayfaId: formSayfaId(w.sayfaId),
  });
}
