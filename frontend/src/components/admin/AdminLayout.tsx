import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminSekmeler } from '@/hooks/useAdminSekmeler';
import { useAksiyonCubugu } from '@/hooks/useAksiyonCubugu';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { AdminAksiyonProvider, useAdminAksiyon } from '@/contexts/AdminAksiyonContext';
import { AdminUyariBildirimProvider } from '@/contexts/AdminUyariBildirimContext';
import { SiteAyarlariProvider } from '@/contexts/SiteAyarlariContext';
import { AdminTemaProvider, useAdminTema } from '@/contexts/AdminTemaContext';
import { AdminHeader } from './AdminHeader';
import { AltAksiyonCubugu } from './AltAksiyonCubugu';
import { modulBul, modulYolundanBul } from '@/data/adminMenuYapisi';
import { AdminModulIcerik } from './AdminModulIcerik';
import { adminLogApi } from '@/features/admin/adminSistemApi';
import { GirisSayfasi } from '@/pages/admin/GirisSayfasi';
import { ModulRehberSistemi } from '@/components/admin/ortak/ModulRehberSistemi';
import { PanelDilKabuk } from '@/components/admin/PanelDilKabuk';
import { sekmeAyarlariOku } from '@/utils/sekmePanelAyarlari';
import { kisayolAyarlariOku, klavyeOlayiEslesir } from '@/utils/kisayolAyarlari';
import type { AdminModul, AdminSekme } from '@/types/admin';
import '@/styles/adminTema.css';

const SITE_YONETIMI_MODULLERI = new Set(['header', 'hero', 'footer']);

interface AyriPencere {
  sekmeId: string;
  modulId: string;
  baslik: string;
}

