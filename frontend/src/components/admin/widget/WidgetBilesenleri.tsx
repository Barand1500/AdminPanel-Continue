import { useEffect, useMemo, useRef, useState } from 'react';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import { widgetFormMockUygula } from '@/types/widget';
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
import { yerlesimEtiketi, yerlesimOku, widgetSayfaFiltrele, widgetSayfaFiltreOgeleri } from '@/utils/widgetYerlesim';
import { siraCakismasiBul } from '@/utils/widgetSiraYardimci';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import { idString } from '@/utils/idKarsilastir';
import { widgettenForma } from '@/utils/widgetFormYardimci';

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
  widgettenForma,
};

interface WidgetListesiPanelProps {
  widgetlar: AdminWidget[];
  seciliId: string | null;
  tipFiltre?: string;
  sayfalar?: AdminSayfa[];
  onSec: (widget: AdminWidget) => void;
}

export function WidgetListesiPanel({
  widgetlar,
  seciliId,
  tipFiltre,
  sayfalar = [],
  onSec,
}: WidgetListesiPanelProps) {
  const [arama, setArama] = useState('');
  const [sayfaFiltre, setSayfaFiltre] = useState<string | null>(null);

  const sayfaAdlari = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of sayfalar) map.set(idString(s.id), s.baslik);
    return map;
  }, [sayfalar]);

  const sayfaRozetleri = useMemo(
    () => widgetSayfaFiltreOgeleri(widgetlar, sayfaAdlari),
    [widgetlar, sayfaAdlari]
  );

  const gruplu = useMemo(() => {
    const q = arama.toLowerCase().trim();
    let liste = widgetSayfaFiltrele(widgetlar, sayfaFiltre) as AdminWidget[];
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
  }, [widgetlar, arama, tipFiltre, sayfaFiltre]);

  function sayfaEtiketi(sayfaId?: string | null) {
    if (!sayfaId) return 'Ana Sayfa';
    return sayfaAdlari.get(idString(sayfaId)) ?? 'Sayfa';
  }

  return (
    <aside className="ap-sidebar-panel ap-widget-sidebar">
      <div className="ap-sidebar-baslik ap-sidebar-baslik-dikey">
        <h2 className="ap-heading text-sm font-semibold">Widgetlar</h2>
        <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Widget ara..." />
        {sayfaRozetleri.length > 0 && (
          <div className="ap-widget-sayfa-filtreler" role="tablist" aria-label="Sayfaya göre filtre">
            {sayfaRozetleri.map((rozet) => (
              <button
                key={rozet.id}
                type="button"
                role="tab"
                aria-selected={sayfaFiltre === rozet.id}
                onClick={() => setSayfaFiltre((onceki) => (onceki === rozet.id ? null : rozet.id))}
                className={`ap-widget-sayfa-filtre ${sayfaFiltre === rozet.id ? 'ap-widget-sayfa-filtre-aktif' : ''}`}
              >
                {rozet.etiket}
              </button>
            ))}
          </div>
        )}
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
                        {sayfaEtiketi(w.sayfaId)} · {tipEtiketi(w.tip)} · {yerlesimEtiketi(yerlesimOku(w))} · Sıra {w.sira}
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

import { WidgetEklemePanel } from './olusturucu/WidgetEklemePanel';

type EditorSekme = 'genel' | 'icerik' | 'gorunum' | 'gelismis' | 'widgetEkleme';

interface WidgetEditorPanelProps {
  form: WidgetFormDegeri;
  seciliWidget: AdminWidget | null;
  yeniMod: boolean;
  kaydediliyor: boolean;
  hata: string;
  varsayilanTip?: string;
  tumWidgetlar?: AdminWidget[];
  sayfalar?: AdminSayfa[];
  onChange: (form: WidgetFormDegeri) => void;
  onKaydetTetikleyici?: (fn: () => Promise<void>) => void;
  onKaydet: (deger: WidgetFormDegeri, widgetId?: string) => Promise<void>;
  onTipSecildi?: (tip: string) => void;
  onOtomatikDoldurChange?: (acik: boolean) => void;
}

export function WidgetEditorPanel({
  form,
  seciliWidget,
  yeniMod,
  kaydediliyor,
  hata,
  varsayilanTip: _varsayilanTip,
  tumWidgetlar = [],
  sayfalar = [],
  onChange,
  onKaydetTetikleyici,
  onKaydet,
  onTipSecildi,
  onOtomatikDoldurChange,
}: WidgetEditorPanelProps) {
  const [sekme, setSekme] = useState<EditorSekme>('genel');
  const [otomatikDoldur, setOtomatikDoldur] = useState(false);
  const formYedekRef = useRef<WidgetFormDegeri | null>(null);
  const yedekAnahtarRef = useRef<string | null>(null);
  const widgetAnahtar = seciliWidget?.id ?? 'yeni';
  const oncekiAnahtarRef = useRef(widgetAnahtar);
  const oncekiTipRef = useRef(form.tip);

  useEffect(() => {
    onOtomatikDoldurChange?.(otomatikDoldur);
  }, [otomatikDoldur, onOtomatikDoldurChange]);

  useEffect(() => {
    if (yeniMod && form.tip === 'BLOK_OLUSTURUCU') {
      setSekme('widgetEkleme');
    }
  }, [yeniMod, form.tip, widgetAnahtar]);

  useEffect(() => {
    if (oncekiAnahtarRef.current === widgetAnahtar) return;
    oncekiAnahtarRef.current = widgetAnahtar;
    oncekiTipRef.current = form.tip;
    formYedekRef.current = null;
    yedekAnahtarRef.current = null;
    setOtomatikDoldur(yeniMod);
  }, [widgetAnahtar, yeniMod]);

  useEffect(() => {
    if (!otomatikDoldur) {
      oncekiTipRef.current = form.tip;
      return;
    }
    const yedekGecersiz = yedekAnahtarRef.current !== widgetAnahtar;
    const tipDegisti = oncekiTipRef.current !== form.tip;

    if (!formYedekRef.current || yedekGecersiz) {
      formYedekRef.current = structuredClone(form);
      yedekAnahtarRef.current = widgetAnahtar;
      oncekiTipRef.current = form.tip;
      onChange(widgetFormMockUygula(form));
      return;
    }
    if (tipDegisti) {
      oncekiTipRef.current = form.tip;
      formYedekRef.current = structuredClone(form);
      onChange(widgetFormMockUygula(form));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca toggle/tip/widget değişiminde
  }, [otomatikDoldur, form.tip, widgetAnahtar]);

  function otomatikDoldurDegistir(acik: boolean) {
    if (acik) {
      formYedekRef.current = structuredClone(form);
      yedekAnahtarRef.current = widgetAnahtar;
      setOtomatikDoldur(true);
      onChange(widgetFormMockUygula(form));
      return;
    }
    setOtomatikDoldur(false);
    if (formYedekRef.current && yedekAnahtarRef.current === widgetAnahtar) {
      onChange(formYedekRef.current);
    }
    formYedekRef.current = null;
    yedekAnahtarRef.current = null;
  }

  async function submit() {
    await onKaydet(form, seciliWidget?.id);
  }

  useEffect(() => {
    onKaydetTetikleyici?.(submit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, seciliWidget]);

  const seciliTipMeta = WIDGET_TIPLERI.find((t) => t.id === form.tip);
  const IcerikPanel = ICERIK_PANEL_MAP[form.tip];
  const sayfaEtiketi = useMemo(() => {
    if (!form.sayfaId) return 'Ana Sayfa';
    return sayfalar.find((s) => idString(s.id) === idString(form.sayfaId))?.baslik ?? 'Sayfa';
  }, [form.sayfaId, sayfalar]);
  const siraCakisma = useMemo(
    () => siraCakismasiBul(tumWidgetlar, form.sira, form.sayfaId, seciliWidget?.id),
    [tumWidgetlar, form.sira, form.sayfaId, seciliWidget?.id]
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
            ...(form.tip === 'BLOK_OLUSTURUCU'
              ? [{ id: 'widgetEkleme' as const, etiket: 'Widget Ekleme', ikon: '➕' }]
              : []),
          ]}
        />
      </div>

      <div className={`ap-editor-icerik${sekme === 'widgetEkleme' ? ' ap-editor-icerik-ekleme' : ''}`}>
        {sekme === 'genel' && (
          <>
            {yeniMod && (
              <AdminFormBolumu baslik="Widget Tipi" aciklama="Üstten kategori seçin; yalnızca o gruptaki bileşenler listelenir.">
                <WidgetTipSecici
                  seciliTip={form.tip}
                  onSec={(tip) => {
                    onChange(tipDegistir(form, tip, tumWidgetlar));
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
                        onChange(tipDegistir(form, e.target.value, tumWidgetlar));
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
              <FormAlani
                etiket={`Sıra — ${sayfaEtiketi}`}
                aciklama={`${sayfaEtiketi} sayfasındaki görüntüleme sırası. Her sayfanın kendi 1, 2, 3… dizisi vardır.`}
              >
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
                  <strong>⚠️ Sıra çakışması:</strong> <strong>{sayfaEtiketi}</strong> sayfasında sıra{' '}
                  <strong>{form.sira}</strong> zaten{' '}
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
              sayfalar={sayfalar}
            />
          </>
        )}

        {sekme === 'icerik' && (
          <>
            <AdminFormBolumu
              baslik="Otomatik doldur"
              aciklama="Boş alanları örnek metin, görsel ve liste verileriyle doldurur. Kapattığınızda açmadan önceki haline döner. Kaydetmeden önce içeriği düzenleyebilirsiniz."
            >
              <AdminAnahtarDugme
                etiket="Örnek içerikle doldur"
                acik={otomatikDoldur}
                onDegistir={otomatikDoldurDegistir}
              />
            </AdminFormBolumu>
            {IcerikPanel ? (
              <IcerikPanel form={form} onChange={onChange} />
            ) : (
              <AdminBosDurum ikon="📝" baslik="İçerik paneli yok" aciklama="Bu widget tipi için özel içerik editörü tanımlı değil." />
            )}
          </>
        )}

        {sekme === 'gorunum' && <OrtakGorunumPanel form={form} onChange={onChange} />}

        {sekme === 'gelismis' && <EkAyarlarPanel form={form} onChange={onChange} />}

        {sekme === 'widgetEkleme' && form.tip === 'BLOK_OLUSTURUCU' && (
          <WidgetEklemePanel
            form={form}
            onChange={onChange}
            tumWidgetlar={tumWidgetlar}
            onGenelSekmesi={() => setSekme('genel')}
          />
        )}

        {hata && <p className="text-sm text-red-400">{hata}</p>}
        {kaydediliyor && <p className="ap-muted text-sm">Kaydediliyor...</p>}
      </div>
    </div>
  );
}
