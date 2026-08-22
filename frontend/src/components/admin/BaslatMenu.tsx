import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import {
  IconApps,
  IconBolt,
  IconBuilding,
  IconNotes,
  IconSettings,
  IconStar,
  IconUser,
  IconUsersGroup,
  IconX,
} from '@tabler/icons-react';
import { modulAra, adminKategoriler, adminModulleri } from '@/data/adminMenuYapisi';
import { usePanelDil } from '@/contexts/PanelDilContext';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminModul } from '@/types/admin';
import { BaslatMenuArama } from './BaslatMenuArama';
import { BaslatMenuKenarlikAnimasyon } from './BaslatMenuKenarlikAnimasyon';
import { AdminModulIkonu } from './AdminModulIkonu';
import { sekmeAyarlariOku } from '@/utils/sekmePanelAyarlari';

const KATEGORI_FLAT_IKONLARI = {
  'Hızlı Erişim': IconBolt,
  'Site Yönetimi': IconBuilding,
  'İçerik Yönetimi': IconNotes,
  'Müşteri / Ajans': IconUsersGroup,
  Sistem: IconSettings,
} as const;

interface BaslatMenuProps {
  acik: boolean;
  onKapat: () => void;
  onModulSec: (modul: AdminModul) => void;
  baslatButonRef?: RefObject<HTMLButtonElement | null>;
  onProfilAc?: () => void;
}

export function BaslatMenu({ acik, onKapat, onModulSec, baslatButonRef, onProfilAc }: BaslatMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [dockStil, setDockStil] = useState<CSSProperties>();
  const [tasarim, setTasarim] = useState(() => sekmeAyarlariOku().baslatMenuTasarim);
  const [seciliKategori, setSeciliKategori] = useState(() => adminKategoriler[0] ?? '');
  const dockAktif = Boolean(baslatButonRef);

  useLayoutEffect(() => {
    if (!acik || !dockAktif || !baslatButonRef?.current) {
      setDockStil(undefined);
      return;
    }
    const guncelle = () => {
      const buton = baslatButonRef.current?.getBoundingClientRect();
      if (buton) setDockStil({ left: buton.left, top: buton.bottom - 1 });
    };
    guncelle();
    const raf = requestAnimationFrame(guncelle);
    window.addEventListener('resize', guncelle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', guncelle);
    };
  }, [acik, dockAktif, baslatButonRef]);

  useEffect(() => {
    const guncelle = () => setTasarim(sekmeAyarlariOku().baslatMenuTasarim);
    window.addEventListener('ap-sekme-ayarlari-guncellendi', guncelle);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', guncelle);
  }, []);

  if (!acik) return null;
  const kenarlikAnim = dockAktif && acik;

  return (
    <>
      <div className="ap-baslat-overlay fixed inset-0 z-40 bg-black/25" onClick={onKapat} />
      {tasarim === 'modern' ? (
        <ModernBaslatMenu
          menuRef={menuRef}
          dockStil={kenarlikAnim ? dockStil : undefined}
          kenarlikAnim={kenarlikAnim}
          onKapat={onKapat}
          onModulSec={onModulSec}
          onProfilAc={onProfilAc}
          seciliKategori={seciliKategori}
          onKategoriSec={setSeciliKategori}
        />
      ) : (
        <KlasikBaslatMenu
          menuRef={menuRef}
          dockStil={kenarlikAnim ? dockStil : undefined}
          kenarlikAnim={kenarlikAnim}
          onKapat={onKapat}
          onModulSec={onModulSec}
        />
      )}
      {kenarlikAnim && baslatButonRef && (
        <BaslatMenuKenarlikAnimasyon butonRef={baslatButonRef} menuRef={menuRef} />
      )}
    </>
  );
}

interface MenuIcerikProps {
  menuRef: RefObject<HTMLDivElement | null>;
  dockStil?: CSSProperties;
  kenarlikAnim: boolean;
  onKapat: () => void;
  onModulSec: (modul: AdminModul) => void;
  onProfilAc?: () => void;
}

interface ModernBaslatMenuProps extends MenuIcerikProps {
  seciliKategori: string;
  onKategoriSec: (kategori: string) => void;
}