function AdminPanelGovde() {
  const {
    sekmeler,
    aktifSekmeId,
    aktifModul,
    setAktifSekmeId,
    sekmeAc,
    sekmeKapat,
    sekmeTasi,
    sekmeBirlestir,
    kaydedilmediIsaretle,
  } = useAdminSekmeler();

  const { tema } = useAdminTema();
  const { focusModulId, setFocusModulId, aksiyonCalistir } = useAdminAksiyon();
  const location = useLocation();
  const navigate = useNavigate();
  const aksiyonlar = useAksiyonCubugu(focusModulId);
  const [sekmeAyarlari, setSekmeAyarlari] = useState(sekmeAyarlariOku);
  const [ayriPencereler, setAyriPencereler] = useState<AyriPencere[]>([]);
  const [rehberAcik, setRehberAcik] = useState(false);

  useEffect(() => {
    const handler = () => setSekmeAyarlari(sekmeAyarlariOku());
    window.addEventListener('ap-sekme-ayarlari-guncellendi', handler);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', handler);
  }, []);

  const aktifSekme = sekmeler.find((s) => s.id === aktifSekmeId);
  const splitSekmeler = useMemo(() => {
    if (!sekmeAyarlari.yanYanaAcilabilir || sekmeAyarlari.grupDavranisi !== 'yan-yana') return null;
    if (!aktifSekme?.grupId) return null;
    const gruptakiler = sekmeler.filter((s) => s.grupId === aktifSekme.grupId);
    return gruptakiler.length >= 2 ? gruptakiler.slice(0, 2) : null;
  }, [sekmeler, aktifSekme, sekmeAyarlari]);

  useEffect(() => {
    if (aktifModul?.id) setFocusModulId(aktifModul.id);
  }, [aktifModul?.id, setFocusModulId]);

  useEffect(() => {
    const harita = kisayolAyarlariOku();
    function tusHandler(e: KeyboardEvent) {
      const hedef = e.target as HTMLElement;
      if (hedef.tagName === 'INPUT' || hedef.tagName === 'TEXTAREA' || hedef.isContentEditable) {
        if (!e.ctrlKey && !e.metaKey && e.key !== 'F1') return;
      }

      if (klavyeOlayiEslesir(e, harita.rehber)) {
        e.preventDefault();
        setRehberAcik((a) => !a);
        return;
      }
      if (klavyeOlayiEslesir(e, harita.kaydet)) {
        e.preventDefault();
        void aksiyonCalistir('kaydet');
        return;
      }
      if (klavyeOlayiEslesir(e, harita.ekle)) {
        e.preventDefault();
        void aksiyonCalistir('ekle');
        return;
      }
      if (klavyeOlayiEslesir(e, harita.onizle)) {
        e.preventDefault();
        void aksiyonCalistir('onizle');
        return;
      }
      if (klavyeOlayiEslesir(e, harita.sil)) {
        e.preventDefault();
        void aksiyonCalistir('sil');
      }
    }

    window.addEventListener('keydown', tusHandler);
    return () => window.removeEventListener('keydown', tusHandler);
  }, [aksiyonCalistir, focusModulId]);

  function modulAcHandler(modul: AdminModul) {
    sekmeAc(modul);
    const hedef = modul.yol.replace(/\/+$/, '') || '/gt-admin';
    const mevcut = location.pathname.replace(/\/+$/, '') || '/gt-admin';
    if (mevcut !== hedef) navigate(hedef);
  }

  function modulSecHandler(modulId: string) {
    const modul = modulBul(modulId);
    if (modul) modulAcHandler(modul);
  }

  function sekmeSecHandler(sekmeId: string) {
    setAktifSekmeId(sekmeId);
    const sekme = sekmeler.find((s) => s.id === sekmeId);
    const modul = sekme ? modulBul(sekme.modulId) : undefined;
    if (!modul) return;
    const hedef = modul.yol.replace(/\/+$/, '') || '/gt-admin';
    const mevcut = location.pathname.replace(/\/+$/, '') || '/gt-admin';
    if (mevcut !== hedef) navigate(hedef);
  }

  useEffect(() => {
    const modul = modulYolundanBul(location.pathname);
    if (!modul) return;
    const aktifModulId = sekmeler.find((s) => s.id === aktifSekmeId)?.modulId;
    if (aktifModulId === modul.id) return;
    sekmeAc(modul);
  }, [location.pathname, aktifSekmeId, sekmeler, sekmeAc]);

  async function logKaydet(islem: string, modulId?: string, aksiyonId?: string) {
    try {
      await adminLogApi.kaydet({ islem, modulId, aksiyonId });
    } catch {
      // log hatasi paneli bloke etmesin
    }
  }

  async function aksiyonHandler(aksiyonId: string) {
    const modul = modulBul(focusModulId);
    const aksiyon = aksiyonlar.find((a) => a.id === aksiyonId);
    if (!aksiyon) return;

    await logKaydet(
      `${aksiyon.etiket}${modul ? ` - ${modul.baslik}` : ''}`,
      modul?.id,
      aksiyonId
    );
    await aksiyonCalistir(aksiyonId);
  }

  const sekmeAyir = useCallback(
    (sekmeId: string) => {
      const sekme = sekmeler.find((s) => s.id === sekmeId);
      if (!sekme) return;
      setAyriPencereler((p) => {
        if (p.some((x) => x.sekmeId === sekmeId)) return p;
        return [...p, { sekmeId, modulId: sekme.modulId, baslik: sekme.baslik }];
      });
    },
    [sekmeler]
  );

  function pencereKapat(sekmeId: string) {
    setAyriPencereler((p) => p.filter((x) => x.sekmeId !== sekmeId));
  }

  function pencereDock(sekmeId: string) {
    sekmeSecHandler(sekmeId);
    pencereKapat(sekmeId);
  }

  function icerikPanel(sekme: AdminSekme, odakli: boolean) {
    return (
      <div
        key={sekme.id}
        className={`ap-modul-panel min-h-0 flex-1 overflow-y-auto p-6 ${odakli ? 'ap-modul-panel-odak' : ''}`}
        onMouseDown={() => setFocusModulId(sekme.modulId)}
        onFocusCapture={() => setFocusModulId(sekme.modulId)}
      >
        <AdminModulIcerik modulId={sekme.modulId} onModulAc={modulSecHandler} />
      </div>
    );
  }

  return (
    <div className="admin-panel flex h-screen min-h-0 w-full flex-col overflow-hidden" data-tema={tema}>
      <AdminHeader
        sekmeler={sekmeler}
        aktifSekmeId={aktifSekmeId}
        onSekmeSec={sekmeSecHandler}
        onSekmeKapat={sekmeKapat}
        onSekmeTasi={sekmeTasi}
        onSekmeBirlestir={sekmeBirlestir}
        onModulSec={modulAcHandler}
        onSekmeAyir={sekmeAyarlari.surukleAyirPencere ? sekmeAyir : undefined}
      />

      <SiteAyarlariKirliIzleyici
        aktifSekmeId={aktifSekmeId}
        aktifModulId={aktifModul?.id}
        kaydedilmediIsaretle={kaydedilmediIsaretle}
      />

      <main className="ap-scroll flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-[var(--ap-bg)]">
        {splitSekmeler ? (
          <div className="flex min-h-0 flex-1 divide-x divide-[var(--ap-border)]">
            {splitSekmeler.map((sekme) =>
              icerikPanel(sekme, focusModulId === sekme.modulId)
            )}
          </div>
        ) : (
          aktifModul &&
          !ayriPencereler.some((p) => p.sekmeId === aktifSekmeId) &&
          icerikPanel(
            aktifSekme ?? { id: aktifSekmeId, modulId: aktifModul.id, baslik: aktifModul.baslik },
            true
          )
        )}
        <Outlet context={{ aktifModul }} />
      </main>

      {ayriPencereler.map((pencere) => (
        <div key={pencere.sekmeId} className="ap-ayri-pencere">
          <div className="ap-ayri-pencere-baslik flex items-center justify-between">
            <span className="ap-heading text-sm font-semibold">{pencere.baslik}</span>
            <div className="flex gap-2">
              <button type="button" className="text-xs text-blue-400 hover:underline" onClick={() => pencereDock(pencere.sekmeId)}>
                Dock et
              </button>
              <button type="button" className="text-xs text-slate-400 hover:text-white" onClick={() => pencereKapat(pencere.sekmeId)}>
                ×
              </button>
            </div>
          </div>
          <div
            className="ap-ayri-pencere-icerik overflow-y-auto p-4"
            onMouseDown={() => setFocusModulId(pencere.modulId)}
          >
            <AdminModulIcerik modulId={pencere.modulId} onModulAc={modulSecHandler} />
          </div>
        </div>
      ))}

      <AltAksiyonCubugu
        aksiyonlar={aksiyonlar}
        onAksiyon={(id) => void aksiyonHandler(id)}
        onModulAc={modulSecHandler}
        focusModulId={focusModulId}
        onRehberAc={() => setRehberAcik(true)}
      />

      <ModulRehberSistemi modulId={focusModulId} zorlaAcik={rehberAcik} onAcikDegisti={setRehberAcik} gizliButon />
    </div>
  );
}

