import { useEffect, useMemo, useRef, useState, useCallback, type DragEvent, type MouseEvent } from 'react';
import type { AdminModul, AdminSekme } from '@/types/admin';
import {
  sekmeAyarlariOku,
  type SekmePanelAyarlari,
} from '@/utils/sekmePanelAyarlari';
import { SekmeCubuguArama } from './SekmeCubuguArama';
import { AnimasyonluKenarlik } from './AnimasyonluKenarlik';
import { AdminModulIkonu } from './AdminModulIkonu';

interface UstSekmeCubuguProps {
  sekmeler: AdminSekme[];
  aktifSekmeId: string;
  onSekmeSec: (id: string) => void;
  onSekmeKapat: (id: string) => void;
  onSekmeTasi: (kaynakId: string, hedefId: string, mod: 'once' | 'sonra') => void;
  onSekmeBirlestir: (kaynakId: string, hedefId: string) => void;
  sekmeAyarlari?: SekmePanelAyarlari;
  onSekmeAyir?: (sekmeId: string) => void;
  onModulSec?: (modul: AdminModul) => void;
  baslatMenuAcik?: boolean;
}

type GrupOgesi =
  | { tip: 'tek'; sekme: AdminSekme }
  | { tip: 'grup'; grupId: string; sekmeler: AdminSekme[] };

type DropMod = 'once' | 'sonra' | 'grup';

const SURUKLE_AYIR_ESIK = 48;

function sekmeleriGrupla(sekmeler: AdminSekme[]): GrupOgesi[] {
  const ogeler: GrupOgesi[] = [];
  const islenenGrup = new Set<string>();

  for (const sekme of sekmeler) {
    if (sekme.grupId) {
      if (islenenGrup.has(sekme.grupId)) continue;
      islenenGrup.add(sekme.grupId);
      ogeler.push({
        tip: 'grup',
        grupId: sekme.grupId,
        sekmeler: sekmeler.filter((s) => s.grupId === sekme.grupId),
      });
    } else {
      ogeler.push({ tip: 'tek', sekme });
    }
  }
  return ogeler;
}

function dropModHesapla(e: DragEvent, hedefId: string, surukleniyor: string | null): DropMod | null {
  if (!surukleniyor || surukleniyor === hedefId) return null;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const oran = (e.clientX - rect.left) / rect.width;
  if (oran < 0.28) return 'once';
  if (oran > 0.72) return 'sonra';
  return 'grup';
}

