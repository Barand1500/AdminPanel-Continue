import { useEffect, useMemo, useRef, useState } from 'react';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import { widgetFormMockUygula } from '@/types/widget';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { EkAyarlarPanel } from './EkAyarlarPanel';
import { WidgetYerlesimPanel } from './WidgetYerlesimPanel';
import { OrtakGorunumPanel } from './gorunum/OrtakGorunumPanel';
import { WidgetEklemePanel } from './olusturucu/WidgetEklemePanel';
import { ICERIK_PANEL_MAP } from './panels/WidgetIcerikPanelleri';
import {
  GIZLI_WIDGET_TIPLERI,
  WIDGET_TIPLERI,
  tipEtiketi,
  tipIkon,
  tipKategoriEtiketi,
  tipOlusturulabilirMi,
  varsayilanWidgetForm,
  widgetTipleriKategoriyeGore,
  WIDGET_TIP_KATEGORILERI,
} from './widgetRegistry';
import { yerlesimEtiketi, yerlesimOku, widgetSayfaFiltreOgeleri } from '@/utils/widgetYerlesim';
import { sayfaFiltreWidgetlari, siraCakismasiBul } from '@/utils/widgetSiraYardimci';
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
  onDuzenle: (widget: AdminWidget) => void;
}

export function WidgetListesiPanel({
  widgetlar,
  seciliId,
  tipFiltre,
  sayfalar = [],
  onSec,
  onDuzenle,
}: WidgetListesiPanelProps) {
  const [arama, setArama] = useState('');
  const [durumFiltre, setDurumFiltre] = useState<'tumu' | 'aktif' | 'pasif'>('tumu');
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

  const listeGorunumu = useMemo(() => {
    const q = arama.toLowerCase().trim();
    let liste =
      sayfaFiltre != null
        ? sayfaFiltreWidgetlari(widgetlar, sayfaFiltre, tipFiltre)
        : ([...widgetlar] as AdminWidget[])
            .filter((w) => !tipFiltre || w.tip === tipFiltre)
            .sort((a, b) => Number(a.sira) - Number(b.sira) || a.ad.localeCompare(b.ad, 'tr'));
    if (durumFiltre === 'aktif') liste = liste.filter((w) => w.aktif);
    if (durumFiltre === 'pasif') liste = liste.filter((w) => !w.aktif);
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
    for (const arr of gruplar.values()) {
      arr.sort((a, b) => Number(a.sira) - Number(b.sira) || a.ad.localeCompare(b.ad, 'tr'));
    }
    return { gruplar: [...gruplar.entries()] };
  }, [widgetlar, arama, durumFiltre, tipFiltre, sayfaFiltre]);

  function widgetSatiri(w: AdminWidget) {
    return (
      <button
        key={w.id}
        type="button"
        onClick={() => onSec(w)}
        onDoubleClick={() => onDuzenle(w)}
        title="Düzenlemek için çift tıklayın"
        className={`ap-liste-oge ap-form-liste-oge${seciliId === w.id ? ' ap-liste-oge-secili' : ''}`}
      >
        <span className="ap-form-liste-ikon" aria-hidden>
          {tipIkon(w.tip)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="ap-liste-oge-baslik">{w.ad}</span>
          <span className="ap-liste-oge-alt">
            {sayfaEtiketi(w.sayfaId)} · {tipEtiketi(w.tip)} · {yerlesimEtiketi(yerlesimOku(w))} · Sıra {w.sira}
          </span>
          <span className="ap-liste-oge-etiketler mt-1.5">
            {w.aktif ? (
              <AdminDurumEtiketi tur="aktif">Aktif</AdminDurumEtiketi>
            ) : (
              <AdminDurumEtiketi tur="pasif">Pasif</AdminDurumEtiketi>
            )}
            {GIZLI_WIDGET_TIPLERI.has(w.tip) && (
              <AdminDurumEtiketi tur="pasif">Eski tip</AdminDurumEtiketi>
            )}
          </span>
        </span>
      </button>
    );
  }

  function sayfaEtiketi(sayfaId?: string | null) {
    if (!sayfaId) return 'Ana Sayfa';
    return sayfaAdlari.get(idString(sayfaId)) ?? 'Sayfa';
  }

  const aktifSayisi = widgetlar.filter((w) => w.aktif).length;

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Widgetlar</h2>
          <p className="ap-muted text-xs">
            {widgetlar.length} kayıt · {aktifSayisi} aktif
          </p>
        </div>
        <div className="ap-form-filtre-piller">
          {([
            { id: 'tumu', etiket: 'Tümü' },
            { id: 'aktif', etiket: 'Aktif' },
            { id: 'pasif', etiket: 'Pasif' },
          ] as const).map((f) => (
            <button
              key={f.id}
              type="button"
              className={`ap-form-filtre-pil${durumFiltre === f.id ? ' ap-form-filtre-pil--aktif' : ''}`}
              onClick={() => setDurumFiltre(f.id)}
            >
              {f.etiket}
            </button>
          ))}
        </div>
      </div>
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Widget adı veya tip ara..." />
      {sayfaRozetleri.length > 0 && (
        <div className="ap-widget-liste-filtreler" role="tablist" aria-label="Sayfaya göre filtre">
          <button
            type="button"
            role="tab"
            aria-selected={sayfaFiltre == null}
            className={`ap-form-filtre-pil${sayfaFiltre == null ? ' ap-form-filtre-pil--aktif' : ''}`}
            onClick={() => setSayfaFiltre(null)}
          >
            Tüm sayfalar
          </button>
          {sayfaRozetleri.map((rozet) => (
            <button
              key={rozet.id}
              type="button"
              role="tab"
              aria-selected={sayfaFiltre === rozet.id}
              className={`ap-form-filtre-pil${sayfaFiltre === rozet.id ? ' ap-form-filtre-pil--aktif' : ''}`}
              onClick={() => setSayfaFiltre(rozet.id)}
            >
              {rozet.etiket}
            </button>
          ))}
        </div>
      )}
      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {widgetlar.length === 0 ? (
          <AdminBosDurum ikon="🧩" baslik="Henüz widget yok" aciklama="Üstten Yeni Widget ile başlayın" />
        ) : listeGorunumu.gruplar.length === 0 ? (
          <AdminBosDurum ikon="🔎" baslik="Sonuç yok" aciklama="Filtreyi veya aramayı temizleyip tekrar deneyin" />
        ) : (
          listeGorunumu.gruplar.map(([grup, liste]) => (
            <div key={grup} className="mb-3">
              <p className="ap-widget-grup-baslik">{grup}</p>
              {liste.map(widgetSatiri)}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

type EditorSekme = 'genel' | 'icerik' | 'gorunum' | 'gelismis' | 'widgetEkleme';

interface WidgetEditorPanelProps {
  form: WidgetFormDegeri;
  seciliWidget: AdminWidget | null;
  yeniMod: boolean;
  editorAnahtar?: string;
  tumWidgetlar?: AdminWidget[];
  sayfalar?: AdminSayfa[];
  onChange: (form: WidgetFormDegeri) => void;
  onOtomatikDoldurChange?: (acik: boolean) => void;
  onTipDegistirIste?: () => void;
}

export function WidgetEditorPanel({
  form,
  seciliWidget,
  yeniMod,
  editorAnahtar,
  tumWidgetlar = [],
  sayfalar = [],
  onChange,
  onOtomatikDoldurChange,
  onTipDegistirIste,
}: WidgetEditorPanelProps) {
  const [sekme, setSekme] = useState<EditorSekme>('icerik');
  const [otomatikDoldur, setOtomatikDoldur] = useState(yeniMod);
  const formYedekRef = useRef<WidgetFormDegeri | null>(null);
  const yedekAnahtarRef = useRef<string | null>(null);
  const widgetAnahtar = editorAnahtar ?? seciliWidget?.id ?? 'yeni';
  const oncekiAnahtarRef = useRef(widgetAnahtar);
  const oncekiTipRef = useRef(form.tip);

  useEffect(() => {
    onOtomatikDoldurChange?.(otomatikDoldur);
  }, [otomatikDoldur, onOtomatikDoldurChange]);

  useEffect(() => {
    setSekme(form.tip === 'BLOK_OLUSTURUCU' ? 'widgetEkleme' : 'icerik');
  }, [widgetAnahtar, form.tip]);

  useEffect(() => {
    if (sekme === 'widgetEkleme' && form.tip !== 'BLOK_OLUSTURUCU') {
      setSekme('genel');
    }
  }, [form.tip, sekme]);

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

  const icSekmeler: { id: EditorSekme; etiket: string }[] = [
    { id: 'genel', etiket: 'Yerleşim' },
    { id: 'icerik', etiket: 'İçerik' },
    { id: 'gorunum', etiket: 'Görünüm' },
    { id: 'gelismis', etiket: 'Ek Ayarlar' },
    ...(form.tip === 'BLOK_OLUSTURUCU' ? [{ id: 'widgetEkleme' as const, etiket: 'Widget Ekleme' }] : []),
  ];

  return (
    <div className="ap-editor-panel ap-form-editor ap-widget-editor">
      <div className="ap-form-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">{yeniMod ? 'Yeni widget' : 'Widget düzenle'}</h2>
          <p className="ap-widget-editor-tip">
            <span>{seciliTipMeta?.etiket ?? tipEtiketi(form.tip)}</span>
            {onTipDegistirIste && (
              <button type="button" className="ap-widget-tip-degistir" onClick={onTipDegistirIste}>
                Tipi değiştir
              </button>
            )}
          </p>
        </div>
        <div className={`ap-form-yayin-anahtar${form.aktif ? ' ap-form-yayin-anahtar--acik' : ''}`}>
          <AdminAnahtarDugme etiket="Aktif" acik={form.aktif} onDegistir={(aktif) => onChange({ ...form, aktif })} />
        </div>
      </div>

      <div className="ap-form-editor-govde">
        <div className="ap-widget-kimlik-satir">
          <FormAlani etiket="Widget adı">
            <input
              className={formInputSinifi}
              value={form.ad}
              onChange={(e) => onChange({ ...form, ad: e.target.value })}
              placeholder={form.baslik.trim() || tipEtiketi(form.tip) || 'Anasayfa Metin Bloğu'}
            />
          </FormAlani>
          <FormAlani etiket={`Sıra — ${sayfaEtiketi}`}>
            <input
              type="number"
              min={1}
              className={formInputSinifi}
              value={form.sira}
              onChange={(e) => onChange({ ...form, sira: Number(e.target.value) })}
              placeholder="1"
            />
          </FormAlani>
        </div>
        {siraCakisma && (
          <div className="ap-sira-uyari" role="alert">
            <strong>Sıra çakışması:</strong> {sayfaEtiketi} sayfasında sıra {form.sira} zaten &quot;{siraCakisma.ad}&quot; ({tipEtiketi(siraCakisma.tip)}) widgetında kullanılıyor.
          </div>
        )}

        <div className="ap-form-ic-piller" role="tablist">
          {icSekmeler.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={sekme === s.id}
              className={`ap-form-ic-pil${sekme === s.id ? ' ap-form-ic-pil--aktif' : ''}`}
              onClick={() => setSekme(s.id)}
            >
              {s.etiket}
            </button>
          ))}
        </div>

        <div className={`ap-form-ic-govde${sekme === 'widgetEkleme' ? ' ap-editor-icerik-ekleme' : ''}`}>
          {sekme === 'genel' && (
            <WidgetYerlesimPanel
              form={form}
              onChange={onChange}
              digerWidgetlar={tumWidgetlar}
              mevcutWidgetId={seciliWidget?.id}
              sayfalar={sayfalar}
            />
          )}

          {sekme === 'icerik' && (
            <>
              <div className="ap-widget-icerik-ust">
                <AdminAnahtarDugme
                  etiket="Örnek içerik"
                  acik={otomatikDoldur}
                  onDegistir={otomatikDoldurDegistir}
                />
              </div>
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
              key={widgetAnahtar}
              form={form}
              onChange={onChange}
              tumWidgetlar={tumWidgetlar}
              onGenelSekmesi={() => setSekme('genel')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
