import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  varsayilanSayfaForm,
  SayfaEditorPanel,
  SayfaListesiPanel,
  sayfadanForm,
} from '@/components/admin/sayfa/SayfaBilesenleri';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  adminSayfaGuncelle,
  adminSayfaOlustur,
  adminSayfaSil,
  adminSayfaSirala,
  adminSayfalariGetir,
  type AdminSayfa,
  type SayfaFormDegeri,
} from '@/features/admin/sayfaApi';
import { widgetlariGetir } from '@/features/admin/widgetApi';
import type { AdminWidget } from '@/types/admin';
import { idString } from '@/utils/idKarsilastir';
import { sayfaSiraCakismasiBul, sonrakiSayfaSira } from '@/utils/sayfaSiraYardimci';

export function SayfaYonetimiSayfasi() {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [widgetlar, setWidgetlar] = useState<AdminWidget[]>([]);
  const [form, setForm] = useState<SayfaFormDegeri>(() => varsayilanSayfaForm([]));
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [slugManuel, setSlugManuel] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  async function yukle() {
    setYukleniyor(true);
    try {
      const [sayfaListesi, widgetListesi] = await Promise.all([
        adminSayfalariGetir(),
        widgetlariGetir(),
      ]);
      setSayfalar(sayfaListesi);
      setWidgetlar(widgetListesi);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Sayfalar alinamadi');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  useEffect(() => {
    if (seciliId != null) return;
    setForm((onceki) => {
      const sonraki = sonrakiSayfaSira(sayfalar, onceki.ustSayfaId);
      const cakisma = sayfaSiraCakismasiBul(sayfalar, onceki.sira, onceki.ustSayfaId);
      const varsayilanCakisma =
        sayfalar.length > 0 && onceki.sira === 1 && sonraki > 1;
      if (!cakisma && !varsayilanCakisma) return onceki;
      return onceki.sira === sonraki ? onceki : { ...onceki, sira: sonraki };
    });
  }, [sayfalar, seciliId]);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(varsayilanSayfaForm(sayfalar));
    setSlugManuel(false);
    setBasari('');
    setHata('');
  }, [sayfalar]);

  const altSayfaBaslat = useCallback(
    (ustSayfa: AdminSayfa) => {
      setSeciliId(null);
      setForm(varsayilanSayfaForm(sayfalar, ustSayfa));
      setSlugManuel(false);
      setBasari('');
      setHata('');
    },
    [sayfalar]
  );

  const kaydet = useCallback(async () => {
    if (!form.baslik.trim()) {
      setHata('Başlık zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const guncellenen = await adminSayfaGuncelle(seciliId, form);
        setForm(sayfadanForm(guncellenen));
        setSeciliId(guncellenen.id);
        setBasari('Sayfa güncellendi.');
      } else {
        const olusturulan = await adminSayfaOlustur(form);
        setForm(sayfadanForm(olusturulan));
        setSeciliId(olusturulan.id);
        setSlugManuel(true);
        setBasari('Yeni sayfa oluşturuldu.');
      }
      setSayfalar(await adminSayfalariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

  const yayinla = useCallback(async () => {
    const guncel = { ...form, yayinda: true };
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) {
        const guncellenen = await adminSayfaGuncelle(seciliId, guncel);
        setForm(sayfadanForm(guncellenen));
        setSeciliId(guncellenen.id);
      } else {
        const olusturulan = await adminSayfaOlustur(guncel);
        setForm(sayfadanForm(olusturulan));
        setSeciliId(olusturulan.id);
        setSlugManuel(true);
      }
      setBasari('Sayfa yayınlandı.');
      setSayfalar(await adminSayfalariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yayınlama başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    setHata('');
    try {
      await adminSayfaSil(seciliId);
      setBasari('Sayfa silindi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat]);

  const sayfaSirala = useCallback(
    async (sayfaId: string, yon: 'yukari' | 'asagi') => {
      setKaydediliyor(true);
      setHata('');
      setBasari('');
      try {
        const liste = await adminSayfaSirala(sayfaId, yon, sayfalar);
        setSayfalar(liste);
        if (seciliId === sayfaId) {
          const guncel = liste.find((s) => s.id === sayfaId);
          if (guncel) setForm(sayfadanForm(guncel));
        }
        setBasari('Sıralama güncellendi.');
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Sıralama başarısız');
      } finally {
        setKaydediliyor(false);
      }
    },
    [seciliId, sayfalar]
  );

  const seciliSayfaWidgetlari = useMemo(() => {
    if (!seciliId) return [];
    return widgetlar.filter((w) => w.sayfaId && idString(w.sayfaId) === seciliId);
  }, [widgetlar, seciliId]);

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
      altEkle: () => {
        const secili = sayfalar.find((s) => s.id === seciliId);
        if (secili) altSayfaBaslat(secili);
      },
      sil,
      yayinla,
      onizle: () => {
        if (form.slug) window.open(`/${form.slug}`, '_blank');
        else window.open('/', '_blank');
      },
    },
    {
      kaydet: !kaydediliyor,
      ekle: true,
      altEkle: !!seciliId && !kaydediliyor,
      sil: !!seciliId && !kaydediliyor,
      yayinla: !kaydediliyor,
      onizle: true,
    }
  );

  function sayfaSec(s: AdminSayfa) {
    setSeciliId(s.id);
    setForm(sayfadanForm(s));
    setSlugManuel(true);
    setBasari('');
    setHata('');
  }

  useEffect(() => {
    function sayfaSecHandler(e: Event) {
      const id = (e as CustomEvent<{ sayfaId?: string }>).detail?.sayfaId;
      if (!id) return;
      const s = sayfalar.find((x) => x.id === id);
      if (s) sayfaSec(s);
    }
    function yeniSayfaHandler() {
      yeniBaslat();
    }
    window.addEventListener('ap-admin-sayfa-sec', sayfaSecHandler);
    window.addEventListener('ap-admin-yeni-sayfa', yeniSayfaHandler);
    return () => {
      window.removeEventListener('ap-admin-sayfa-sec', sayfaSecHandler);
      window.removeEventListener('ap-admin-yeni-sayfa', yeniSayfaHandler);
    };
  }, [sayfalar, yeniBaslat]);

  return (
      <AdminModulKabuk baslik="Sayfa Yönetimi" aciklama="Site sayfalarını oluşturun ve düzenleyin.">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Sayfalar yükleniyor..." />
      ) : (
        <>
          <div className="ap-split-layout">
            <SayfaListesiPanel
              sayfalar={sayfalar}
              seciliId={seciliId}
              onSec={sayfaSec}
              onSirala={sayfaSirala}
              islemde={kaydediliyor}
            />
            <SayfaEditorPanel
              form={form}
              seciliId={seciliId}
              slugManuel={slugManuel}
              sayfalar={sayfalar}
              sayfaWidgetlari={seciliSayfaWidgetlari}
              onChange={setForm}
              onSlugManuelChange={setSlugManuel}
              onAltSayfaEkle={altSayfaBaslat}
              onSayfaSec={sayfaSec}
              onSirala={sayfaSirala}
              islemde={kaydediliyor}
            />
          </div>
        </>
      )}
      </AdminModulKabuk>
  );
}
