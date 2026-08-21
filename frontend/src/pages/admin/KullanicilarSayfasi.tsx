import { useCallback, useEffect, useState } from 'react';
import { KullaniciDuzenleFormu, KullaniciListesi, type AtanabilirRol } from '@/components/admin/kullanici/KullaniciBilesenleri';
import { AdminModulKabuk, AdminPanelKarti, BildirimKutusu } from '@/components/admin/ortak/AdminBilesenleri';
import { useAuth } from '@/contexts/AuthContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { useYetkiler } from '@/hooks/useYetkiler';
import { adminRolleriGetir } from '@/features/admin/rolApi';
import {
  adminKullaniciGuncelle,
  adminKullaniciOlustur,
  adminKullaniciSil,
  adminKullanicilariGetir,
  VARSAYILAN_ROL_ETIKETLERI,
  type AdminKullanici,
  type KullaniciFormDegeri,
} from '@/features/admin/kullaniciApi';

const bosForm: KullaniciFormDegeri = {
  email: '',
  ad: '',
  sifre: '',
  rol: 'MUSTERI_ADMIN',
  siteId: '',
  aktif: true,
};

function kullanicidanForm(kullanici: AdminKullanici): KullaniciFormDegeri {
  return {
    email: kullanici.email,
    ad: kullanici.ad,
    sifre: '',
    rol: kullanici.rol,
    siteId: kullanici.siteId ?? '',
    aktif: kullanici.aktif,
  };
}

export function KullanicilarSayfasi() {
  const { kullanici: oturum } = useAuth();
  const { kullaniciYonetimiVar } = useYetkiler();
  const [kullanicilar, setKullanicilar] = useState<AdminKullanici[]>([]);
  const [form, setForm] = useState<KullaniciFormDegeri>(bosForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [sifreDegisti, setSifreDegisti] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [tumRoller, setTumRoller] = useState<AtanabilirRol[]>([]);
  const [rolBasliklari, setRolBasliklari] = useState<Record<string, string>>(VARSAYILAN_ROL_ETIKETLERI);

  const atanabilirRoller = tumRoller.filter((rol) => {
    if (oturum?.rol === 'SUPER_ADMIN') return true;
    return rol.kod !== 'SUPER_ADMIN' && rol.kod !== 'AJANS_ADMIN';
  });

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    setHata('');
    try {
      const [liste, rolVeri] = await Promise.all([adminKullanicilariGetir(), adminRolleriGetir()]);
      setKullanicilar(liste);
      const roller = rolVeri.roller.map((rol) => ({ kod: rol.kod, baslik: rol.baslik }));
      setTumRoller(roller);
      setRolBasliklari(Object.fromEntries(roller.map((rol) => [rol.kod, rol.baslik])));
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kullanıcılar alınamadı.');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    if (kullaniciYonetimiVar) void yukle();
    else setYukleniyor(false);
  }, [kullaniciYonetimiVar, yukle]);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm({ ...bosForm, rol: atanabilirRoller[0]?.kod ?? 'MUSTERI_ADMIN' });
    setSifreDegisti(false);
    setHata('');
  }, [atanabilirRoller]);

  const kullaniciSec = useCallback((kullanici: AdminKullanici) => {
    setSeciliId(kullanici.id);
    setForm(kullanicidanForm(kullanici));
    setSifreDegisti(false);
    setHata('');
  }, []);

  const kaydet = useCallback(async () => {
    if (!form.ad.trim() || !form.email.trim()) {
      setHata('Ad ve e-posta zorunludur.');
      return;
    }
    if (!seciliId && !form.sifre.trim()) {
      setHata('Yeni kullanıcı için şifre zorunludur.');
      return;
    }

    setKaydediliyor(true);
    setHata('');
    try {
      if (seciliId) await adminKullaniciGuncelle(seciliId, form, sifreDegisti);
      else await adminKullaniciOlustur(form);
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız.');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, sifreDegisti, yeniBaslat, yukle]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await adminKullaniciSil(seciliId);
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız.');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat, yukle]);

  useModulAksiyonlari(
    { kaydet, ekle: yeniBaslat, sil },
    { kaydet: !kaydediliyor, ekle: !kaydediliyor, sil: Boolean(seciliId) && !kaydediliyor }
  );

  if (!kullaniciYonetimiVar) {
    return (
      <div className="py-16 text-center">
        <h1 className="mt-4 text-xl font-bold text-white">Yetkisiz Erişim</h1>
        <p className="mt-2 text-sm text-slate-400">Kullanıcı yönetimi için Kullanıcı Yönetimi yetkisi gerekir.</p>
      </div>
    );
  }

  return (
    <AdminModulKabuk onizleGoster={false}>
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <p className="ap-muted mb-3 text-sm">İşlem yapılıyor...</p>}

      {yukleniyor ? (
        <p className="ap-muted mt-6 text-sm">Kullanıcılar yükleniyor...</p>
      ) : (
        <div className="space-y-5">
          <AdminPanelKarti
            baslik={seciliId ? 'Kullanıcı düzenle' : 'Yeni kullanıcı'}
            altBaslik={seciliId ? 'Bilgileri düzenleyip Kaydet ile güncelleyin.' : 'Formu doldurup Kaydet ile oluşturun.'}
          >
            <KullaniciDuzenleFormu
              form={form}
              seciliId={seciliId}
              atanabilirRoller={atanabilirRoller}
              onSifreDegisti={setSifreDegisti}
              onChange={setForm}
            />
          </AdminPanelKarti>

          <KullaniciListesi
            kullanicilar={kullanicilar}
            seciliId={seciliId}
            rolBasliklari={rolBasliklari}
            onSec={kullaniciSec}
          />
        </div>
      )}
    </AdminModulKabuk>
  );
}
