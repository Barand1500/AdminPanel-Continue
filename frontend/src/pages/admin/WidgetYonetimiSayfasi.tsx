import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  varsayilanWidgetForm,
  WidgetEditorPanel,
  WidgetListesiPanel,
  widgettenForma,
} from '@/components/admin/widget/WidgetBilesenleri';
import { WidgetOnizlemeModal } from '@/components/admin/widget/WidgetOnizlemeModal';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { widgetGuncelle, widgetOlustur, widgetSil, widgetlariGetir } from '@/features/admin/widgetApi';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import { sonrakiWidgetSira, siraCakismasiBul } from '@/utils/widgetSiraYardimci';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';

function kaydetHazirMi(form: WidgetFormDegeri) {
  return Boolean(
    form.tip &&
    (form.ad.trim() || form.baslik.trim() || tipEtiketi(form.tip))
  );
}

interface WidgetYonetimiSayfasiProps {
  varsayilanTip?: string;
}

export function WidgetYonetimiSayfasi({ varsayilanTip }: WidgetYonetimiSayfasiProps) {
  const [widgetlar, setWidgetlar] = useState<AdminWidget[]>([]);
  const [form, setForm] = useState<WidgetFormDegeri>(varsayilanWidgetForm(varsayilanTip ?? 'SLIDER'));
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);
  const [onizlemeHazir, setOnizlemeHazir] = useState(false);
  const kaydetFnRef = useRef<(() => Promise<void>) | null>(null);

  const yeniMod = seciliId === null;

  async function listeYukle() {
    setHata('');
    setYukleniyor(true);
    try {
      const liste = await widgetlariGetir(varsayilanTip);
      setWidgetlar(liste);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Widget listesi alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void listeYukle();
  }, [varsayilanTip]);

  useEffect(() => {
    if (seciliId != null) return;
    setForm((onceki) => {
      const sonraki = sonrakiWidgetSira(widgetlar);
      const cakisma = siraCakismasiBul(widgetlar, onceki.sira);
      const varsayilanCakisma =
        widgetlar.length > 0 && onceki.sira === 1 && sonraki > 1;
      if (!cakisma && !varsayilanCakisma) return onceki;
      return onceki.sira === sonraki ? onceki : { ...onceki, sira: sonraki };
    });
  }, [widgetlar, seciliId]);

  useEffect(() => {
    setOnizlemeHazir(Boolean(form.tip && (seciliId || yeniMod)));
  }, [form.tip, seciliId, yeniMod]);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(varsayilanWidgetForm(varsayilanTip ?? 'SLIDER', widgetlar));
    setBasari('');
    setHata('');
    setOnizlemeHazir(true);
  }, [varsayilanTip, widgetlar]);

  const onKaydetTetikleyici = useCallback((fn: () => Promise<void>) => {
    kaydetFnRef.current = fn;
  }, []);

  const kaydetFooter = useCallback(async () => {
    setHata('');
    try {
      await kaydetFnRef.current?.();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    }
  }, []);

  const silHandler = useCallback(async () => {
    if (!seciliId || !confirm('Bu widgetı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    setHata('');
    try {
      await widgetSil(seciliId);
      const kalan = widgetlar.filter((w) => w.id !== seciliId);
      setWidgetlar(kalan);
      setSeciliId(null);
      setForm(varsayilanWidgetForm(varsayilanTip ?? 'SLIDER', kalan));
      setBasari('Widget silindi.');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, varsayilanTip]);

  useModulAksiyonlari(
    {
      kaydet: kaydetFooter,
      ekle: yeniBaslat,
      sil: silHandler,
      onizle: () => setOnizlemeAcik(true),
    },
    {
      kaydet: !kaydediliyor && kaydetHazirMi(form),
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
      onizle: onizlemeHazir && !kaydediliyor,
    }
  );

  const seciliWidget = useMemo(
    () => widgetlar.find((w) => w.id === seciliId) ?? null,
    [widgetlar, seciliId]
  );

  async function kaydet(deger: WidgetFormDegeri, widgetId?: string) {
    const ad = deger.ad.trim() || deger.baslik.trim() || tipEtiketi(deger.tip);
    if (!ad) {
      setHata('Widget adı veya içerik başlığı gerekli');
      throw new Error('Widget adı veya içerik başlığı gerekli');
    }
    const kayitDegeri = deger.ad.trim() ? deger : { ...deger, ad };
    setKaydediliyor(true);
    setHata('');
    try {
      if (widgetId) {
        const guncel = await widgetGuncelle(widgetId, kayitDegeri);
        setWidgetlar((onceki) => onceki.map((w) => (w.id === guncel.id ? guncel : w)));
        setBasari('Widget güncellendi.');
      } else {
        const yeni = await widgetOlustur(kayitDegeri);
        setWidgetlar((onceki) => [yeni, ...onceki]);
        setSeciliId(yeni.id);
        setForm(widgettenForma(yeni));
        setBasari('Yeni widget oluşturuldu.');
      }
    } finally {
      setKaydediliyor(false);
    }
  }

  function widgetSec(widget: AdminWidget) {
    setSeciliId(widget.id);
    setForm(widgettenForma(widget));
    setBasari('');
    setHata('');
    setOnizlemeHazir(true);
  }

  const baslik = varsayilanTip === 'SLIDER'
    ? 'Slider Yönetimi'
    : varsayilanTip === 'HIZMET_KARTLARI'
      ? 'Hizmet Widgetları'
      : 'Widget Yönetimi';

  const aciklama = varsayilanTip
    ? `${baslik} — anasayfa bileşenlerini düzenleyin`
    : 'Anasayfa ve site bölümlerini oluşturan widget bileşenlerini yönetin';

  return (
    <AdminModulKabuk baslik={baslik} aciklama={aciklama}>
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Widgetlar yükleniyor..." />
      ) : (
        <>
          <div className="ap-split-layout">
            <WidgetListesiPanel
              widgetlar={widgetlar}
              seciliId={seciliId}
              tipFiltre={varsayilanTip}
              onSec={widgetSec}
            />
            <WidgetEditorPanel
              form={form}
              seciliWidget={seciliWidget}
              yeniMod={yeniMod}
              kaydediliyor={kaydediliyor}
              hata={hata}
              varsayilanTip={varsayilanTip}
              tumWidgetlar={widgetlar}
              onChange={setForm}
              onKaydet={kaydet}
              onKaydetTetikleyici={onKaydetTetikleyici}
              onTipSecildi={() => setOnizlemeHazir(true)}
            />
          </div>
        </>
      )}

      <WidgetOnizlemeModal acik={onizlemeAcik} form={form} onKapat={() => setOnizlemeAcik(false)} />
    </AdminModulKabuk>
  );
}
