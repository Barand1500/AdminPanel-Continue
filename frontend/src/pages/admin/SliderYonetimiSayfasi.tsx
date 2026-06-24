import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminModulKabuk,
  AdminPanelKarti,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { KonumluSliderOnizleme } from '@/components/admin/konumluSlider/KonumluSliderOnizleme';
import {
  KonumluSliderAyarlarPaneli,
  konumSecimOzeti,
  sliderListeOzeti,
} from '@/components/admin/konumluSlider/KonumluSliderAyarlarPaneli';
import {
  konumluSliderGuncelle,
  konumluSliderlariGetir,
  konumluSliderOlustur,
  konumluSliderSil,
} from '@/features/admin/konumluSliderApi';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { widgetlariGetir } from '@/features/admin/widgetApi';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';
import {
  anaSayfaWidgetlari,
  sayfaWidgetlari,
  widgetSayfaFiltreOgeleri,
} from '@/utils/widgetYerlesim';
import {
  secimdenHedefWidgetIds,
  type KonumSecimNoktasi,
} from '@/utils/konumluSliderYerlesim';
import {
  KONUMLU_SLIDER_KONUM_ETIKET,
  varsayilanKonumluSliderConfig,
  type KonumluSliderConfig,
  type KonumluSliderKayit,
} from '@/types/konumluSlider';
import type { AdminWidget } from '@/types/admin';
import { idString } from '@/utils/idKarsilastir';

const ANA_SAYFA_ID = '__ana__';

function secimdenConfig(secimler: KonumSecimNoktasi[], onceki: KonumluSliderConfig): KonumluSliderConfig | null {
  if (secimler.length === 0) return null;
  const ilk = secimler[0];
  return {
    ...onceki,
    yerlesim: {
      tip: ilk.tip,
      bolge: ilk.bolge,
      hedefWidgetIds: secimdenHedefWidgetIds(secimler),
    },
    bosluk: ilk.tip === 'widget-ustu' || ilk.tip === 'widget-alti' ? onceki.bosluk ?? 'orta' : undefined,
  };
}

function sliderdanSecim(slider: KonumluSliderKayit): KonumSecimNoktasi[] {
  const cfg = slider.configJson;
  if (!cfg) return [];
  return cfg.yerlesim.hedefWidgetIds.map((widgetId, i) => ({
    tip: cfg.yerlesim.tip,
    bolge: cfg.yerlesim.bolge,
    widgetId,
    widgetSira: i,
  }));
}

