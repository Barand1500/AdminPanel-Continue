import { useEffect, useMemo, useState } from 'react';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import { varsayilanConfig } from '@/types/widget';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
  AdminSekmeler,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { EkAyarlarPanel } from './EkAyarlarPanel';
import { WidgetYerlesimPanel } from './WidgetYerlesimPanel';
import { OrtakGorunumPanel } from './gorunum/OrtakGorunumPanel';
import { ICERIK_PANEL_MAP } from './panels/WidgetIcerikPanelleri';
import {
  GIZLI_WIDGET_TIPLERI,
  WIDGET_TIPLERI,
  tipDegistir,
  tipEtiketi,
  tipIkon,
  tipKategoriEtiketi,
  tipOlusturulabilirMi,
  varsayilanWidgetForm,
  widgetTipleriKategoriyeGore,
  WIDGET_TIP_KATEGORILERI,
} from './widgetRegistry';
import { WidgetTipSecici } from './WidgetTipSecici';
import { yerlesimEtiketi, yerlesimOku } from '@/utils/widgetYerlesim';
import { siraCakismasiBul } from '@/utils/widgetSiraYardimci';

export {
  WIDGET_TIPLERI,
  WIDGET_TIP_KATEGORILERI,
  GIZLI_WIDGET_TIPLERI,
  tipEtiketi,
  tipIkon,
  tipKategoriEtiketi,
  varsayilanWidgetForm,
  tipOlusturulabilirMi,
  widgetTipleriKategoriyeGore,
};

export function widgettenForma(widget: AdminWidget): WidgetFormDegeri {
  const cfg = widget.configJson && Object.keys(widget.configJson).length > 0
    ? widget.configJson
    : varsayilanConfig(widget.tip);
  return {
    ad: widget.ad,
    tip: widget.tip,
    sira: widget.sira,
    aktif: widget.aktif,
    baslik: widget.baslik ?? '',
    altBaslik: widget.altBaslik ?? '',
    aciklama: widget.aciklama ?? '',
    gorselUrl: widget.gorselUrl ?? '',
    butonMetni: widget.butonMetni ?? '',
    butonLink: widget.butonLink ?? '',
    arkaPlanRenk: widget.arkaPlanRenk ?? '',
    yaziRenk: widget.yaziRenk ?? '',
    mobilGoster: widget.mobilGoster,
    masaustuGoster: widget.masaustuGoster,
    configJsonMetin: JSON.stringify(cfg, null, 2),
  };
}

interface WidgetListesiPanelProps {
  widgetlar: AdminWidget[];
  seciliId: string | null;
  tipFiltre?: string;
  onSec: (widget: AdminWidget) => void;
}

