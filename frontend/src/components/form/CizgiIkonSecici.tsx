import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { IconChevronDown } from '@tabler/icons-react';
import {
  CIZGI_IKON_SECENEKLERI,
  CizgiIkon,
  cizgiIkonSecenegiBul,
  type CizgiIkonYedegi,
} from '@/components/widget/CizgiIkonlari';

interface CizgiIkonSeciciProps {
  /** Kaydedilmiş sabit ikon anahtarı. Eski emoji/metin değerleri de okunabilir. */
  deger?: string | null;
  /** Seçilen sabit ikon anahtarını kaydeder. */
  onChange: (ikon: CizgiIkonYedegi) => void;
  /** Boş veya eski değerde görünecek seçim. */
  varsayilan?: CizgiIkonYedegi;
  etiket?: string;
  disabled?: boolean;
}

/**
 * Emoji girişi yerine sabit, sitede de kullanılan çizgi ikonları seçtirir.
 * Açılır alan klavye ile kullanılabilir; Escape ve dışarı tıklama ile kapanır.
 */
export function CizgiIkonSecici({
  deger,
  onChange,
  varsayilan = 'basari',
  etiket = 'İkon seç',
  disabled = false,
}: CizgiIkonSeciciProps) {
  const [acik, setAcik] = useState(false);
  const [panelKonumu, setPanelKonumu] = useState<{
    top: number;
    left: number;
    width: number;
    arkaPlan: string;
    kenarlik: string;
    metin: string;
    solukMetin: string;
    vurgu: string;
    girdi: string;
  } | null>(null);
  const kapsayiciRef = useRef<HTMLDivElement>(null);
  const tetikRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const aciklamaId = useId();
  const secili = cizgiIkonSecenegiBul(deger) ?? cizgiIkonSecenegiBul(varsayilan)!;

  function paneliKonumlandir() {
    const tetik = tetikRef.current;
    if (!tetik) return;
    const dikdortgen = tetik.getBoundingClientRect();
    const stil = getComputedStyle(kapsayiciRef.current ?? tetik);
    setPanelKonumu({
      top: Math.min(dikdortgen.bottom + 8, window.innerHeight - 190),
      left: Math.max(12, Math.min(dikdortgen.left, window.innerWidth - 332)),
      width: Math.min(Math.max(dikdortgen.width, 320), window.innerWidth - 24),
      arkaPlan: stil.getPropertyValue('--ap-surface').trim() || '#1e293b',
      kenarlik: stil.getPropertyValue('--ap-border').trim() || '#475569',
      metin: stil.getPropertyValue('--ap-text').trim() || '#e2e8f0',
      solukMetin: stil.getPropertyValue('--ap-text-muted').trim() || '#94a3b8',
      vurgu: stil.getPropertyValue('--ap-accent').trim() || '#3b82f6',
      girdi: stil.getPropertyValue('--ap-input-bg').trim() || '#0f172a',
    });
  }

  useLayoutEffect(() => {
    if (!acik) {
      setPanelKonumu(null);
      return;
    }
    paneliKonumlandir();
  }, [acik]);

  useEffect(() => {
    if (!acik) return;

    function disariTikla(event: MouseEvent) {
      const hedef = event.target as Node;
      if (!kapsayiciRef.current?.contains(hedef) && !panelRef.current?.contains(hedef)) setAcik(false);
    }

    function klavye(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setAcik(false);
      tetikRef.current?.focus();
    }

    document.addEventListener('mousedown', disariTikla);
    document.addEventListener('keydown', klavye);
    window.addEventListener('resize', paneliKonumlandir);
    window.addEventListener('scroll', paneliKonumlandir, true);
    return () => {
      document.removeEventListener('mousedown', disariTikla);
      document.removeEventListener('keydown', klavye);
      window.removeEventListener('resize', paneliKonumlandir);
      window.removeEventListener('scroll', paneliKonumlandir, true);
    };
  }, [acik]);

  function sec(ikon: CizgiIkonYedegi) {
    onChange(ikon);
    setAcik(false);
    tetikRef.current?.focus();
  }

  return (
    <div ref={kapsayiciRef} className="relative">
      <button
        ref={tetikRef}
        type="button"
        className={`ap-input flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm outline-none transition focus:border-[var(--ap-accent)] focus:ring-1 focus:ring-[var(--ap-accent)] ${
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-[var(--ap-accent)]'
        }`}
        onClick={() => setAcik((onceki) => !onceki)}
        aria-haspopup="dialog"
        aria-expanded={acik}
        aria-controls={acik ? panelId : undefined}
        aria-describedby={aciklamaId}
        aria-label={etiket}
        disabled={disabled}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--ap-accent)_16%,transparent)] text-[var(--ap-accent)]">
          <CizgiIkon deger={secili.id} yedek={varsayilan} boyut={19} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[var(--ap-text)]">{secili.etiket}</span>
        <IconChevronDown
          aria-hidden
          size={17}
          className={`shrink-0 text-[var(--ap-text-muted)] transition-transform ${acik ? 'rotate-180' : ''}`}
        />
      </button>
      <span id={aciklamaId} className="sr-only">
        Seçili çizgi ikon: {secili.etiket}
      </span>

      {acik && panelKonumu && typeof document !== 'undefined' && createPortal(
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={`${etiket}: çizgi ikon seçimi`}
          style={{
            position: 'fixed',
            top: panelKonumu.top,
            left: panelKonumu.left,
            width: panelKonumu.width,
            backgroundColor: panelKonumu.arkaPlan,
            borderColor: panelKonumu.kenarlik,
            color: panelKonumu.metin,
            '--ap-text': panelKonumu.metin,
            '--ap-text-muted': panelKonumu.solukMetin,
            '--ap-accent': panelKonumu.vurgu,
            '--ap-input-bg': panelKonumu.girdi,
            '--ap-border': panelKonumu.kenarlik,
            zIndex: 2147483000,
            opacity: 1,
            isolation: 'isolate',
          } as CSSProperties}
          className="rounded-xl border p-3 shadow-2xl"
        >
          <p className="mb-2 text-xs text-[var(--ap-text-muted)]">Sitede görünecek çizgi ikonu seçin.</p>
          <div
            role="radiogroup"
            aria-label="Çizgi ikon seçenekleri"
            className="grid grid-cols-4 gap-1"
          >
            {CIZGI_IKON_SECENEKLERI.map((secenek) => {
              const seciliMi = secenek.id === secili.id;
              return (
                <button
                  key={secenek.id}
                  type="button"
                  role="radio"
                  aria-checked={seciliMi}
                  aria-label={secenek.etiket}
                  title={secenek.etiket}
                  onClick={() => sec(secenek.id)}
                  className={`flex min-h-8 items-center gap-1.5 rounded-lg border px-1.5 py-1 text-left text-[11px] transition focus:outline-none focus:ring-2 focus:ring-[var(--ap-accent)] ${
                    seciliMi
                      ? 'border-[var(--ap-accent)] bg-[color-mix(in_srgb,var(--ap-accent)_18%,transparent)] text-[var(--ap-accent)]'
                      : 'border-transparent text-[var(--ap-text-muted)] hover:border-[var(--ap-border)] hover:bg-[var(--ap-input-bg)] hover:text-[var(--ap-text)]'
                  }`}
                >
                  <CizgiIkon deger={secenek.id} yedek={secenek.id} boyut={18} />
                  <span className="min-w-0 truncate">{secenek.etiket}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-[var(--ap-text-muted)]">{secili.etiket}</p>
        </div>,
        document.body,
      )}
    </div>
  );
}
