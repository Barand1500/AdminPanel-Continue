import type { AksiyonButonu } from '@/types/admin';
import { GorevCubuguTray } from './GorevCubuguTray';
import { SaatTakvimWidget } from './SaatTakvimWidget';
import { modulRehberBul } from '@/data/adminModulRehberleri';
import { BildirimPaneli, useBildirimSayaci } from './BildirimPaneli';
import { useState } from 'react';

interface AltAksiyonCubuguProps {
  aksiyonlar: AksiyonButonu[];
  onAksiyon?: (id: string) => void;
  onYedekle?: () => void;
  onLoglar?: () => void;
  onTamEkranYedekle?: () => void;
  onTamEkranLoglar?: () => void;
  focusModulId?: string;
  onRehberAc?: () => void;
}

export function AltAksiyonCubugu({
  aksiyonlar,
  onAksiyon,
  onYedekle,
  onLoglar,
  onTamEkranYedekle,
  onTamEkranLoglar,
  focusModulId = 'dashboard',
  onRehberAc,
}: AltAksiyonCubuguProps) {
  const rehber = modulRehberBul(focusModulId);
  const [panelAcik, setPanelAcik] = useState(false);
  const { okunmamisSayi, yenile } = useBildirimSayaci();

  return (
    <footer className="ap-footer ap-gorev-cubugu flex h-12 shrink-0 items-center gap-2 border-t px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        {aksiyonlar.map((aksiyon) => (
          <button
            key={aksiyon.id}
            type="button"
            disabled={!aksiyon.aktif}
            onClick={() => onAksiyon?.(aksiyon.id)}
            className={`ap-aksiyon-btn shrink-0 rounded px-4 py-1.5 text-sm font-medium transition ${
              !aksiyon.aktif
                ? 'ap-aksiyon-pasif cursor-not-allowed opacity-40'
                : aksiyon.birincil
                  ? 'ap-aksiyon-birincil bg-blue-600 text-white hover:bg-blue-500'
                  : 'ap-aksiyon-aktif border border-slate-500 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {aksiyon.etiket}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-l border-[var(--ap-border)] pl-3">
        <button
          type="button"
          onClick={onRehberAc}
          className="ap-rehber-cubuk-btn"
          title={`${rehber.baslik} — Rehber (F1)`}
          aria-label="Sayfa rehberini aç"
        >
          ?
        </button>
        {onYedekle && onLoglar && (
          <GorevCubuguTray
            onYedekle={onYedekle}
            onLoglar={onLoglar}
            onTamEkranYedekle={onTamEkranYedekle}
            onTamEkranLoglar={onTamEkranLoglar}
          />
        )}
        <button
          type="button"
          className="ap-tray-bildirim-btn relative"
          title="Bildirimler"
          aria-label="Bildirimler"
          onClick={() => {
            setPanelAcik((o) => !o);
            void yenile();
          }}
        >
          🔔
          {okunmamisSayi > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {okunmamisSayi > 9 ? '9+' : okunmamisSayi}
            </span>
          )}
        </button>
        <BildirimPaneli acik={panelAcik} onKapat={() => setPanelAcik(false)} />
        <SaatTakvimWidget />
      </div>
    </footer>
  );
}