function SekmeButonu({
  sekme,
  aktif,
  gruplu,
  surukleniyor,
  dropHedef,
  dropMod,
  hoverOnizleme,
  gorunumModu,
  kareYerlesim,
  baslatMenuAcik,
  kenarlikAnimKey,
  onSekmeSec,
  onSekmeKapat,
  sekmelerUzunluk,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  sekme: AdminSekme;
  aktif: boolean;
  gruplu?: boolean;
  surukleniyor: string | null;
  dropHedef: string | null;
  dropMod: DropMod | null;
  hoverOnizleme: boolean;
  gorunumModu: SekmePanelAyarlari['sekmeGorunumModu'];
  kareYerlesim: boolean;
  baslatMenuAcik: boolean;
  kenarlikAnimKey: number;
  onSekmeSec: (id: string) => void;
  onSekmeKapat: (id: string) => void;
  sekmelerUzunluk: number;
  onDragStart: (e: DragEvent, id: string) => void;
  onDragOver: (e: DragEvent, id: string) => void;
  onDrop: (e: DragEvent, id: string) => void;
  onDragEnd: () => void;
  onPointerDown: (e: MouseEvent, id: string) => void;
  onPointerMove: (e: MouseEvent) => void;
  onPointerUp: () => void;
}) {
  const tasinan = surukleniyor === sekme.id;
  const hedef = dropHedef === sekme.id;
  const isimGoster = gorunumModu === 'isim' || gorunumModu === 'ikon-isim';
  const ikonGoster = gorunumModu === 'ikon' || gorunumModu === 'ikon-isim';
  const tabRef = useRef<HTMLDivElement>(null);
  const sekmeVurgulu = aktif && !baslatMenuAcik;

  function sekmeSecTikla(e: MouseEvent) {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSekmeSec(sekme.id);
  }

  return (
    <div
      ref={tabRef}
      draggable
      onDragStart={(e) => onDragStart(e, sekme.id)}
      onDragOver={(e) => onDragOver(e, sekme.id)}
      onDrop={(e) => onDrop(e, sekme.id)}
      onDragEnd={onDragEnd}
      onMouseDown={(e) => onPointerDown(e, sekme.id)}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      title={hoverOnizleme ? sekme.baslik : undefined}
      className={`ap-sekme-tab group relative flex max-w-[200px] shrink-0 cursor-grab items-center rounded-t-md border border-b-0 active:cursor-grabbing ${kareYerlesim ? 'aspect-square !max-w-none !rounded-md border' : ''} ${
        gruplu ? 'rounded-none first:rounded-tl-md last:rounded-tr-md' : ''
      } ${
        sekmeVurgulu
          ? 'ap-sekme-tab--kenarlik-aktif border-[var(--ap-border)] bg-[var(--ap-tab-active)] text-[var(--ap-heading)] shadow-sm'
          : aktif
            ? 'border-[var(--ap-border)] bg-[var(--ap-tab-active)] text-[var(--ap-heading)] shadow-sm'
            : 'border-transparent bg-[var(--ap-tab-idle)] text-[var(--ap-text-muted)] hover:bg-[var(--ap-hover)]'
      } ${tasinan ? 'opacity-50' : ''} ${
        hedef && dropMod === 'grup' ? 'ap-sekme-drop-grup' : ''
      } ${hedef && dropMod === 'once' ? 'ap-sekme-drop-once' : ''} ${
        hedef && dropMod === 'sonra' ? 'ap-sekme-drop-sonra' : ''
      }`}
      style={{ minHeight: 'var(--ap-tab-height, 2rem)', fontSize: 'var(--ap-tab-font-size, 0.75rem)' }}
    >
      {sekmeVurgulu && (
        <AnimasyonluKenarlik
          animasyonAnahtar={`${sekme.id}-${kenarlikAnimKey}`}
          kapsayiciRef={tabRef}
          ustYaricap={6}
        />
      )}
      <button
        type="button"
        draggable={false}
        className={`ap-sekme-tab-sec flex min-h-[inherit] min-w-0 flex-1 cursor-pointer items-center gap-1 truncate px-3 py-1.5 ${kareYerlesim ? 'justify-center !px-1' : ''}`}
        onMouseDown={sekmeSecTikla}
      >
        {sekme.kaydedilmedi && (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" title="Kaydedilmemiş değişiklik" />
        )}
        {ikonGoster && (
          <span className="shrink-0 leading-none text-[var(--ap-text-muted)]">
            <AdminModulIkonu modulId={sekme.modulId} boyut={15} />
          </span>
        )}
        {isimGoster && <span className="truncate">{sekme.baslik}</span>}
        {!isimGoster && !ikonGoster && <span className="truncate">{sekme.baslik}</span>}
      </button>
      {sekmelerUzunluk > 1 && (
        <button
          type="button"
          draggable={false}
          onClick={(e) => {
            e.stopPropagation();
            onSekmeKapat(sekme.id);
          }}
          className="ap-sekme-tab-kapat mr-1 shrink-0 rounded px-1 text-sm leading-none opacity-60 transition hover:bg-[var(--ap-hover)] hover:opacity-100 group-hover:opacity-100"
          aria-label="Sekmeyi kapat"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function UstSekmeCubugu({
  sekmeler,
  aktifSekmeId,
  onSekmeSec,
  onSekmeKapat,
  onSekmeTasi,
  onSekmeBirlestir,
  sekmeAyarlari: disAyarlari,
  onSekmeAyir,
  onModulSec,
  baslatMenuAcik = false,
}: UstSekmeCubuguProps) {
  const [ayarlar, setAyarlar] = useState<SekmePanelAyarlari>(() => disAyarlari ?? sekmeAyarlariOku());
  const [surukleniyor, setSurukleniyor] = useState<string | null>(null);
  const [dropHedef, setDropHedef] = useState<string | null>(null);
  const [dropMod, setDropMod] = useState<DropMod | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [kenarlikAnimKey, setKenarlikAnimKey] = useState(0);
  const surukleBaslangic = useRef<{ x: number; y: number; id: string } | null>(null);

  useEffect(() => {
    if (disAyarlari) setAyarlar(disAyarlari);
  }, [disAyarlari]);

  useEffect(() => {
    const handler = () => setAyarlar(sekmeAyarlariOku());
    window.addEventListener('ap-sekme-ayarlari-guncellendi', handler);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', handler);
  }, []);

  const tabCss = useMemo(() => {
    const h =
      ayarlar.sekmeYukseklik === 'kucuk' ? '1.75rem' : ayarlar.sekmeYukseklik === 'buyuk' ? '2.5rem' : '2rem';
    const f =
      ayarlar.sekmeYukseklik === 'kucuk' ? '0.6875rem' : ayarlar.sekmeYukseklik === 'buyuk' ? '0.875rem' : '0.75rem';
    return { '--ap-tab-height': h, '--ap-tab-font-size': f } as React.CSSProperties;
  }, [ayarlar.sekmeYukseklik]);

  const ogeler = useMemo(() => sekmeleriGrupla(sekmeler), [sekmeler]);

  useEffect(() => {
    const alan = scrollTrackRef.current;
    if (!alan) return;

    const tekerlekKaydir = (e: WheelEvent) => {
      const el = scrollRef.current;
      if (!el || el.scrollWidth <= el.clientWidth + 1) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      e.preventDefault();
      el.scrollBy({ left: delta, behavior: 'auto' });
    };

    alan.addEventListener('wheel', tekerlekKaydir, { passive: false });
    return () => alan.removeEventListener('wheel', tekerlekKaydir);
  }, [ogeler]);

  function onDragStart(e: DragEvent, id: string) {
    setSurukleniyor(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }

  function onPointerDown(e: MouseEvent, id: string) {
    if ((e.target as HTMLElement).closest('button[aria-label="Sekmeyi kapat"]')) return;
    surukleBaslangic.current = { x: e.clientX, y: e.clientY, id };
  }

  function onPointerMove(e: MouseEvent) {
    if (!surukleBaslangic.current || !onSekmeAyir) return;
    const dy = e.clientY - surukleBaslangic.current.y;
    if (dy > SURUKLE_AYIR_ESIK && e.clientY > 100) {
      onSekmeAyir(surukleBaslangic.current.id);
      surukleBaslangic.current = null;
    }
  }

  function onPointerUp() {
    surukleBaslangic.current = null;
  }

  function onDragOver(e: DragEvent, hedefId: string) {
    e.preventDefault();
    const mod = dropModHesapla(e, hedefId, surukleniyor);
    setDropHedef(hedefId);
    setDropMod(mod);
  }

  function onDrop(e: DragEvent, hedefId: string) {
    e.preventDefault();
    const kaynakId = surukleniyor ?? e.dataTransfer.getData('text/plain');
    if (!kaynakId || kaynakId === hedefId) {
      suruklemeSifirla();
      return;
    }

    const mod = dropMod ?? dropModHesapla(e, hedefId, kaynakId) ?? 'sonra';
    if (mod === 'grup') {
      onSekmeBirlestir(kaynakId, hedefId);
    } else {
      onSekmeTasi(kaynakId, hedefId, mod);
    }

    suruklemeSifirla();
  }

  function suruklemeSifirla() {
    setSurukleniyor(null);
    setDropHedef(null);
    setDropMod(null);
  }

  const sekmeSecAnim = useCallback(
    (id: string) => {
      onSekmeSec(id);
      setKenarlikAnimKey((n) => n + 1);
    },
    [onSekmeSec]
  );

  const ortakSekmeProps = {
    surukleniyor,
    dropHedef,
    dropMod,
    hoverOnizleme: ayarlar.hoverOnizleme,
    gorunumModu: ayarlar.sekmeGorunumModu,
    kareYerlesim: ayarlar.sekmeYerlesim === 'kare',
    baslatMenuAcik,
    kenarlikAnimKey,
    onSekmeSec: sekmeSecAnim,
    onSekmeKapat,
    sekmelerUzunluk: sekmeler.length,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd: suruklemeSifirla,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };

  return (
    <div className="ap-sekme-scroll-wrap" style={tabCss} data-ap-kesif="sekme-cubugu">
      <div ref={scrollTrackRef} className="ap-sekme-scroll-rail">
        <div ref={scrollRef} className="ap-sekme-scroll ap-sekme-scroll--ortada">
          {ogeler.map((oge) => {
            if (oge.tip === 'tek') {
              return (
                <SekmeButonu
                  key={oge.sekme.id}
                  sekme={oge.sekme}
                  aktif={oge.sekme.id === aktifSekmeId}
                  {...ortakSekmeProps}
                />
              );
            }

            return (
              <div
                key={oge.grupId}
                className="ap-sekme-grup flex shrink-0 items-end rounded-t-lg border border-b-0 border-[var(--ap-border)] bg-[var(--ap-tab-idle)] p-0.5 shadow-sm"
              >
                {oge.sekmeler.map((sekme) => (
                  <SekmeButonu
                    key={sekme.id}
                    sekme={sekme}
                    aktif={sekme.id === aktifSekmeId}
                    gruplu
                    {...ortakSekmeProps}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {ayarlar.sekmeAramaAktif && onModulSec && (
        <SekmeCubuguArama gorunum={ayarlar.sekmeAramaGorunum} onModulSec={onModulSec} />
      )}
    </div>
  );
}
