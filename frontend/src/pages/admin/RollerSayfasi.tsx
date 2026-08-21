import { useCallback, useEffect, useRef, useState } from 'react';
import { IconKey, IconLayoutGrid } from '@tabler/icons-react';
import { RolKartlari, RolMatrisi, rolSilinebilirMi } from '@/components/admin/rol/RolBilesenleri';
import { RolDuzenleModal } from '@/components/admin/rol/RolDuzenleModal';
import { RolEkleModal } from '@/components/admin/rol/RolEkleModal';
import { RolSilModal } from '@/components/admin/rol/RolSilModal';
import { useAuth } from '@/contexts/AuthContext';
import { useKaydedilmemisBildirim } from '@/contexts/AdminUyariBildirimContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminModulKabuk, AdminPanelKarti, BildirimKutusu } from '@/components/admin/ortak/AdminBilesenleri';
import {
  adminRolleriGetir,
  adminRolleriKaydet,
  baslikdanKodUret,
  GECERLI_YETKI_LISTESI,
  rollerTemizle,
  type RolTanimi,
  type YetkiKodu,
} from '@/features/admin/rolApi';

function rollerEsitMi(a: RolTanimi[], b: RolTanimi[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((rol, i) => {
    const diger = b[i];
    if (rol.kod !== diger.kod || rol.baslik !== diger.baslik || rol.aciklama !== diger.aciklama) {
      return false;
    }
    if (rol.yetkiler.length !== diger.yetkiler.length) return false;
    return rol.yetkiler.every((y, j) => y === diger.yetkiler[j]);
  });
}

export function RollerSayfasi() {
  const { kullanici } = useAuth();
  const [taslakRoller, setTaslakRoller] = useState<RolTanimi[]>([]);
  const [kayitliRoller, setKayitliRoller] = useState<RolTanimi[]>([]);
  const yetkiler = GECERLI_YETKI_LISTESI;
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [ekleModalAcik, setEkleModalAcik] = useState(false);
  const [duzenleRol, setDuzenleRol] = useState<RolTanimi | null>(null);
  const [silModalAcik, setSilModalAcik] = useState(false);
  const [seciliRolKod, setSeciliRolKod] = useState<string | null>(null);
  const [matrisFiltreKod, setMatrisFiltreKod] = useState<string | null>(null);
  const [rolArama, setRolArama] = useState('');
  const [aktifGorunum, setAktifGorunum] = useState<'matris' | 'tanimlar'>('matris');
  const kayitliRef = useRef<RolTanimi[]>([]);

  const yetkili = kullanici?.rol === 'SUPER_ADMIN' || kullanici?.rol === 'AJANS_ADMIN';
  const superAdminMi = kullanici?.rol === 'SUPER_ADMIN';
  const degisti = !rollerEsitMi(taslakRoller, kayitliRoller);

  useKaydedilmemisBildirim(
    superAdminMi && degisti && !kaydediliyor,
    'Kaydedilmemiş değişiklikler var.',
    'Roller ve Yetkiler',
    'roller'
  );

  const seciliRol = taslakRoller.find((r) => r.kod === seciliRolKod) ?? null;
  const silAktif = superAdminMi && !!seciliRol && rolSilinebilirMi(seciliRol);
  const gorunenRoller = taslakRoller.filter((rol) => {
    const arama = rolArama.trim().toLocaleLowerCase('tr-TR');
    if (!arama) return true;
    return `${rol.baslik} ${rol.kod}`.toLocaleLowerCase('tr-TR').includes(arama);
  });
  const matrisRolleri = matrisFiltreKod
    ? taslakRoller.filter((rol) => rol.kod === matrisFiltreKod)
    : taslakRoller;

  async function yukle() {
    setYukleniyor(true);
    setHata('');
    try {
      const veri = await adminRolleriGetir();
      const temiz = rollerTemizle(veri.roller);
      setTaslakRoller(temiz);
      setKayitliRoller(temiz);
      kayitliRef.current = temiz;
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Roller alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    if (!yetkili) {
      setYukleniyor(false);
      return;
    }
    void yukle();
  }, [yetkili]);

  const yetkiToggle = useCallback((rolKod: string, yetkiKod: YetkiKodu) => {
    setTaslakRoller((onceki) =>
      onceki.map((rol) => {
        if (rol.kod !== rolKod || rol.kod === 'SUPER_ADMIN') return rol;
        const varMi = rol.yetkiler.includes(yetkiKod);
        const yeniYetkiler = varMi
          ? rol.yetkiler.filter((y) => y !== yetkiKod)
          : [...rol.yetkiler, yetkiKod];
        return { ...rol, yetkiler: yeniYetkiler };
      })
    );
  }, []);

  const rolDuzenle = useCallback((kod: string, deger: { baslik: string; aciklama: string }) => {
    setTaslakRoller((onceki) =>
      onceki.map((rol) => (rol.kod === kod ? { ...rol, ...deger } : rol))
    );
  }, []);

  const rolEkle = useCallback((deger: { baslik: string; aciklama: string }) => {
    setTaslakRoller((onceki) => {
      const kod = baslikdanKodUret(
        deger.baslik,
        onceki.map((r) => r.kod)
      );
      setSeciliRolKod(kod);
      return [
        ...onceki,
        {
          kod,
          baslik: deger.baslik,
          aciklama: deger.aciklama,
          yetkiler: ['goruntuleme'] as YetkiKodu[],
          sistemRolu: false,
        },
      ];
    });
  }, []);

  const rolSec = useCallback((rol: RolTanimi) => {
    setSeciliRolKod((onceki) => (onceki === rol.kod ? null : rol.kod));
  }, []);

  const silIste = useCallback(() => {
    if (!seciliRol || !rolSilinebilirMi(seciliRol)) return;
    setSilModalAcik(true);
  }, [seciliRol]);

  const rolSilOnayla = useCallback(() => {
    if (!seciliRolKod) return;
    setTaslakRoller((onceki) => onceki.filter((r) => r.kod !== seciliRolKod));
    setSeciliRolKod(null);
  }, [seciliRolKod]);

  const kaydet = useCallback(async () => {
    setKaydediliyor(true);
    setHata('');
    try {
      const veri = await adminRolleriKaydet(rollerTemizle(taslakRoller));
      const temiz = rollerTemizle(veri.roller);
      setTaslakRoller(temiz);
      setKayitliRoller(temiz);
      kayitliRef.current = temiz;
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kaydetme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [taslakRoller]);

  const ekleAc = useCallback(() => setEkleModalAcik(true), []);

  useModulAksiyonlari(
    { kaydet, ekle: ekleAc, sil: silIste },
    {
      kaydet: superAdminMi && degisti && !kaydediliyor,
      ekle: superAdminMi && !kaydediliyor,
      sil: silAktif && !kaydediliyor,
    }
  );

  if (!yetkili) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl">🔒</p>
        <h1 className="mt-4 text-xl font-bold text-white">Yetkisiz Erişim</h1>
        <p className="mt-2 text-sm text-slate-400">
          Rol ve yetki bilgilerini görmek için Super Admin veya Ajans Admin yetkisi gerekir.
        </p>
      </div>
    );
  }

  return (
    <AdminModulKabuk onizleGoster={false}>
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <p className="ap-muted mb-3 text-sm">Kaydediliyor...</p>}

      <AdminPanelKarti
        baslik={aktifGorunum === 'matris' ? 'Yetki Matrisi' : 'Rol Tanımları'}
        altBaslik={
          aktifGorunum === 'matris'
            ? 'Soldan rol seçin; seçili rolün panel yetkilerini görüntüleyin veya düzenleyin.'
            : 'Sistemde kullanılan rolleri ve yetki kapsamlarını yönetin.'
        }
        ustAksiyon={
          <div className="flex rounded-xl border border-[var(--ap-border)] p-1">
            <button
              type="button"
              onClick={() => setAktifGorunum('matris')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                aktifGorunum === 'matris' ? 'bg-[var(--ap-accent)] text-white shadow-sm' : 'ap-muted hover:bg-[var(--ap-hover)]'
              }`}
            >
              <IconLayoutGrid size={15} stroke={1.9} aria-hidden /> Yetki Matrisi
            </button>
            <button
              type="button"
              onClick={() => setAktifGorunum('tanimlar')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                aktifGorunum === 'tanimlar' ? 'bg-[var(--ap-accent)] text-white shadow-sm' : 'ap-muted hover:bg-[var(--ap-hover)]'
              }`}
            >
              <IconKey size={15} stroke={1.9} aria-hidden /> Rol Tanımları
            </button>
          </div>
        }
      >
        {yukleniyor ? (
          <p className="ap-muted py-8 text-sm">Roller yükleniyor...</p>
        ) : aktifGorunum === 'matris' ? (
          <div className="grid min-h-[520px] gap-3 lg:grid-cols-[205px_1fr]">
            <aside className="rounded-xl border border-[var(--ap-border)] bg-[var(--ap-surface-2)] p-2">
              <input
                type="search"
                value={rolArama}
                onChange={(event) => setRolArama(event.target.value)}
                placeholder="Rol ara..."
                className="mb-2 w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-xs outline-none focus:border-[var(--ap-accent)]"
              />
              <button
                type="button"
                onClick={() => setMatrisFiltreKod(null)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                  matrisFiltreKod === null ? 'bg-[var(--ap-accent)] text-white' : 'ap-muted hover:bg-[var(--ap-hover)]'
                }`}
              >
                Tüm roller
              </button>
              <ul className="space-y-1" aria-label="Rol filtresi">
                {gorunenRoller.map((rol) => (
                  <li key={rol.kod}>
                    <button
                      type="button"
                      onClick={() => setMatrisFiltreKod(rol.kod)}
                      className={`w-full rounded-lg px-3 py-2 text-left transition ${
                        matrisFiltreKod === rol.kod ? 'bg-[var(--ap-accent)] text-white' : 'hover:bg-[var(--ap-hover)]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{rol.baslik}</span>
                      <span className={`block text-[10px] ${matrisFiltreKod === rol.kod ? 'text-white/75' : 'ap-muted'}`}>{rol.kod}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="min-w-0 overflow-auto rounded-xl border border-[var(--ap-border)]">
              <RolMatrisi
                roller={matrisRolleri}
                yetkiler={yetkiler}
                duzenlenebilir={superAdminMi}
                onYetkiToggle={yetkiToggle}
              />
            </div>
          </div>
        ) : (
          <RolKartlari
            roller={taslakRoller}
            seciliKod={seciliRolKod}
            duzenlenebilir={superAdminMi}
            onSec={rolSec}
            onDuzenle={setDuzenleRol}
          />
        )}
      </AdminPanelKarti>

      <RolEkleModal
        acik={ekleModalAcik}
        onKapat={() => setEkleModalAcik(false)}
        onEkle={rolEkle}
      />
      <RolDuzenleModal
        acik={!!duzenleRol}
        rol={duzenleRol}
        onKapat={() => setDuzenleRol(null)}
        onKaydet={rolDuzenle}
      />
      <RolSilModal
        acik={silModalAcik}
        rol={seciliRol}
        onKapat={() => setSilModalAcik(false)}
        onOnayla={rolSilOnayla}
      />
    </AdminModulKabuk>
  );
}
