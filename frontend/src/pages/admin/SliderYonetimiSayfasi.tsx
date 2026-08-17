import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  ANA_SAYFA_ID,
  SliderEditorPanel,
  SliderListesiPanel,
} from '@/components/admin/konumluSlider/SliderBilesenleri';
import { SliderOnizlemeModal } from '@/components/admin/konumluSlider/SliderOnizlemeModal';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  konumluSliderGuncelle,
  konumluSliderlariGetir,
  konumluSliderOlustur,
  konumluSliderSil,
} from '@/features/admin/konumluSliderApi';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { widgetlariGetir } from '@/features/admin/widgetApi';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';
import { anaSayfaWidgetlari, sayfaWidgetlari } from '@/utils/widgetYerlesim';
import {
  secimdenHedefWidgetIdsSirali,
  type KonumSecimNoktasi,
} from '@/utils/konumluSliderYerlesim';
import {
  varsayilanKonumluSliderConfig,
  type KonumluSliderConfig,
  type KonumluSliderKayit,
} from '@/types/konumluSlider';
import type { AdminWidget } from '@/types/admin';
import type { Widget } from '@/types/site';
import { idString } from '@/utils/idKarsilastir';

type Gorunum = 'liste' | 'editor';

function ListeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function YeniIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DuzenlemeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function secimdenConfig(
  secimler: KonumSecimNoktasi[],
  onceki: KonumluSliderConfig,
  widgetlar: Widget[]
): KonumluSliderConfig | null {
  if (secimler.length === 0) return null;
  const ilk = secimler[0];
  return {
    ...onceki,
    yerlesim: {
      tip: ilk.tip,
      bolge: ilk.bolge,
      hedefWidgetIds: secimdenHedefWidgetIdsSirali(secimler, widgetlar),
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
  const [ad, setAd] = useState('');
  const [aktif, setAktif] = useState(true);
  const [config, setConfig] = useState<KonumluSliderConfig>(varsayilanKonumluSliderConfig());
  const [secimler, setSecimler] = useState<KonumSecimNoktasi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [secimHata, setSecimHata] = useState('');
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

  const anaSayfaMi = sayfaId === ANA_SAYFA_ID;

  const sayfaAdlari = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of sayfalar) m.set(idString(s.id), s.baslik);
    return m;
  }, [sayfalar]);

  const sayfaWidgetlariListe = useMemo(() => {
    const ham = anaSayfaMi ? anaSayfaWidgetlari(widgetlar) : sayfaWidgetlari(widgetlar, sayfaId);
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

  const formuSifirla = useCallback(() => {
    setSeciliSliderId(null);
    setAd('');
    setAktif(true);
    setConfig(varsayilanKonumluSliderConfig());
    setSecimler([]);
    setSecimHata('');
    setBasari('');
    setHata('');
  }, []);

  const yeniBaslat = useCallback(() => {
    formuSifirla();
    setGorunum('editor');
  }, [formuSifirla]);

  function sliderSec(slider: KonumluSliderKayit) {
    setSeciliSliderId(slider.id);
    setAd(slider.ad);
    setAktif(slider.aktif);
    const cfg = slider.configJson ?? varsayilanKonumluSliderConfig();
    setConfig(cfg);
    setSayfaId(slider.sayfaId ? idString(slider.sayfaId) : ANA_SAYFA_ID);
    setSecimler(sliderdanSecim(slider));
    setBasari('');
    setHata('');
    setSecimHata('');
  }

  const duzenlemeyeGit = useCallback(() => {
    if (!seciliSliderId) return;
    setGorunum('editor');
  }, [seciliSliderId]);

  function sayfaDegistir(yeniId: string) {
    setSayfaId(yeniId);
    setSecimler([]);
    setSecimHata('');
    setConfig((onceki) => ({
      ...onceki,
      yerlesim: { ...onceki.yerlesim, hedefWidgetIds: [] },
    }));
  }

  function secimGuncelle(yeni: KonumSecimNoktasi[]) {
    setSecimHata('');
    const cfg = secimdenConfig(yeni, config, sayfaWidgetlariListe);
    if (cfg) setConfig(cfg);
    setSecimler(yeni);
  }

  const kaydet = useCallback(async () => {
    setHata('');
    setBasari('');
    if (!ad.trim()) {
      setHata('Banner adı gerekli.');
      return;
    }
    if (secimler.length === 0) {
      setHata('Konum sekmesinden bannerın duracağı yeri seçin.');
      return;
    }
    if (!config.slaytlar.some((s) => s.aktif && s.gorselUrl)) {
      setHata('Slaytlar sekmesine en az bir aktif görsel ekleyin.');
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
        setBasari('Banner güncellendi.');
      } else {
        const yeni = await konumluSliderOlustur(form);
        setSliderlar((liste) => [...liste, yeni]);
        setSeciliSliderId(yeni.id);
        setBasari('Banner oluşturuldu.');
      }
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [ad, secimler, config, anaSayfaMi, sayfaId, aktif, seciliSliderId, sliderlar, sayfaSliderlari.length]);

  const sil = useCallback(async () => {
    if (!seciliSliderId || !window.confirm('Bu banner silinsin mi?')) return;
    setKaydediliyor(true);
    setHata('');
    try {
      await konumluSliderSil(seciliSliderId);
      setSliderlar((liste) => liste.filter((s) => s.id !== seciliSliderId));
      setBasari('Banner silindi.');
      formuSifirla();
      setGorunum('liste');
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliSliderId, formuSifirla]);

  const onizle = useCallback(() => setOnizlemeAcik(true), []);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      sil,
      duzenle: duzenlemeyeGit,
      onizle,
    },
    {
      kaydet: gorunum === 'editor' && !kaydediliyor && Boolean(ad.trim()),
      ekle: true,
      sil: !!seciliSliderId && !kaydediliyor,
      duzenle: !!seciliSliderId && gorunum === 'liste' && !kaydediliyor,
      onizle: gorunum === 'editor' || !!seciliSliderId,
    }
  );

  function gorunumDegistir(id: Gorunum) {
    if (id === gorunum) return;
    if (id === 'liste') {
      setGorunum('liste');
      return;
    }
    yeniBaslat();
  }

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Bannerlar yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Banner Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: gorunum === 'editor' && seciliSliderId ? 'Düzenleme' : 'Yeni Banner',
              ikon: gorunum === 'editor' && seciliSliderId ? <DuzenlemeIkon /> : <YeniIkon />,
            },
          ]}
          aktif={gorunum}
          onDegistir={gorunumDegistir}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}

      {gorunum === 'liste' ? (
        <SliderListesiPanel
          sliderlar={sliderlar}
          sayfaAdlari={sayfaAdlari}
          seciliId={seciliSliderId}
          onSec={sliderSec}
        />
      ) : (
        <SliderEditorPanel
          key={seciliSliderId ?? 'yeni'}
          ad={ad}
          aktif={aktif}
          sayfaId={sayfaId}
          config={config}
          secimler={secimler}
          sayfalar={sayfalar}
          widgetlar={sayfaWidgetlariListe}
          anaSayfaMi={anaSayfaMi}
          secimHata={secimHata}
          onAd={setAd}
          onAktif={setAktif}
          onSayfaId={sayfaDegistir}
          onConfig={setConfig}
          onSecimler={secimGuncelle}
        />
      )}

      <SliderOnizlemeModal
        acik={onizlemeAcik}
        ad={ad}
        config={config}
        onKapat={() => setOnizlemeAcik(false)}
      />
    </AdminModulKabuk>
  );
}