function KlasikBaslatMenu({ menuRef, dockStil, kenarlikAnim, onKapat, onModulSec }: MenuIcerikProps) {
  const [arama, setArama] = useState('');
  const { t } = usePanelDil();
  const sonuclar = modulAra(arama);
  return (
    <div
      ref={menuRef}
      style={dockStil}
      className={`ap-baslat-menu-dock fixed z-50 flex max-h-[calc(100vh-3rem)] w-[min(440px,92vw)] flex-col overflow-hidden border border-[var(--ap-border)] bg-[var(--ap-surface)] shadow-2xl ${
        kenarlikAnim ? 'ap-baslat-menu-dock--kenarlik-anim ap-baslat-menu-dock--bagli' : 'left-0 top-12 border-l-0'
      }`}
    >
      <div className="border-b border-[var(--ap-border)] bg-[var(--ap-header-bg)] px-3 py-2">
        <p className="ap-heading text-xs font-bold">{t('header.baslatMenu', 'Başlat Menüsü')}</p>
        <p className="ap-muted text-[10px]">{t('header.modulAra', 'Modül veya ayar ara')}</p>
      </div>
      <BaslatMenuArama deger={arama} onDegistir={setArama} />
      <div className="ap-scroll flex-1 overflow-y-auto p-2">
        {(arama ? [{ kategori: '', moduller: sonuclar }] : adminKategoriler.map((kategori) => ({
          kategori,
          moduller: adminModulleri.filter((modul) => modul.kategori === kategori),
        }))).map(({ kategori, moduller }) => (
          <KlasikModulListesi
            key={kategori || 'arama'}
            baslik={arama ? `Arama: “${arama}”` : t(`kategori.${kategori}`, kategori)}
            kategori={kategori}
            moduller={moduller}
            onSec={(modul) => { onModulSec(modul); onKapat(); }}
          />
        ))}
      </div>
    </div>
  );
}

function ModernBaslatMenu({ menuRef, dockStil, kenarlikAnim, onKapat, onModulSec, onProfilAc, seciliKategori, onKategoriSec }: ModernBaslatMenuProps) {
  const [arama, setArama] = useState('');
  const [sadeceFavoriler, setSadeceFavoriler] = useState(false);
  const [modernAyar, setModernAyar] = useState(() => sekmeAyarlariOku());
  const { t } = usePanelDil();
  const { kullanici } = useAuth();

  useEffect(() => {
    const guncelle = () => setModernAyar(sekmeAyarlariOku());
    window.addEventListener('ap-sekme-ayarlari-guncellendi', guncelle);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', guncelle);
  }, []);

  const gorunurModuller = adminModulleri;
  const favoriIds = kullanici?.tercihler?.dashboardHizliErisim ?? [];
  const aktifHavuz = sadeceFavoriler ? gorunurModuller.filter((modul) => favoriIds.includes(modul.id)) : gorunurModuller;
  const sonuc = arama ? modulAra(arama).filter((modul) => !sadeceFavoriler || favoriIds.includes(modul.id)) : [];
  const seciliModuller = sadeceFavoriler ? aktifHavuz : aktifHavuz.filter((modul) => modul.kategori === seciliKategori);
  const liste = arama ? sonuc : seciliModuller;
  const tamEkran = modernAyar.baslatMenuKutuBoyutu === 'buyuk';

  return (
    <div
      ref={menuRef}
      style={dockStil}
      className={`ap-baslat-menu-dock ap-baslat-menu-modern fixed z-50 flex flex-col overflow-hidden border border-[var(--ap-border)] bg-[var(--ap-surface)] shadow-2xl ${
        tamEkran ? 'ap-baslat-modern-tam-ekran h-[calc(100vh-3rem)] w-full max-w-none rounded-none' : 'max-h-[calc(100vh-3rem)] w-[min(720px,96vw)]'
      } ap-baslat-modern-kutu-${modernAyar.baslatMenuKutuBoyutu} ap-baslat-modern-kategori-${modernAyar.baslatMenuKategoriGorunum} ${
        kenarlikAnim ? 'ap-baslat-menu-dock--kenarlik-anim ap-baslat-menu-dock--bagli' : 'left-0 top-12 border-l-0'
      }`}
    >
      <header className="ap-baslat-modern-ust">
        <div className="ap-baslat-modern-ust-icerik">
          <p className="ap-baslat-modern-baslik">{sadeceFavoriler ? 'Favori Sayfalar' : t('header.baslatMenu', 'Başlat Menüsü')}</p>
          <div className="ap-baslat-modern-ust-aksiyonlar">
            <button type="button" className={`ap-baslat-modern-favori ${sadeceFavoriler ? 'ap-baslat-modern-favori--aktif' : ''}`} onClick={() => setSadeceFavoriler((onceki) => !onceki)} aria-label="Favorileri göster">
              <IconStar size={15} fill={sadeceFavoriler ? 'currentColor' : 'none'} />
            </button>
            <button type="button" className="ap-baslat-modern-profil" onClick={() => { onProfilAc?.(); onKapat(); }} aria-label="Profil">
              <IconUser size={15} />
            </button>
            <button type="button" className="ap-baslat-modern-kapat" onClick={onKapat} aria-label="Menüyü kapat">
              <IconX size={16} />
            </button>
          </div>
        </div>
        <BaslatMenuArama deger={arama} onDegistir={setArama} variant="modern" />
      </header>

      <div className="ap-baslat-modern-govde flex min-h-0 flex-1">
        {arama ? (
          <div className="ap-scroll ap-baslat-modern-icerik ap-baslat-modern-icerik-tam flex-1 overflow-y-auto">
            <p className="ap-baslat-modern-arama-etiket">Arama sonuçları <span className="ap-baslat-modern-sayi">{liste.length}</span></p>
            <ModernModulGrid moduller={liste} onSec={(modul) => { onModulSec(modul); onKapat(); }} />
          </div>
        ) : (
          <>
            <aside className="ap-baslat-modern-kategori-sutun ap-scroll">
              <p className="ap-baslat-modern-sutun-baslik">Kategoriler</p>
              <div className="ap-baslat-modern-kategori-kutular">
                {adminKategoriler.map((kategori) => {
                  const Ikon = KATEGORI_FLAT_IKONLARI[kategori as keyof typeof KATEGORI_FLAT_IKONLARI] ?? IconApps;
                  const aktif = seciliKategori === kategori;
                  const adet = aktifHavuz.filter((modul) => modul.kategori === kategori).length;
                  return (
                    <button key={kategori} type="button" className={`ap-baslat-modern-kategori-kutu ${aktif ? 'ap-baslat-modern-kategori-kutu-aktif' : ''}`} onClick={() => onKategoriSec(kategori)} aria-pressed={aktif}>
                      <span className="ap-baslat-modern-kategori-kutu-ikon"><Ikon size={16} stroke={1.8} /></span>
                      <span className="ap-baslat-modern-kategori-kutu-ad">{t(`kategori.${kategori}`, kategori)}</span>
                      <span className="ap-baslat-modern-kategori-kutu-sayi">{adet}</span>
                    </button>
                  );
                })}
              </div>
            </aside>
            <div className="ap-baslat-modern-modul-sutun ap-scroll flex min-w-0 flex-1 flex-col overflow-y-auto">
              {sadeceFavoriler && liste.length > 0 && <ModernModulGrid moduller={liste} onSec={(modul) => { onModulSec(modul); onKapat(); }} />}
              <p className="ap-baslat-modern-sutun-baslik">{t(`kategori.${seciliKategori}`, seciliKategori)}<span className="ap-baslat-modern-sayi">{liste.length}</span></p>
              {sadeceFavoriler ? <p className="ap-baslat-modern-bos">Henüz favori yok.</p> : <ModernModulGrid moduller={liste} onSec={(modul) => { onModulSec(modul); onKapat(); }} />}
            </div>
          </>
        )}
      </div>
      <footer className="ap-baslat-modern-alt-cubuk">
        <span>Modern Görünüm · {tamEkran ? 'Tam ekran' : 'Panel'}</span>
        <span>Sekme Yönetimi&apos;nden Değiştirebilirsiniz</span>
      </footer>
    </div>
  );
}

