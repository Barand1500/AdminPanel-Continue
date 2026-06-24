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
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import { sonrakiWidgetSira, siraCakismasiBul } from '@/utils/widgetSiraYardimci';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';
import { widgetFormNormalize } from '@/utils/widgetFormYardimci';
import { configOku } from '@/types/widget';
import { olusturucuOku } from '@/types/blokOlusturucu';
import { olusturucuDoluMu } from '@/components/admin/widget/olusturucu/blokOlusturucuYardimci';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';

const YENI_WIDGET_TIPI = 'BLOK_OLUSTURUCU';

function varsayilanYeniTip(filtre?: string) {
  return filtre ?? YENI_WIDGET_TIPI;
}

function kaydetHazirMi(form: WidgetFormDegeri) {
  return Boolean(
    form.tip &&
    (form.ad.trim() || form.baslik.trim() || tipEtiketi(form.tip))
  );
}

function hizliKaydetHazirMi(form: WidgetFormDegeri) {
  if (form.tip !== 'BLOK_OLUSTURUCU') return false;
  const cfg = configOku(form);
  return kaydetHazirMi(form) && olusturucuDoluMu(olusturucuOku(cfg));
}

interface WidgetYonetimiSayfasiProps {
  varsayilanTip?: string;
}

export function WidgetYonetimiSayfasi({ varsayilanTip }: WidgetYonetimiSayfasiProps) {
  const [widgetlar, setWidgetlar] = useState<AdminWidget[]>([]);
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [form, setForm] = useState<WidgetFormDegeri>(varsayilanWidgetForm(varsayilanYeniTip(varsayilanTip)));
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);
  const [onizlemeHazir, setOnizlemeHazir] = useState(false);
  const [otomatikDoldur, setOtomatikDoldur] = useState(false);
  const kaydetFnRef = useRef<(() => Promise<void>) | null>(null);
  const [siraDuzListe, setSiraDuzListe] = useState<Record<string, boolean>>({});
  const [yeniTaslakSayac, setYeniTaslakSayac] = useState(0);

  const yeniMod = seciliId === null;
  const editorAnahtar = seciliId ?? `yeni-${yeniTaslakSayac}`;

  async function listeYukle() {
    setHata('');
    setYukleniyor(true);
    try {
      const [liste, sayfaListesi] = await Promise.all([
        widgetlariGetir(varsayilanTip),
        adminSayfalariGetir(),
      ]);
      setWidgetlar(liste);
      setSayfalar(sayfaListesi);
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
      const sonraki = sonrakiWidgetSira(widgetlar, onceki.sayfaId);
      const cakisma = siraCakismasiBul(widgetlar, onceki.sira, onceki.sayfaId);
      const varsayilanCakisma =
        sonraki > 1 && onceki.sira === 1;
      if (!cakisma && !varsayilanCakisma) return onceki;
      return onceki.sira === sonraki ? onceki : { ...onceki, sira: sonraki };
    });
  }, [widgetlar, seciliId, form.sayfaId]);

  useEffect(() => {
    setOnizlemeHazir(Boolean(form.tip && (seciliId || yeniMod)));
  }, [form.tip, seciliId, yeniMod]);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setYeniTaslakSayac((n) => n + 1);
    setForm(varsayilanWidgetForm(varsayilanYeniTip(varsayilanTip), widgetlar));
    setBasari('Yeni widget taslağı — Kaydet ile listeye eklenir.');
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
      setForm(varsayilanWidgetForm(varsayilanYeniTip(varsayilanTip), kalan));
      setBasari('Widget silindi.');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, varsayilanTip]);

  const hizliKaydetFooter = useCallback(async () => {
    setHata('');
    try {
      await kaydet(form, yeniMod ? undefined : seciliId ?? undefined, { hizli: true });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Hızlı kayıt başarısız');
    }
  }, [form, seciliId, yeniMod, widgetlar]);

  useModulAksiyonlari(
    {
      kaydet: kaydetFooter,
      hizliKaydet: hizliKaydetFooter,
      ekle: yeniBaslat,
      sil: silHandler,
      onizle: () => setOnizlemeAcik(true),
    },
    {
      kaydet: !kaydediliyor && kaydetHazirMi(form),
      hizliKaydet: !kaydediliyor && hizliKaydetHazirMi(form),
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
      onizle: onizlemeHazir && !kaydediliyor,
    }
  );

  const seciliWidget = useMemo(
    () => widgetlar.find((w) => w.id === seciliId) ?? null,
    [widgetlar, seciliId]
  );

  async function kaydet(deger: WidgetFormDegeri, widgetId?: string, opts?: { hizli?: boolean }) {
    deger = widgetFormNormalize(deger);
    const ad = deger.ad.trim() || deger.baslik.trim() || tipEtiketi(deger.tip);
    if (!ad) {
      setHata('Widget adı veya içerik başlığı gerekli');
      throw new Error('Widget adı veya içerik başlığı gerekli');
    }
    let kayitDegeri = deger.ad.trim() ? deger : { ...deger, ad };
    if (deger.tip === 'BLOK_OLUSTURUCU' && opts?.hizli) {
      kayitDegeri = { ...kayitDegeri, aktif: true };
    }
    setKaydediliyor(true);
    setHata('');
    try {
      if (widgetId) {
        const guncel = await widgetGuncelle(widgetId, kayitDegeri);
        setWidgetlar((onceki) => onceki.map((w) => (w.id === guncel.id ? guncel : w)));
        setForm(widgettenForma(guncel));
        setBasari(opts?.hizli ? 'Widget siteye eklendi.' : 'Widget güncellendi.');
      } else {
        const yeni = await widgetOlustur(kayitDegeri);
        setWidgetlar((onceki) => [yeni, ...onceki]);
        setSeciliId(yeni.id);
        setForm(widgettenForma(yeni));
        setBasari(
          opts?.hizli
            ? 'Widget siteye eklendi.'
            : yeni.aktif
              ? 'Yeni widget oluşturuldu (aktif).'
              : 'Yeni widget oluşturuldu (pasif).'
        );
      }
      siteVerisiGuncellendiYayinla();
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

  function sayfaSiraToggle(sayfaFiltreId: string) {
    setSiraDuzListe((onceki) => ({
      ...onceki,
      [sayfaFiltreId]: !onceki[sayfaFiltreId],
    }));
  }

  const baslik = varsayilanTip === 'SLIDER'
    ? 'Slider Yönetimi'
    : varsayilanTip === 'HIZMET_KARTLARI'
      ? 'Hizmet Widgetları'
      : 'Widget Yönetimi';

  const aciklama = varsayilanTip
    ? `${baslik} — anasayfa bileşenlerini düzenleyin`
    : 'Anasayfa ve tüm sayfalardaki widget bileşenlerini yönetin';

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
              sayfalar={sayfalar}
              siraDuzListe={siraDuzListe}
              onSayfaSiraToggle={sayfaSiraToggle}
              onSec={widgetSec}
            />
            <WidgetEditorPanel
              form={form}
              seciliWidget={seciliWidget}
              yeniMod={yeniMod}
              editorAnahtar={editorAnahtar}
              kaydediliyor={kaydediliyor}
              hata={hata}
              varsayilanTip={varsayilanTip}
              tumWidgetlar={widgetlar}
              sayfalar={sayfalar}
              onChange={(yeni) => setForm(widgetFormNormalize(yeni))}
              onKaydet={kaydet}
              onKaydetTetikleyici={onKaydetTetikleyici}
              onTipSecildi={() => setOnizlemeHazir(true)}
              onOtomatikDoldurChange={setOtomatikDoldur}
            />
          </div>
        </>
      )}

      <WidgetOnizlemeModal
        acik={onizlemeAcik}
        form={form}
        otomatikDoldur={otomatikDoldur}
        onKapat={() => setOnizlemeAcik(false)}
      />
    </AdminModulKabuk>
  );
}