export function SliderYonetimiSayfasi() {
  const [sliderlar, setSliderlar] = useState<KonumluSliderKayit[]>([]);
  const [widgetlar, setWidgetlar] = useState<AdminWidget[]>([]);
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [sayfaId, setSayfaId] = useState(ANA_SAYFA_ID);
  const [seciliSliderId, setSeciliSliderId] = useState<string | null>(null);
  const [ad, setAd] = useState('Yeni Slider');
  const [aktif, setAktif] = useState(true);
  const [config, setConfig] = useState<KonumluSliderConfig>(varsayilanKonumluSliderConfig());
  const [secimler, setSecimler] = useState<KonumSecimNoktasi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [secimHata, setSecimHata] = useState('');

  const anaSayfaMi = sayfaId === ANA_SAYFA_ID;

  const sayfaAdlari = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of sayfalar) m.set(idString(s.id), s.baslik);
    return m;
  }, [sayfalar]);

  const sayfaFiltreOgeleri = useMemo(
    () => widgetSayfaFiltreOgeleri(widgetlar, sayfaAdlari),
    [widgetlar, sayfaAdlari]
  );

  const sayfaWidgetlariListe = useMemo(() => {
    const ham = anaSayfaMi
      ? anaSayfaWidgetlari(widgetlar)
      : sayfaWidgetlari(widgetlar, sayfaId);
    return ham.filter((w) => w.aktif);
  }, [widgetlar, sayfaId, anaSayfaMi]);

  const sayfaSliderlari = useMemo(
    () =>
      sliderlar.filter((s) => {
        const sid = s.sayfaId ? idString(s.sayfaId) : '';
        const hedef = anaSayfaMi ? '' : idString(sayfaId);
        return sid === hedef;
      }),
    [sliderlar, sayfaId, anaSayfaMi]
  );

  async function listeYukle() {
    setHata('');
    setYukleniyor(true);
    try {
      const [sListe, wListe, sayfaListesi] = await Promise.all([
        konumluSliderlariGetir(),
        widgetlariGetir(),
        adminSayfalariGetir(),
      ]);
      setSliderlar(sListe);
      setWidgetlar(wListe);
      setSayfalar(sayfaListesi);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Veriler yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void listeYukle();
  }, []);

  const yeniBaslat = useCallback(() => {
    setSeciliSliderId(null);
    setAd('Yeni Slider');
    setAktif(true);
    setConfig(varsayilanKonumluSliderConfig());
    setSecimler([]);
    setSecimHata('');
    setBasari('');
    setHata('');
  }, []);

  useEffect(() => {
    if (seciliSliderId) return;
    setSecimler([]);
  }, [sayfaId, seciliSliderId]);

  function sliderSec(slider: KonumluSliderKayit) {
    setSeciliSliderId(slider.id);
    setAd(slider.ad);
    setAktif(slider.aktif);
    const cfg = slider.configJson ?? varsayilanKonumluSliderConfig();
    setConfig(cfg);
    setSecimler(sliderdanSecim(slider));
    setBasari('');
    setHata('');
    setSecimHata('');
  }

  function secimGuncelle(yeni: KonumSecimNoktasi[]) {
    setSecimHata('');
    const cfg = secimdenConfig(yeni, config);
    if (cfg) setConfig(cfg);
    setSecimler(yeni);
  }

  async function kaydet() {
    setHata('');
    setBasari('');
    if (secimler.length === 0) {
      setHata('Önizlemeden bir yerleşim noktası seçin.');
      return;
    }
    if (!config.slaytlar.some((s) => s.aktif && s.gorselUrl)) {
      setHata('En az bir aktif slayt görseli gerekli.');
      return;
    }
    if (!ad.trim()) {
      setHata('Slider adı gerekli.');
      return;
    }

    setKaydediliyor(true);
    try {
      const form = {
        ad: ad.trim(),
        sayfaId: anaSayfaMi ? '' : sayfaId,
        aktif,
        sira: seciliSliderId
          ? (sliderlar.find((s) => s.id === seciliSliderId)?.sira ?? 1)
          : sayfaSliderlari.length + 1,
        configJson: config,
      };

      if (seciliSliderId) {
        const guncel = await konumluSliderGuncelle(seciliSliderId, form);
        setSliderlar((liste) => liste.map((s) => (s.id === guncel.id ? guncel : s)));
        setBasari('Slider güncellendi.');
      } else {
        const yeni = await konumluSliderOlustur(form);
        setSliderlar((liste) => [...liste, yeni]);
        setSeciliSliderId(yeni.id);
        setBasari('Slider oluşturuldu.');
      }
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(id: string) {
    if (!window.confirm('Bu slider silinsin mi?')) return;
    setKaydediliyor(true);
    try {
      await konumluSliderSil(id);
      setSliderlar((liste) => liste.filter((s) => s.id !== id));
      if (seciliSliderId === id) yeniBaslat();
      setBasari('Slider silindi.');
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  if (yukleniyor) {
    return (
      <AdminModulKabuk
        baslik="Slider Yönetimi"
        aciklama="Sayfa üzerinde konumlandırılmış sliderlar oluşturun ve yönetin."
      >
        <YukleniyorDurumu />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      baslik="Slider Yönetimi"
      aciklama="Önizlemede hedef bölgeyi seçin; yan yerleşimde bitişik widgetları birlikte işaretleyebilirsiniz."
      ustAksiyon={
        <button type="button" className="ks-admin-btn ks-admin-btn--ghost" onClick={yeniBaslat}>
          + Yeni slider
        </button>
      }
    >
      {hata && <div className="mb-4"><BildirimKutusu tur="hata" mesaj={hata} /></div>}
      {basari && <div className="mb-4"><BildirimKutusu tur="basari" mesaj={basari} /></div>}

      <div className="ks-yonetim-grid">
        <aside className="ks-yonetim-sol">
          <AdminPanelKarti baslik="Sayfa" altBaslik="Slider hangi sayfada görünsün?">
            <select
              className="ks-admin-select"
              value={sayfaId}
              onChange={(e) => {
                setSayfaId(e.target.value);
                if (!seciliSliderId) yeniBaslat();
              }}
            >
              {sayfaFiltreOgeleri.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.etiket}
                </option>
              ))}
            </select>
          </AdminPanelKarti>

          <AdminPanelKarti
            baslik="Mevcut sliderlar"
            altBaslik={`${sayfaSliderlari.length} kayıt`}
            ustAksiyon={
              <button type="button" className="ks-admin-btn ks-admin-btn--mini" onClick={yeniBaslat}>
                Yeni
              </button>
            }
          >
            <div className="ks-slider-liste">
              {sayfaSliderlari.length === 0 && (
                <p className="text-sm text-[var(--ap-muted)]">Bu sayfada slider yok.</p>
              )}
              {sayfaSliderlari.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ks-slider-liste-oge ${seciliSliderId === s.id ? 'ks-slider-liste-oge--aktif' : ''}`}
                  onClick={() => sliderSec(s)}
                >
                  <span className="ks-slider-liste-ad">{s.ad}</span>
                  <span className="ks-slider-liste-alt">{sliderListeOzeti(s)}</span>
                  {!s.aktif && <span className="ks-slider-liste-pasif">Pasif</span>}
                </button>
              ))}
            </div>
          </AdminPanelKarti>
        </aside>

        <section className="ks-yonetim-orta">
          <AdminPanelKarti baslik="Konum seçimi" altBaslik="Tıklayarak hedef belirleyin">
            <KonumluSliderOnizleme
              widgetlar={sayfaWidgetlariListe}
              anaSayfaMi={anaSayfaMi}
              secimler={secimler}
              onSecimDegisti={secimGuncelle}
              hata={secimHata}
            />
          </AdminPanelKarti>
        </section>

        <aside className="ks-yonetim-sag">
          <AdminPanelKarti baslik="Slider ayarları">
            <div className="space-y-4">
              <label className="ks-admin-alan">
                <span>Ad</span>
                <input
                  className="ks-admin-input"
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Örn: Karşılaştırma yanı banner"
                />
              </label>

              <label className="ks-admin-switch">
                <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} />
                <span>Yayında</span>
              </label>

              {secimler.length > 0 && (
                <div className="ks-admin-secim-kutu">
                  <span className="text-xs text-[var(--ap-muted)]">Seçilen konum</span>
                  <p className="text-sm font-medium">{konumSecimOzeti(config)}</p>
                  <p className="text-xs text-[var(--ap-muted)]">
                    {KONUMLU_SLIDER_KONUM_ETIKET[config.yerlesim.tip]}
                  </p>
                </div>
              )}

              <KonumluSliderAyarlarPaneli config={config} onChange={setConfig} />

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  className="ks-admin-btn ks-admin-btn--birincil"
                  disabled={kaydediliyor}
                  onClick={() => void kaydet()}
                >
                  {kaydediliyor ? 'Kaydediliyor…' : seciliSliderId ? 'Güncelle' : 'Oluştur'}
                </button>
                {seciliSliderId && (
                  <button
                    type="button"
                    className="ks-admin-btn ks-admin-btn--tehlike"
                    disabled={kaydediliyor}
                    onClick={() => void sil(seciliSliderId)}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          </AdminPanelKarti>
        </aside>
      </div>
    </AdminModulKabuk>
  );
}
