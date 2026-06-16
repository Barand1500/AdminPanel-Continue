import { useCallback, useEffect, useState } from 'react';
import { KullaniciDuzenleFormu, KullaniciListesi, type AtanabilirRol } from '@/components/admin/kullanici/KullaniciBilesenleri';
import { useAuth } from '@/contexts/AuthContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { adminRolleriGetir } from '@/features/admin/rolApi';
import {
  adminKullaniciGuncelle,
  adminKullaniciOlustur,
  adminKullaniciSil,
  adminKullaniciSiteleriGetir,
  adminKullanicilariGetir,
  VARSAYILAN_ROL_ETIKETLERI,
  type AdminKullanici,
  type AdminSiteOzet,
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

function kullanicidanForm(k: AdminKullanici): KullaniciFormDegeri {
  return {
    email: k.email,
    ad: k.ad,
    sifre: '',
    rol: k.rol,
    siteId: k.siteId ?? '',
    aktif: k.aktif,
  };
}

export function KullanicilarSayfasi() {
  const { kullanici: oturum } = useAuth();
  const [kullanicilar, setKullanicilar] = useState<AdminKullanici[]>([]);
  const [siteler, setSiteler] = useState<AdminSiteOzet[]>([]);
  const [form, setForm] = useState<KullaniciFormDegeri>(bosForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [sifreDegisti, setSifreDegisti] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [tumRoller, setTumRoller] = useState<AtanabilirRol[]>([]);
  const [rolBasliklari, setRolBasliklari] = useState<Record<string, string>>(VARSAYILAN_ROL_ETIKETLERI);

  const yetkili = oturum?.rol === 'SUPER_ADMIN' || oturum?.rol === 'AJANS_ADMIN';

  const atanabilirRoller = tumRoller.filter((r) => {
    if (oturum?.rol === 'SUPER_ADMIN') return true;
    return r.kod !== 'SUPER_ADMIN' && r.kod !== 'AJANS_ADMIN';
  });

  async function yukle() {
    setYukleniyor(true);
    setHata('');
    try {
      const [liste, siteListesi, rolVeri] = await Promise.all([
        adminKullanicilariGetir(),
        adminKullaniciSiteleriGetir(),
        adminRolleriGetir(),
      ]);
      setKullanicilar(liste);
      setSiteler(siteListesi);
      const roller = rolVeri.roller.map((r) => ({ kod: r.kod, baslik: r.baslik }));
      setTumRoller(roller);
      setRolBasliklari(
        Object.fromEntries(rolVeri.roller.map((r) => [r.kod, r.baslik]))
      );
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kullanıcılar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    if (yetkili) void yukle();
    else setYukleniyor(false);
  }, [yetkili]);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    const varsayilanRol = atanabilirRoller[0]?.kod ?? 'MUSTERI_ADMIN';
    setForm({ ...bosForm, rol: varsayilanRol, siteId: siteler[0]?.id ?? '' });
    setSifreDegisti(false);
  }, [siteler, atanabilirRoller]);

  const kaydet = useCallback(async () => {
    if (!form.ad.trim() || !form.email.trim()) {
      setHata('Ad ve e-posta zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    try {
      if (seciliId) {
        await adminKullaniciGuncelle(seciliId, form, sifreDegisti);
      } else {
        await adminKullaniciOlustur(form);
      }
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, sifreDegisti, yeniBaslat]);

  const sil = useCallback(async () => {
    if (!seciliId || !confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await adminKullaniciSil(seciliId);
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat]);

  useModulAksiyonlari(
    { kaydet, ekle: yeniBaslat, sil },
    {
      kaydet: !kaydediliyor,
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
    }
  );

  if (!yetkili) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl">🔒</p>
        <h1 className="mt-4 text-xl font-bold text-white">Yetkisiz Erişim</h1>
        <p className="mt-2 text-sm text-slate-400">
          Kullanıcı yönetimi için Super Admin veya Ajans Admin yetkisi gerekir.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white">Kullanıcılar</h1>
      <p className="mt-1 text-sm text-slate-400">
        Site kullanıcılarını oluşturun, rollerini atayın ve erişimlerini yönetin.
      </p>
      {hata && <p className="mt-4 text-sm text-red-400">{hata}</p>}
      {kaydediliyor && <p className="mt-4 text-sm text-slate-400">İşlem yapılıyor...</p>}

      {yukleniyor ? (
        <p className="mt-6 text-sm text-slate-400">Yükleniyor...</p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
          <KullaniciListesi
            kullanicilar={kullanicilar}
            seciliId={seciliId}
            rolBasliklari={rolBasliklari}
            onSec={(k) => {
              setSeciliId(k.id);
              setForm(kullanicidanForm(k));
              setSifreDegisti(false);
            }}
          />
          <KullaniciDuzenleFormu
            form={form}
            seciliId={seciliId}
            siteler={siteler}
            cagiranRol={oturum?.rol ?? ''}
            atanabilirRoller={atanabilirRoller}
            onSifreDegisti={setSifreDegisti}
            onChange={setForm}
          />
        </div>
      )}
    </div>
  );
}
