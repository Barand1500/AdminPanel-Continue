import { useCallback, useEffect, useState } from 'react';
import {
  bosSayfaForm,
  altSayfaFormu,
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
  adminSayfalariGetir,
  type AdminSayfa,
  type SayfaFormDegeri,
} from '@/features/admin/sayfaApi';
import { altSayfaSayisi } from '@/utils/sayfaAgaci';

export function SayfaYonetimiSayfasi() {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [form, setForm] = useState<SayfaFormDegeri>(bosSayfaForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [slugManuel, setSlugManuel] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  async function yukle() {
    setYukleniyor(true);
    try {
      setSayfalar(await adminSayfalariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Sayfalar alinamadi');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosSayfaForm);
    setSlugManuel(false);
    setBasari('');
    setHata('');
  }, []);

  const altSayfaBaslat = useCallback(
    (ustSayfa: AdminSayfa) => {
      setSeciliId(null);
      setForm(altSayfaFormu(ustSayfa, altSayfaSayisi(sayfalar, ustSayfa.id)));
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

  useModulAksiyonlari(
    {
      kaydet,
      ekle: yeniBaslat,
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
              onYeniSayfa={yeniBaslat}
              onAltSayfaEkle={altSayfaBaslat}
            />
            <SayfaEditorPanel
              form={form}
              seciliId={seciliId}
              slugManuel={slugManuel}
              sayfalar={sayfalar}
              onChange={setForm}
              onSlugManuelChange={setSlugManuel}
              onAltSayfaEkle={altSayfaBaslat}
            />
          </div>
        </>
      )}
      </AdminModulKabuk>
  );
}
