import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  bosSayfaForm,
  SayfaEditorPanel,
  SayfaListesiPanel,
  sayfadanForm,
} from '@/components/admin/sayfa/SayfaBilesenleri';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminIstatistikKarti } from '@/components/admin/ortak/AdminFormBilesenleri';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  adminSayfaGuncelle,
  adminSayfaOlustur,
  adminSayfaSil,
  adminSayfalariGetir,
  type AdminSayfa,
  type SayfaFormDegeri,
} from '@/features/admin/sayfaApi';

export function SayfaYonetimiSayfasi() {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [form, setForm] = useState<SayfaFormDegeri>(bosSayfaForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [slugManuel, setSlugManuel] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const istatistik = useMemo(() => ({
    toplam: sayfalar.length,
    yayinda: sayfalar.filter((s) => s.yayinda).length,
    taslak: sayfalar.filter((s) => !s.yayinda).length,
    menude: sayfalar.filter((s) => s.menudeGoster).length,
  }), [sayfalar]);

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

  const kaydet = useCallback(async () => {
    if (!form.baslik.trim()) {
      setHata('Başlık zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) await adminSayfaGuncelle(seciliId, form);
      else await adminSayfaOlustur(form);
      setBasari(seciliId ? 'Sayfa güncellendi.' : 'Yeni sayfa oluşturuldu.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

  const yayinla = useCallback(async () => {
    const guncel = { ...form, yayinda: true };
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) await adminSayfaGuncelle(seciliId, guncel);
      else await adminSayfaOlustur(guncel);
      setBasari('Sayfa yayınlandı.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yayınlama başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

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
      <AdminModulKabuk
        baslik="Sayfa Yönetimi"
        aciklama="Site sayfalarını oluşturun, içerik ve SEO ayarlarını düzenleyin. Tüm işlemler alt aksiyon çubuğundan yapılır."
      >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Sayfalar yükleniyor..." />
      ) : (
        <>
          <div className="ap-stat-grid">
            <AdminIstatistikKarti etiket="Toplam" deger={istatistik.toplam} ikon="📄" vurgu="mavi" />
            <AdminIstatistikKarti etiket="Yayında" deger={istatistik.yayinda} ikon="✅" vurgu="yesil" />
            <AdminIstatistikKarti etiket="Taslak" deger={istatistik.taslak} ikon="📝" vurgu="amber" />
            <AdminIstatistikKarti etiket="Menüde" deger={istatistik.menude} ikon="📋" vurgu="gri" />
          </div>

          <div className="ap-split-layout">
            <SayfaListesiPanel sayfalar={sayfalar} seciliId={seciliId} onSec={sayfaSec} />
            <SayfaEditorPanel
              form={form}
              seciliId={seciliId}
              slugManuel={slugManuel}
              onChange={setForm}
              onSlugManuelChange={setSlugManuel}
            />
          </div>
        </>
      )}
      </AdminModulKabuk>
  );
}