function AdminLayoutIcerik() {
  const { kullanici, yukleniyor } = useAuth();
  const { tema } = useAdminTema();

  if (yukleniyor) {
    return (
      <div className="admin-panel flex h-screen items-center justify-center" data-tema={tema}>
        <span className="ap-muted">Yükleniyor...</span>
      </div>
    );
  }

  if (!kullanici) {
    return <GirisSayfasi />;
  }

  return (
    <SiteAyarlariProvider>
      <AdminPanelGovde />
    </SiteAyarlariProvider>
  );
}

function SiteAyarlariKirliIzleyici({
  aktifSekmeId,
  aktifModulId,
  kaydedilmediIsaretle,
}: {
  aktifSekmeId: string;
  aktifModulId?: string;
  kaydedilmediIsaretle: (id: string, kirli: boolean) => void;
}) {
  const { kirli } = useSiteAyarlariYonetimi();
  const siteYonetimiAktif = Boolean(aktifModulId && SITE_YONETIMI_MODULLERI.has(aktifModulId));

  useEffect(() => {
    if (!siteYonetimiAktif) return;
    kaydedilmediIsaretle(aktifSekmeId, kirli);
  }, [siteYonetimiAktif, aktifSekmeId, kirli, kaydedilmediIsaretle]);

  return null;
}

export function AdminLayout() {
  return (
    <AdminTemaProvider>
      <AdminAksiyonProvider>
        <AdminUyariBildirimProvider>
          <PanelDilKabuk>
            <AdminLayoutIcerik />
          </PanelDilKabuk>
        </AdminUyariBildirimProvider>
      </AdminAksiyonProvider>
    </AdminTemaProvider>
  );
}
