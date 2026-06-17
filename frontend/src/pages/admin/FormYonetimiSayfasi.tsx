import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormEditorKabuk } from '@/components/admin/form/FormEditorKabuk';
import { FormGonderimPanel } from '@/components/admin/form/FormGonderimPanel';
import { FormListePanel } from '@/components/admin/form/FormListePanel';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  AdminModulKabuk,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminIstatistikKarti } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  adminFormGonderimleriGetir,
  adminFormGuncelle,
  adminFormOlustur,
  adminFormSil,
  adminFormlariGetir,
  adminGonderimOkundu,
  adminGonderimSil,
  bosForm,
  formdanDeger,
  type AdminForm,
  type FormGonderim,
} from '@/features/admin/formApi';

export function FormYonetimiSayfasi() {
  const [formlar, setFormlar] = useState<AdminForm[]>([]);
  const [form, setForm] = useState(bosForm);
  const [gonderimler, setGonderimler] = useState<FormGonderim[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const istatistik = useMemo(
    () => ({
      toplam: formlar.length,
      yayinda: formlar.filter((f) => f.aktif).length,
      taslak: formlar.filter((f) => !f.aktif).length,
      gonderim: formlar.reduce((t, f) => t + (f._count?.gonderimler ?? 0), 0),
    }),
    [formlar]
  );

  async function yukle() {
    setYukleniyor(true);
    try {
      setFormlar(await adminFormlariGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Formlar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  async function gonderimleriYukle(formId: string) {
    try {
      setGonderimler(await adminFormGonderimleriGetir(formId));
    } catch {
      setGonderimler([]);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setGonderimler([]);
    setBasari('');
    setHata('');
  }, []);

  const kaydet = useCallback(async () => {
    if (!form.ad.trim()) {
      setHata('Form adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) await adminFormGuncelle(seciliId, form);
      else await adminFormOlustur(form);
      setBasari(seciliId ? 'Form güncellendi.' : 'Yeni form oluşturuldu.');
      const mevcutId = seciliId;
      await yukle();
      if (mevcutId) {
        setSeciliId(mevcutId);
        void gonderimleriYukle(mevcutId);
      } else {
        yeniBaslat();
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

  const yayinla = useCallback(async () => {
    const guncel = { ...form, aktif: true };
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) await adminFormGuncelle(seciliId, guncel);
      else await adminFormOlustur(guncel);
      setBasari('Form yayına alındı.');
      await yukle();
      yeniBaslat();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yayınlama başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu formu silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await adminFormSil(seciliId);
      setBasari('Form silindi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat]);

  useModulAksiyonlari(
    { kaydet, ekle: yeniBaslat, sil, yayinla },
    {
      kaydet: !kaydediliyor,
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
      yayinla: !kaydediliyor,
    }
  );

  function formSec(f: AdminForm) {
    setSeciliId(f.id);
    setForm(formdanDeger(f));
    setBasari('');
    setHata('');
    void gonderimleriYukle(f.id);
  }

  async function okunduIsaretle(gonderimId: string) {
    if (!seciliId) return;
    await adminGonderimOkundu(seciliId, gonderimId);
    await gonderimleriYukle(seciliId);
  }

  async function gonderimSilHandler(gonderimId: string) {
    if (!seciliId || !confirm('Gönderimi silmek istiyor musunuz?')) return;
    await adminGonderimSil(seciliId, gonderimId);
    await gonderimleriYukle(seciliId);
  }

  return (
    <AdminModulKabuk
      baslik="Form Yönetimi"
      aciklama="İletişim ve başvuru formları oluşturun; alanları, yerleşimi, koşulları ve bildirimleri yapılandırın."
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      {yukleniyor ? (
        <YukleniyorDurumu mesaj="Formlar yükleniyor..." />
      ) : (
        <div className="ap-form-yonetim">
          <div className="ap-stat-grid ap-form-stat-grid">
            <AdminIstatistikKarti etiket="Toplam" deger={istatistik.toplam} ikon="📝" vurgu="mavi" />
            <AdminIstatistikKarti etiket="Yayında" deger={istatistik.yayinda} ikon="✅" vurgu="yesil" />
            <AdminIstatistikKarti etiket="Taslak" deger={istatistik.taslak} ikon="📄" vurgu="amber" />
            <AdminIstatistikKarti etiket="Gönderim" deger={istatistik.gonderim} ikon="📬" vurgu="gri" />
          </div>

          <div className="ap-split-layout ap-form-split">
            <FormListePanel formlar={formlar} seciliId={seciliId} onSec={formSec} />

            <div className="ap-form-ana-alan">
              <FormEditorKabuk form={form} seciliId={seciliId} onChange={setForm} />
              {seciliId && (
                <FormGonderimPanel
                  gonderimler={gonderimler}
                  seciliId={seciliId}
                  onOkundu={okunduIsaretle}
                  onSil={gonderimSilHandler}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </AdminModulKabuk>
  );
}
