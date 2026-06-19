import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { adminBildirimleriYenile } from '@/utils/adminBildirimOlaylari';
import { GirisSayfasi } from '@/pages/admin/GirisSayfasi';
import { ModulRehberSistemi } from '@/components/admin/ortak/ModulRehberSistemi';
import { SistemKesifProvider, useSistemKesifOptional } from '@/contexts/SistemKesifContext';
import { SagTikPanelProvider } from '@/contexts/SagTikPanelContext';
import { AdminSagTikMenu } from '@/components/admin/sagTik/AdminSagTikMenu';
import { PanelDilKabuk } from '@/components/admin/PanelDilKabuk';
import { sekmeAyarlariOku, splitSekmeleriHesapla } from '@/utils/sekmePanelAyarlari';
import { kisayolAyarlariOku, klavyeOlayiEslesir } from '@/utils/kisayolAyarlari';
import type { AdminModul, AdminSekme } from '@/types/admin';
import '@/styles/adminTema.css';

const SITE_YONETIMI_MODULLERI = new Set(['header', 'kategoriler', 'hero', 'footer']);

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

  const { tema, temaDegistir } = useAdminTema();
  const { focusModulId, setFocusModulId, aksiyonCalistir } = useAdminAksiyon();
  const location = useLocation();
  const navigate = useNavigate();
  const aksiyonlar = useAksiyonCubugu(focusModulId);
  const [sekmeAyarlari, setSekmeAyarlari] = useState(sekmeAyarlariOku);
  const [ayriPencereler, setAyriPencereler] = useState<AyriPencere[]>([]);
  const [rehberAcik, setRehberAcik] = useState(false);
  /** Kapatılan sekmenin modülü — URL gecikince useEffect'in sekmeyi yeniden açmasını engeller */
  const sonKapatilanModulRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = () => setSekmeAyarlari(sekmeAyarlariOku());
    window.addEventListener('ap-sekme-ayarlari-guncellendi', handler);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', handler);
  }, []);

  const aktifSekme = sekmeler.find((s) => s.id === aktifSekmeId);
  const splitSekmeler = useMemo(
    () => splitSekmeleriHesapla(sekmeler, aktifSekme, sekmeAyarlari.yanYanaAcilabilir),
    [sekmeler, aktifSekme, sekmeAyarlari.yanYanaAcilabilir]
  );

  useEffect(() => {
    if (aktifModul?.id) setFocusModulId(aktifModul.id);
  }, [aktifModul?.id, setFocusModulId]);

  useEffect(() => {
    function tusHandler(e: KeyboardEvent) {
      const harita = kisayolAyarlariOku();
      const hedef = e.target as HTMLElement;
      const inputIcinde =
        hedef.tagName === 'INPUT' || hedef.tagName === 'TEXTAREA' || hedef.isContentEditable;
      const rehberTusu = klavyeOlayiEslesir(e, harita.rehber);

      if (inputIcinde && !e.ctrlKey && !e.metaKey && !rehberTusu) return;

      if (rehberTusu) {
        e.preventDefault();
        setRehberAcik(true);
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
    if (modul) {
      setFocusModulId(modulId);
      modulAcHandler(modul);
    }
  }

  function sekmeKapatHandler(sekmeId: string) {
    if (sekmeler.length <= 1) return;

    const kapatilan = sekmeler.find((s) => s.id === sekmeId);
    if (!kapatilan) return;

    const kapatildiAktif = aktifSekmeId === sekmeId;
    const mevcutPathModul = modulYolundanBul(location.pathname);
    const urlKapaliModulleEslesiyor = mevcutPathModul?.id === kapatilan.modulId;

    let hedefModul: AdminModul | undefined;
    if (kapatildiAktif) {
      const idx = sekmeler.findIndex((s) => s.id === sekmeId);
      const komşu = sekmeler[idx + 1] ?? sekmeler[idx - 1];
      hedefModul = komşu ? modulBul(komşu.modulId) : undefined;
    } else if (urlKapaliModulleEslesiyor) {
      const aktifKalan = sekmeler.find((s) => s.id === aktifSekmeId && s.id !== sekmeId);
      hedefModul = aktifKalan ? modulBul(aktifKalan.modulId) : undefined;
    }

    sonKapatilanModulRef.current = kapatilan.modulId;

    if ((kapatildiAktif || urlKapaliModulleEslesiyor) && hedefModul) {
      const hedef = hedefModul.yol.replace(/\/+$/, '') || '/gt-admin';
      navigate(hedef, { replace: true });
    }

    sekmeKapat(sekmeId);
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

    if (sonKapatilanModulRef.current) {
      if (sonKapatilanModulRef.current === modul.id) return;
      sonKapatilanModulRef.current = null;
    }

    const aktifModulId = sekmeler.find((s) => s.id === aktifSekmeId)?.modulId;
    if (aktifModulId === modul.id) return;

    const mevcutSekme = sekmeler.find((s) => s.modulId === modul.id);
    if (mevcutSekme) {
      setAktifSekmeId(mevcutSekme.id);
      return;
    }

    sekmeAc(modul);
  }, [location.pathname, aktifSekmeId, sekmeler, sekmeAc, setAktifSekmeId]);

  async function logKaydet(islem: string, modulId?: string, aksiyonId?: string) {
    try {
      await adminLogApi.kaydet({ islem, modulId, aksiyonId });
      adminBildirimleriYenile();
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

  function icerikPanel(sekme: AdminSekme, sekmeAktif: boolean, split = false) {
    return (
      <div
        key={sekme.id}
        className={`ap-sekme-split-pane flex min-h-0 min-w-0 flex-1 flex-col ${sekmeAktif ? 'ap-modul-panel-odak' : ''}`}
      >
        {split && (
          <div
            className="ap-sekme-split-baslik flex shrink-0 items-center border-b px-4 py-2 text-xs font-semibold"
            style={{ borderColor: 'var(--ap-border)', background: 'var(--ap-surface)', color: 'var(--ap-heading)' }}
          >
            {sekme.baslik}
          </div>
        )}
        <div
          className="ap-modul-panel min-h-0 flex-1 overflow-y-auto p-6"
          data-ap-kesif="modul-icerik"
          data-ap-kesif-modul={sekme.modulId}
          data-ap-kesif-aktif={sekmeAktif ? 'true' : undefined}
          onMouseDown={() => setFocusModulId(sekme.modulId)}
          onFocusCapture={() => setFocusModulId(sekme.modulId)}
        >
          <AdminModulIcerik modulId={sekme.modulId} onModulAc={modulSecHandler} />
        </div>
      </div>
    );
  }

  return (
    <SistemKesifProvider onModulAc={modulSecHandler}>
    <div className="admin-panel flex h-screen min-h-0 w-full flex-col overflow-hidden" data-tema={tema}>
      <AdminHeader
        sekmeler={sekmeler}
        aktifSekmeId={aktifSekmeId}
        onSekmeSec={sekmeSecHandler}
        onSekmeKapat={sekmeKapatHandler}
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
          <div className="ap-sekme-split-alan flex min-h-0 flex-1">
            {splitSekmeler.map((sekme) => icerikPanel(sekme, aktifSekmeId === sekme.id, true))}
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

      <AdminSagTikMenuKabuk
        onModulAc={modulSecHandler}
        onKaydet={() => void aksiyonCalistir('kaydet')}
        onOnizle={() => void aksiyonCalistir('onizle')}
        onTemaDegistir={temaDegistir}
      />
    </div>
    </SistemKesifProvider>
  );
}

function AdminSagTikMenuKabuk({
  onModulAc,
  onKaydet,
  onOnizle,
  onTemaDegistir,
}: {
  onModulAc: (modulId: string) => void;
  onKaydet: () => void;
  onOnizle: () => void;
  onTemaDegistir: () => void;
}) {
  const kesif = useSistemKesifOptional();
  const aksiyonlar = useMemo(
    () => ({
      onModulAc,
      onKaydet,
      onOnizle,
      onTemaDegistir,
      onSistemKesif: () => kesif?.modalAc(),
    }),
    [onModulAc, onKaydet, onOnizle, onTemaDegistir, kesif]
  );
  return <AdminSagTikMenu aksiyonlar={aksiyonlar} />;
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
      <SagTikPanelProvider>
        <AdminPanelGovde />
      </SagTikPanelProvider>
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