function ModernModulGrid({ moduller, onSec }: { moduller: AdminModul[]; onSec: (modul: AdminModul) => void }) {
  const { t } = usePanelDil();
  if (moduller.length === 0) return <p className="ap-baslat-modern-bos">Gösterilecek modül yok.</p>;
  return <div className="ap-baslat-modern-modul-kutular">{moduller.map((modul) => (
    <button key={modul.id} type="button" className="ap-baslat-modern-modul-kutu" onClick={() => onSec(modul)} title={t(`modul.${modul.id}`, modul.baslik)}>
      <span className="ap-baslat-modern-modul-kutu-ikon"><AdminModulIkonu modulId={modul.id} boyut={20} /></span>
      <span className="ap-baslat-modern-modul-kutu-ad">{t(`modul.${modul.id}`, modul.baslik)}</span>
    </button>
  ))}</div>;
}

function KlasikModulListesi({ baslik, kategori, moduller, onSec }: { baslik: string; kategori: string; moduller: AdminModul[]; onSec: (modul: AdminModul) => void }) {
  const { t } = usePanelDil();
  if (!moduller.length) return null;
  const KategoriIkonu = kategori ? KATEGORI_FLAT_IKONLARI[kategori as keyof typeof KATEGORI_FLAT_IKONLARI] ?? IconApps : null;
  return (
    <div className="ap-menu-kategori">
      <p className="ap-menu-kategori-baslik">
        {KategoriIkonu && <span className="ap-menu-kategori-ikon"><KategoriIkonu size={14} stroke={1.9} /></span>}
        {baslik}
      </p>
      <ul className="space-y-0.5">
        {moduller.map((modul) => <li key={modul.id}><button type="button" onClick={() => onSec(modul)} className="ap-menu-oge"><span className="ap-menu-oge-ikon"><AdminModulIkonu modulId={modul.id} /></span><span className="font-medium">{t(`modul.${modul.id}`, modul.baslik)}</span></button></li>)}
      </ul>
    </div>
  );
}
