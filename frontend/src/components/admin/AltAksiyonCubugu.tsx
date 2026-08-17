import { useRef, useState, type RefObject } from 'react';
import type { AksiyonButonu } from '@/types/admin';
import { GorevCubuguTray } from './GorevCubuguTray';
import { SaatTakvimWidget } from './SaatTakvimWidget';
import { modulRehberBul } from '@/data/adminModulRehberleri';
import { BildirimPaneli, useBildirimSayaci } from './BildirimPaneli';
import { LogPaneli } from './LogPaneli';
import { YedeklemeHizliPaneli } from './YedeklemeHizliPaneli';
import { useAdminAksiyon } from '@/contexts/AdminAksiyonContext';
import { useAdminTema } from '@/contexts/AdminTemaContext';
import { kisayolAyarlariOku } from '@/utils/kisayolAyarlari';
import {
  AksiyonCubuguPanelProvider,
  AksiyonCubuguUstCizgiSlot,
  useAksiyonCubuguPanelAcik,
} from './aksiyon-cubugu/AksiyonCubuguPanelContext';

interface AltAksiyonCubuguProps {
  aksiyonlar: AksiyonButonu[];
  onAksiyon?: (id: string) => void;
  onModulAc?: (modulId: string) => void;
  focusModulId?: string;
  onRehberAc?: () => void;
}

type AcikPanel = 'bildirim' | 'log' | 'yedek' | null;

function AltAksiyonCubuguGovde({
  footerRef,
  aksiyonlar,
  onAksiyon,
  onModulAc,
  focusModulId = 'dashboard',
  onRehberAc,
}: AltAksiyonCubuguProps & { footerRef: RefObject<HTMLElement | null> }) {
  const panelAcik = useAksiyonCubuguPanelAcik();
  const rehber = modulRehberBul(focusModulId);
  const rehberKisayolu = kisayolAyarlariOku().rehber;
  const [acikPanel, setAcikPanel] = useState<AcikPanel>(null);
  const { okunmamisSayi, yenile } = useBildirimSayaci();
  const { aksiyonGeriBildirim } = useAdminAksiyon();
  const { temaDegistir, koyuMu } = useAdminTema();

  function panelAc(panel: AcikPanel) {
    setAcikPanel((onceki) => (onceki === panel ? null : panel));
    if (panel === 'bildirim') void yenile();
  }

  return (
    <footer
      ref={footerRef}
      className={`ap-footer ap-gorev-cubugu flex h-12 shrink-0 items-center gap-2 px-3${panelAcik ? ' ap-gorev-cubugu--panel-acik' : ''}`}
      data-ap-kesif="aksiyon-cubugu"
    >
      <AksiyonCubuguUstCizgiSlot footerRef={footerRef} />
      <div className="ap-aksiyon-cubugu-sol flex min-w-0 flex-1 self-stretch items-stretch gap-0 overflow-x-auto">
        {aksiyonlar.map((aksiyon) => {
          const geriBildirim =
            aksiyonGeriBildirim?.aksiyonId === aksiyon.id ? aksiyonGeriBildirim : null;
          const etiket = geriBildirim?.mesaj ?? aksiyon.etiket;

          return (
            <button
              key={aksiyon.id}
              type="button"
              disabled={!aksiyon.aktif && !geriBildirim}
              onClick={() => onAksiyon?.(aksiyon.id)}
              className={`ap-aksiyon-btn shrink-0 whitespace-nowrap text-sm font-medium ${
                geriBildirim?.tur === 'basari'
                  ? 'ap-aksiyon-basari'
                  : geriBildirim?.tur === 'hata'
                    ? 'ap-aksiyon-hata'
                    : !aksiyon.aktif
                      ? 'ap-aksiyon-pasif cursor-not-allowed opacity-40'
                      : aksiyon.birincil
                        ? 'ap-aksiyon-birincil'
                        : 'ap-aksiyon-aktif'
              }`}
            >
              <span className="ap-aksiyon-harf" data-etiket={etiket}>{etiket}</span>
            </button>
          );
        })}
      </div>

      <div className="ap-aksiyon-cubugu-sag relative flex shrink-0 items-center gap-2 border-l border-[var(--ap-border)] pl-3">
        <button
          type="button"
          onClick={temaDegistir}
          className="ap-tray-ikon ap-tema-degistir-btn"
          title={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
          aria-label={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
        >
          {koyuMu ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 14.5A8.5 8.5 0 1114.5 3a6.5 6.5 0 006.5 11.5z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onRehberAc}
          className="ap-tray-ikon"
          title={`${rehber.baslik} — Rehber (${rehberKisayolu})`}
          aria-label="Sayfa rehberini aç"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M9.75 9.6a2.25 2.25 0 014.28.85c0 1.5-2.15 1.75-2.15 3.15" />
            <circle cx="12" cy="16.55" r="0.85" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <GorevCubuguTray
          logAcik={acikPanel === 'log'}
          yedekAcik={acikPanel === 'yedek'}
          onLogToggle={() => panelAc('log')}
          onYedekToggle={() => panelAc('yedek')}
        />
        <button
          type="button"
          className={`ap-tray-ikon ap-tray-bildirim-btn relative ${acikPanel === 'bildirim' ? 'ap-tray-ikon-aktif' : ''}`}
          title="Bildirimler"
          aria-label="Bildirimler"
          onClick={() => panelAc('bildirim')}
          data-ap-kesif="bildirim-tray"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .53-.21 1.04-.59 1.4L4 17h5m6 0a3 3 0 11-6 0" />
          </svg>
          {okunmamisSayi > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {okunmamisSayi > 9 ? '9+' : okunmamisSayi}
            </span>
          )}
        </button>
        <BildirimPaneli
          acik={acikPanel === 'bildirim'}
          onKapat={() => setAcikPanel(null)}
          onGuncelle={yenile}
        />
        <LogPaneli
          acik={acikPanel === 'log'}
          onKapat={() => setAcikPanel(null)}
          onModulAc={onModulAc}
        />
        <YedeklemeHizliPaneli
          acik={acikPanel === 'yedek'}
          onKapat={() => setAcikPanel(null)}
          onModulAc={onModulAc}
        />
        <SaatTakvimWidget />
      </div>
    </footer>
  );
}

export function AltAksiyonCubugu(props: AltAksiyonCubuguProps) {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <AksiyonCubuguPanelProvider>
      <AltAksiyonCubuguGovde footerRef={footerRef} {...props} />
    </AksiyonCubuguPanelProvider>
  );
}
