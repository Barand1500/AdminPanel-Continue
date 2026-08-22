import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  varsayilanWidgetForm,
  WidgetEditorPanel,
  WidgetListesiPanel,
  widgettenForma,
} from '@/components/admin/widget/WidgetBilesenleri';
import { WidgetTipGaleri } from '@/components/admin/widget/WidgetTipGaleri';
import { WidgetOnizlemeModal } from '@/components/admin/widget/WidgetOnizlemeModal';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminPilSekme } from '@/components/admin/ortak/AdminFormBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { widgetGuncelle, widgetOlustur, widgetSil, widgetlariGetir } from '@/features/admin/widgetApi';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import { sonrakiWidgetSira, siraCakismasiBul } from '@/utils/widgetSiraYardimci';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';
import { widgetFormNormalize } from '@/utils/widgetFormYardimci';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';

const YENI_WIDGET_TIPI = 'BLOK_OLUSTURUCU';

type Gorunum = 'liste' | 'editor';

function varsayilanYeniTip(filtre?: string) {
  return filtre ?? YENI_WIDGET_TIPI;
}

function kaydetHazirMi(form: WidgetFormDegeri) {
  return Boolean(form.tip && (form.ad.trim() || form.baslik.trim() || tipEtiketi(form.tip)));
}

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
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);
  const [otomatikDoldur, setOtomatikDoldur] = useState(false);
  const [yeniTaslakSayac, setYeniTaslakSayac] = useState(0);
  const [tipOnaylandi, setTipOnaylandi] = useState(Boolean(varsayilanTip));

  const yeniMod = seciliId === null;
  const editorAnahtar = seciliId ?? `yeni-${yeniTaslakSayac}`;

  const yukle = useCallback(async () => {
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
  }, [varsayilanTip]);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  useEffect(() => {
    if (seciliId != null) return;
    setForm((onceki) => {
      const sonraki = sonrakiWidgetSira(widgetlar, onceki.sayfaId);
      const cakisma = siraCakismasiBul(widgetlar, onceki.sira, onceki.sayfaId);
      const varsayilanCakisma = sonraki > 1 && onceki.sira === 1;
      if (!cakisma && !varsayilanCakisma) return onceki;
      return onceki.sira === sonraki ? onceki : { ...onceki, sira: sonraki };
    });
  }, [widgetlar, seciliId, form.sayfaId]);

  const formuSifirla = useCallback(() => {
    setSeciliId(null);
    setYeniTaslakSayac((n) => n + 1);
    setForm(varsayilanWidgetForm(varsayilanYeniTip(varsayilanTip), widgetlar));
    setTipOnaylandi(Boolean(varsayilanTip));
    setBasari('');
    setHata('');
  }, [varsayilanTip, widgetlar]);

  const yeniBaslat = useCallback(() => {
    formuSifirla();
    setGorunum('editor');
  }, [formuSifirla]);

  const kaydet = useCallback(async () => {
    const deger = widgetFormNormalize(form);
    const ad = deger.ad.trim() || deger.baslik.trim() || tipEtiketi(deger.tip);
    if (!ad) {
      setHata('Widget adı veya içerik başlığı gerekli');
      return;
    }
    const kayitDegeri = deger.ad.trim() ? deger : { ...deger, ad };
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const guncel = await widgetGuncelle(seciliId, kayitDegeri);
        // Yerel Kurumsal Hero ilk kayıtta sunucuya aktarılınca ID değişir.
        // Güncel kaydı eski seçili ID üzerinden değiştirip seçimi yeni ID'ye taşırız.
        setWidgetlar((onceki) => onceki.map((w) => (w.id === seciliId ? guncel : w)));
        setSeciliId(guncel.id);
        setForm(widgettenForma(guncel));
        setBasari('Widget güncellendi.');
      } else {
        const yeni = await widgetOlustur(kayitDegeri);
        setWidgetlar((onceki) => [yeni, ...onceki]);
        setSeciliId(yeni.id);
        setForm(widgettenForma(yeni));
        setBasari(yeni.aktif ? 'Yeni widget oluşturuldu (aktif).' : 'Yeni widget oluşturuldu (pasif).');
      }
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

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
      setGorunum('liste');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, varsayilanTip, widgetlar]);

  const duzenlemeyeGit = useCallback(() => {
    if (!seciliId) return;
    setGorunum('editor');
  }, [seciliId]);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      sil: silHandler,
      duzenle: duzenlemeyeGit,
      onizle: () => setOnizlemeAcik(true),
    },
    {
      kaydet: gorunum === 'editor' && tipOnaylandi && !kaydediliyor && kaydetHazirMi(form),
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
      duzenle: !!seciliId && gorunum !== 'editor' && !kaydediliyor,
      onizle: gorunum === 'editor' && tipOnaylandi && Boolean(form.tip) && !kaydediliyor,
    }
  );

  const seciliWidget = useMemo(
    () => widgetlar.find((w) => w.id === seciliId) ?? null,
    [widgetlar, seciliId]
  );

  function widgetSec(widget: AdminWidget) {
    setSeciliId(widget.id);
    setForm(widgettenForma(widget));
    setTipOnaylandi(true);
    setBasari('');
    setHata('');
  }

  function widgetDuzenleAc(widget: AdminWidget) {
    widgetSec(widget);
    setGorunum('editor');
  }

  function galeridenTipSec(tip: string) {
    const taslak = varsayilanWidgetForm(tip, widgetlar, form.sayfaId);
    setForm({
      ...taslak,
      ad: taslak.ad.trim() || tipEtiketi(tip),
      sira: form.sira,
      sayfaId: form.sayfaId,
    });
    setTipOnaylandi(true);
    setBasari('');
    setHata('');
  }

  function tipiDegistir() {
    setTipOnaylandi(false);
  }

  function gorunumDegistir(id: Gorunum) {
    if (id === gorunum) return;
    if (id === 'liste') {
      setGorunum('liste');
      return;
    }
    if (seciliId) {
      setGorunum('editor');
      return;
    }
    yeniBaslat();
  }

  const editorEtiket = gorunum === 'editor' && seciliId ? 'Düzenleme' : 'Yeni Widget';

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Widgetlar yükleniyor..." />
      </AdminModulKabuk>
    );
  }

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Widget Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: editorEtiket,
              ikon: gorunum === 'editor' && seciliId ? <DuzenlemeIkon /> : <YeniIkon />,
            },
          ]}
          aktif={gorunum}
          onDegistir={gorunumDegistir}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {gorunum === 'liste' && (
        <WidgetListesiPanel
          widgetlar={widgetlar}
          seciliId={seciliId}
          tipFiltre={varsayilanTip}
          sayfalar={sayfalar}
          onSec={widgetSec}
          onDuzenle={widgetDuzenleAc}
        />
      )}
      {gorunum === 'editor' && yeniMod && !tipOnaylandi && (
        <WidgetTipGaleri tipFiltre={varsayilanTip} onSec={galeridenTipSec} />
      )}
      {gorunum === 'editor' && tipOnaylandi && (
        <WidgetEditorPanel
          form={form}
          seciliWidget={seciliWidget}
          yeniMod={yeniMod}
          editorAnahtar={editorAnahtar}
          tumWidgetlar={widgetlar}
          sayfalar={sayfalar}
          onChange={(yeni) => setForm(widgetFormNormalize(yeni))}
          onOtomatikDoldurChange={setOtomatikDoldur}
          onTipDegistirIste={yeniMod ? tipiDegistir : undefined}
        />
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
