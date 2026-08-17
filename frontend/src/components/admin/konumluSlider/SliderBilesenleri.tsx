import { useMemo, useState } from 'react';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { KonumluSliderOnizleme } from '@/components/admin/konumluSlider/KonumluSliderOnizleme';
import {
  SliderGorunumAyarlari,
  SliderSlaytListesi,
  konumSecimOzeti,
} from '@/components/admin/konumluSlider/KonumluSliderAyarlarPaneli';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
  AdminSekmeler,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import {
  KONUMLU_SLIDER_KONUM_ETIKET,
  type KonumluSliderConfig,
  type KonumluSliderKayit,
} from '@/types/konumluSlider';
import type { Widget } from '@/types/site';
import type { KonumSecimNoktasi } from '@/utils/konumluSliderYerlesim';
import { idString } from '@/utils/idKarsilastir';

export const ANA_SAYFA_ID = '__ana__';

type EditorSekme = 'slaytlar' | 'konum' | 'gorunum';

export function sayfaEtiketi(sayfaId: string | null | undefined, sayfaAdlari: Map<string, string>) {
  if (!sayfaId) return 'Ana Sayfa';
  return sayfaAdlari.get(idString(sayfaId)) ?? 'Sayfa';
}

export function SliderListesiPanel({
  sliderlar,
  sayfaAdlari,
  seciliId,
  onSec,
}: {
  sliderlar: KonumluSliderKayit[];
  sayfaAdlari: Map<string, string>;
  seciliId: string | null;
  onSec: (slider: KonumluSliderKayit) => void;
}) {
  const [arama, setArama] = useState('');
  const [sayfaFiltre, setSayfaFiltre] = useState('hepsi');

  const sayfaFiltreleri = useMemo(() => {
    const gorulen = new Map<string, string>();
    gorulen.set(ANA_SAYFA_ID, 'Ana Sayfa');
    for (const s of sliderlar) {
      const id = s.sayfaId ? idString(s.sayfaId) : ANA_SAYFA_ID;
      gorulen.set(id, sayfaEtiketi(s.sayfaId, sayfaAdlari));
    }
    return [{ id: 'hepsi', etiket: 'Tümü' }, ...[...gorulen.entries()].map(([id, etiket]) => ({ id, etiket }))];
  }, [sliderlar, sayfaAdlari]);

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    return sliderlar.filter((s) => {
      const sid = s.sayfaId ? idString(s.sayfaId) : ANA_SAYFA_ID;
      if (sayfaFiltre !== 'hepsi' && sid !== sayfaFiltre) return false;
      if (!q) return true;
      const konum = s.configJson ? konumSecimOzeti(s.configJson) : '';
      return `${s.ad} ${sayfaEtiketi(s.sayfaId, sayfaAdlari)} ${konum}`.toLowerCase().includes(q);
    });
  }, [sliderlar, arama, sayfaFiltre, sayfaAdlari]);

  const gruplar = useMemo(() => {
    const map = new Map<string, KonumluSliderKayit[]>();
    for (const s of filtreli) {
      const key = s.sayfaId ? idString(s.sayfaId) : ANA_SAYFA_ID;
      const liste = map.get(key) ?? [];
      liste.push(s);
      map.set(key, liste);
    }
    return [...map.entries()].map(([id, ogeler]) => ({
      id,
      etiket: sayfaEtiketi(id === ANA_SAYFA_ID ? null : id, sayfaAdlari),
      ogeler,
    }));
  }, [filtreli, sayfaAdlari]);

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Banner Listesi</h2>
          <p className="ap-muted text-xs">{sliderlar.length} kayıt</p>
        </div>
      </div>
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Ad veya konum ara..." />
      <div className="ap-slider-filtre">
        {sayfaFiltreleri.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`ap-slider-filtre-oge${sayfaFiltre === f.id ? ' ap-slider-filtre-oge--aktif' : ''}`}
            onClick={() => setSayfaFiltre(f.id)}
          >
            {f.etiket}
          </button>
        ))}
      </div>
      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {filtreli.length === 0 ? (
          <AdminBosDurum
            ikon="🎠"
            baslik={arama || sayfaFiltre !== 'hepsi' ? 'Sonuç yok' : 'Henüz banner yok'}
            aciklama={
              arama || sayfaFiltre !== 'hepsi'
                ? 'Filtreyi temizleyip tekrar deneyin'
                : 'Üstten Yeni Banner sekmesine geçerek başlayın'
            }
          />
        ) : (
          gruplar.map((grup) => (
            <div key={grup.id} className="ap-slider-grup">
              <p className="ap-slider-grup-baslik">{grup.etiket}</p>
              {grup.ogeler.map((s) => {
                const cfg = s.configJson;
                const kapak = cfg?.slaytlar.find((x) => x.aktif && x.gorselUrl)?.gorselUrl;
                const slaytSayisi = cfg?.slaytlar.filter((x) => x.aktif).length ?? 0;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`ap-liste-oge ap-slider-liste-oge${seciliId === s.id ? ' ap-liste-oge-secili' : ''}`}
                    onClick={() => onSec(s)}
                  >
                    {kapak ? (
                      <img src={medyaTamUrl(kapak)} alt="" className="ap-slider-liste-kapak" />
                    ) : (
                      <span className="ap-slider-liste-kapak ap-slider-liste-kapak--bos" aria-hidden>
                        🎠
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="ap-liste-oge-baslik">{s.ad}</span>
                      <span className="ap-liste-oge-alt">
                        {cfg ? konumSecimOzeti(cfg) : 'Konum seçilmedi'} · {slaytSayisi} slayt
                      </span>
                      <span className="ap-liste-oge-etiketler mt-1.5">
                        {s.aktif ? (
                          <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                        ) : (
                          <AdminDurumEtiketi tur="pasif">Pasif</AdminDurumEtiketi>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export function SliderEditorPanel({
  ad,
  aktif,
  sayfaId,
  config,
  secimler,
  sayfalar,
  widgetlar,
  anaSayfaMi,
  secimHata,
  onAd,
  onAktif,
  onSayfaId,
  onConfig,
  onSecimler,
}: {
  ad: string;
  aktif: boolean;
  sayfaId: string;
  config: KonumluSliderConfig;
  secimler: KonumSecimNoktasi[];
  sayfalar: AdminSayfa[];
  widgetlar: Widget[];
  anaSayfaMi: boolean;
  secimHata?: string;
  onAd: (v: string) => void;
  onAktif: (v: boolean) => void;
  onSayfaId: (v: string) => void;
  onConfig: (v: KonumluSliderConfig) => void;
  onSecimler: (v: KonumSecimNoktasi[]) => void;
}) {
  const [sekme, setSekme] = useState<EditorSekme>('slaytlar');

  return (
    <div className="ap-editor-panel ap-slider-editor">
      <div className="ap-slider-editor-ust">
        <FormAlani etiket="Banner adı">
          <input
            className={formInputSinifi}
            value={ad}
            onChange={(e) => onAd(e.target.value)}
            placeholder="Örn. Kampanya banner"
          />
        </FormAlani>
        <AdminAnahtarDugme acik={aktif} onDegistir={onAktif} etiket="Yayında" />
      </div>

      <AdminSekmeler
        aktif={sekme}
        onDegistir={setSekme}
        sekmeler={[
          { id: 'slaytlar', etiket: 'Slaytlar', ikon: '🖼️' },
          { id: 'konum', etiket: 'Konum', ikon: '📍' },
          { id: 'gorunum', etiket: 'Görünüm', ikon: '🎛️' },
        ]}
      />

      <div className="ap-editor-icerik">
        {sekme === 'slaytlar' && (
          <AdminFormBolumu
            baslik="Görseller"
            aciklama="Bannerda sırayla gösterilecek slaytları ekleyin. En az bir aktif görsel gerekir."
          >
            <SliderSlaytListesi config={config} onChange={onConfig} />
          </AdminFormBolumu>
        )}

        {sekme === 'konum' && (
          <AdminFormBolumu
            baslik="Nerede görünsün?"
            aciklama="Önce sayfayı seçin, sonra önizlemede Sol / Sağ / Üst / Alt bölgelerine tıklayın."
          >
            <FormAlani etiket="Sayfa">
              <select className={formSelectSinifi} value={sayfaId} onChange={(e) => onSayfaId(e.target.value)}>
                <option value={ANA_SAYFA_ID}>Ana Sayfa</option>
                {sayfalar.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.baslik}
                  </option>
                ))}
              </select>
            </FormAlani>

            {secimler.length > 0 && (
              <p className="ap-slider-konum-ozet">
                Seçilen: {KONUMLU_SLIDER_KONUM_ETIKET[config.yerlesim.tip]}
                {config.yerlesim.hedefWidgetIds.length > 0
                  ? ` · ${config.yerlesim.hedefWidgetIds.length} hedef`
                  : ''}
              </p>
            )}

            <KonumluSliderOnizleme
              widgetlar={widgetlar}
              anaSayfaMi={anaSayfaMi}
              secimler={secimler}
              onSecimDegisti={onSecimler}
              hata={secimHata}
            />
          </AdminFormBolumu>
        )}

        {sekme === 'gorunum' && (
          <AdminFormBolumu
            baslik="Görünüm"
            aciklama="Yön, boşluk ve slayt çerçevesi. İçerik ve konumdan bağımsızdır."
          >
            <SliderGorunumAyarlari config={config} onChange={onConfig} />
          </AdminFormBolumu>
        )}
      </div>
    </div>
  );
}