export function WidgetListesiPanel({ widgetlar, seciliId, tipFiltre, onSec }: WidgetListesiPanelProps) {
  const [arama, setArama] = useState('');

  const gruplu = useMemo(() => {
    const q = arama.toLowerCase().trim();
    let liste = widgetlar;
    if (tipFiltre) liste = liste.filter((w) => w.tip === tipFiltre);
    if (q) {
      liste = liste.filter(
        (w) =>
          w.ad.toLowerCase().includes(q) ||
          w.tip.toLowerCase().includes(q) ||
          tipEtiketi(w.tip).toLowerCase().includes(q)
      );
    }

    const gruplar = new Map<string, AdminWidget[]>();
    for (const w of liste) {
      const meta = WIDGET_TIPLERI.find((t) => t.id === w.tip);
      const grup = meta?.grup ?? (GIZLI_WIDGET_TIPLERI.has(w.tip) ? 'Eski' : 'Diğer');
      if (!gruplar.has(grup)) gruplar.set(grup, []);
      gruplar.get(grup)!.push(w);
    }
    return [...gruplar.entries()];
  }, [widgetlar, arama, tipFiltre]);

  return (
    <aside className="ap-sidebar-panel ap-widget-sidebar">
      <div className="ap-sidebar-baslik">
        <h2 className="ap-heading text-sm font-semibold">Widgetlar</h2>
        <p className="ap-muted text-xs">{widgetlar.length} kayıt</p>
        <div className="ap-sidebar-arama mt-3">
          <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Widget ara..." />
        </div>
      </div>
      <div className="ap-scroll ap-sidebar-icerik ap-widget-sidebar-icerik">
        {gruplu.length === 0 ? (
          <AdminBosDurum ikon="🧩" baslik="Widget yok" aciklama="Alt bardan Yeni Ekle ile widget oluşturun" />
        ) : (
          gruplu.map(([grup, liste]) => (
            <div key={grup} className="mb-3">
              <p className="ap-widget-grup-baslik">{grup}</p>
              {liste.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onSec(w)}
                  className={`ap-liste-oge mb-1 ${seciliId === w.id ? 'ap-liste-oge-secili' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base">{tipIkon(w.tip)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="ap-liste-oge-baslik truncate">{w.ad}</p>
                      <p className="ap-liste-oge-alt">
                        {tipEtiketi(w.tip)} · {tipKategoriEtiketi(w.tip)} · {yerlesimEtiketi(yerlesimOku(w))} · Sıra {w.sira}
                      </p>
                      <div className="ap-liste-oge-etiketler">
                        {w.aktif ? (
                          <AdminDurumEtiketi tur="aktif">Aktif</AdminDurumEtiketi>
                        ) : (
                          <AdminDurumEtiketi tur="pasif">Pasif</AdminDurumEtiketi>
                        )}
                        {GIZLI_WIDGET_TIPLERI.has(w.tip) && (
                          <AdminDurumEtiketi tur="pasif">Eski tip</AdminDurumEtiketi>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

type EditorSekme = 'genel' | 'icerik' | 'gorunum' | 'gelismis';

interface WidgetEditorPanelProps {
  form: WidgetFormDegeri;
  seciliWidget: AdminWidget | null;
  yeniMod: boolean;
  kaydediliyor: boolean;
  hata: string;
  varsayilanTip?: string;
  tumWidgetlar?: AdminWidget[];
  onChange: (form: WidgetFormDegeri) => void;
  onKaydetTetikleyici?: (fn: () => Promise<void>) => void;
  onKaydet: (deger: WidgetFormDegeri, widgetId?: string) => Promise<void>;
  onTipSecildi?: (tip: string) => void;
}

export function WidgetEditorPanel({
  form,
  seciliWidget,
  yeniMod,
  kaydediliyor,
  hata,
  varsayilanTip: _varsayilanTip,
  tumWidgetlar = [],
  onChange,
  onKaydetTetikleyici,
  onKaydet,
  onTipSecildi,
}: WidgetEditorPanelProps) {
  const [sekme, setSekme] = useState<EditorSekme>('genel');

  async function submit() {
    await onKaydet(form, seciliWidget?.id);
  }

  useEffect(() => {
    onKaydetTetikleyici?.(submit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, seciliWidget]);

  const seciliTipMeta = WIDGET_TIPLERI.find((t) => t.id === form.tip);
  const IcerikPanel = ICERIK_PANEL_MAP[form.tip];
  const siraCakisma = useMemo(
    () => siraCakismasiBul(tumWidgetlar, form.sira, seciliWidget?.id),
    [tumWidgetlar, form.sira, seciliWidget?.id]
  );

  return (
    <div className="ap-editor-panel ap-widget-editor">
      <div className="ap-editor-ust">
        <div className="ap-editor-baslik">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tipIkon(form.tip)}</span>
            <div>
              <h2 className="ap-heading text-base font-semibold">
                {yeniMod ? 'Yeni Widget' : form.ad || 'Widget Düzenle'}
              </h2>
              <p className="ap-muted text-xs">{seciliTipMeta?.aciklama ?? tipEtiketi(form.tip)}</p>
            </div>
          </div>
          {form.aktif ? (
            <AdminDurumEtiketi tur="aktif">Aktif</AdminDurumEtiketi>
          ) : (
            <AdminDurumEtiketi tur="pasif">Pasif</AdminDurumEtiketi>
          )}
        </div>

        <AdminSekmeler
          aktif={sekme}
          onDegistir={setSekme}
          sekmeler={[
            { id: 'genel', etiket: 'Genel', ikon: '⚙️' },
            { id: 'icerik', etiket: 'İçerik', ikon: '📝' },
            { id: 'gorunum', etiket: 'Görünüm', ikon: '🎨' },
            { id: 'gelismis', etiket: 'Ek Ayarlar', ikon: '🔧' },
          ]}
        />
      </div>

      <div className="ap-editor-icerik">
        {sekme === 'genel' && (
          <>
            {yeniMod && (
              <AdminFormBolumu baslik="Widget Tipi" aciklama="Üstten kategori seçin; yalnızca o gruptaki bileşenler listelenir.">
                <WidgetTipSecici
                  seciliTip={form.tip}
                  onSec={(tip) => {
                    onChange(tipDegistir(form, tip));
                    onTipSecildi?.(tip);
                  }}
                />
              </AdminFormBolumu>
            )}

            <AdminFormBolumu baslik="Kimlik" aciklama="Admin panelinde görünecek ad. Boş bırakırsanız içerik başlığından otomatik üretilir.">
              <FormAlani etiket="Widget Adı">
                <input
                  className={formInputSinifi}
                  value={form.ad}
                  onChange={(e) => onChange({ ...form, ad: e.target.value })}
                  placeholder={form.baslik.trim() || tipEtiketi(form.tip) || 'Örnek: Anasayfa Metin Bloğu'}
                />
              </FormAlani>
              {!yeniMod && (
                <FormAlani etiket="Tip">
                  {tipOlusturulabilirMi(form.tip) ? (
                    <select
                      className={formSelectSinifi}
                      value={form.tip}
                      onChange={(e) => {
                        onChange(tipDegistir(form, e.target.value));
                        onTipSecildi?.(e.target.value);
                      }}
                    >
                      {widgetTipleriKategoriyeGore().map(({ kategori, tipler }) => (
                        <optgroup key={kategori.id} label={kategori.etiket}>
                          {tipler.map((t) => (
                            <option key={t.id} value={t.id}>{t.etiket}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-amber-400">{tipEtiketi(form.tip)} (eski tip — yalnızca düzenlenebilir)</p>
                  )}
                  {tipOlusturulabilirMi(form.tip) && (
                    <p className="ap-muted mt-1 text-xs">Kategori: {tipKategoriEtiketi(form.tip)}</p>
                  )}
                </FormAlani>
              )}
              <FormAlani etiket="Sıra" aciklama="Küçük numara önce render edilir. Yeni widgetlarda otomatik atanır.">
                <input
                  type="number"
                  min={1}
                  className={`${formInputSinifi} max-w-[120px]`}
                  value={form.sira}
                  onChange={(e) => onChange({ ...form, sira: Number(e.target.value) })}
                />
              </FormAlani>
              {siraCakisma && (
                <div className="ap-sira-uyari" role="alert">
                  <strong>⚠️ Sıra çakışması:</strong> Sıra <strong>{form.sira}</strong> zaten{' '}
                  <strong>&quot;{siraCakisma.ad}&quot;</strong> ({tipEtiketi(siraCakisma.tip)}) widgetında kullanılıyor.
                  Lütfen birinin sırasını değiştirin, aksi halde görüntüleme sırası belirsiz olur.
                </div>
              )}
              <AdminAnahtarDugme etiket="Aktif" acik={form.aktif} onDegistir={(v) => onChange({ ...form, aktif: v })} />
            </AdminFormBolumu>

            <WidgetYerlesimPanel
              form={form}
              onChange={onChange}
              digerWidgetlar={tumWidgetlar}
              mevcutWidgetId={seciliWidget?.id}
            />
          </>
        )}

        {sekme === 'icerik' && (
          IcerikPanel ? (
            <IcerikPanel form={form} onChange={onChange} />
          ) : (
            <AdminBosDurum ikon="📝" baslik="İçerik paneli yok" aciklama="Bu widget tipi için özel içerik editörü tanımlı değil." />
          )
        )}

        {sekme === 'gorunum' && <OrtakGorunumPanel form={form} onChange={onChange} />}

        {sekme === 'gelismis' && <EkAyarlarPanel form={form} onChange={onChange} />}

        {hata && <p className="text-sm text-red-400">{hata}</p>}
        {kaydediliyor && <p className="ap-muted text-sm">Kaydediliyor...</p>}
      </div>
    </div>
  );
}
