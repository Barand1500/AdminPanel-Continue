import { useEffect, useMemo, useRef, useState, type DragEvent, type MouseEvent } from 'react';
import type { AdminModul, AdminSekme } from '@/types/admin';
import { modulBul } from '@/data/adminMenuYapisi';
import {
  sekmeAyarlariOku,
  type SekmePanelAyarlari,
} from '@/utils/sekmePanelAyarlari';
import { SekmeCubuguArama } from './SekmeCubuguArama';

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
}

type GrupOgesi =
  | { tip: 'tek'; sekme: AdminSekme }
  | { tip: 'grup'; grupId: string; sekmeler: AdminSekme[] };

const SURUKLE_ESIK = 6;

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

function SekmeButonu({
  sekme,
  aktif,
  gruplu,
  surukleniyor,
  birlestirmeHedef,
  hoverOnizleme,
  gorunumModu,
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
  birlestirmeHedef: string | null;
  hoverOnizleme: boolean;
  gorunumModu: SekmePanelAyarlari['sekmeGorunumModu'];
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
  const hedef = birlestirmeHedef === sekme.id;
  const tasinan = surukleniyor === sekme.id;
  const [hover, setHover] = useState(false);
  const modul = modulBul(sekme.modulId);
  const ikon = modul?.ikon ?? '📄';
  const isimGoster = gorunumModu === 'isim' || gorunumModu === 'ikon-isim';
  const ikonGoster = gorunumModu === 'ikon' || gorunumModu === 'ikon-isim';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, sekme.id)}
      onDragOver={(e) => onDragOver(e, sekme.id)}
      onDrop={(e) => onDrop(e, sekme.id)}
      onDragEnd={onDragEnd}
      onMouseDown={(e) => onPointerDown(e, sekme.id)}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`ap-sekme-tab group relative flex max-w-[200px] shrink-0 items-center rounded-t-md border border-b-0 transition-all ${
        gruplu ? 'rounded-none first:rounded-tl-md last:rounded-tr-md' : ''
      } ${
        aktif
          ? 'border-[var(--ap-border)] bg-[var(--ap-tab-active)] text-[var(--ap-heading)] shadow-sm'
          : 'border-transparent bg-[var(--ap-tab-idle)] text-[var(--ap-text-muted)] hover:bg-[var(--ap-hover)]'
      } ${tasinan ? 'opacity-40' : ''} ${hedef ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-[var(--ap-header-bg)]' : ''}`}
      style={{ minHeight: 'var(--ap-tab-height, 2rem)', fontSize: 'var(--ap-tab-font-size, 0.75rem)' }}
    >
      <button
        type="button"
        onClick={() => onSekmeSec(sekme.id)}
        className="flex min-h-[inherit] items-center gap-1 truncate px-3 py-1.5"
      >
        {sekme.kaydedilmedi && (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" title="Kaydedilmemiş değişiklik" />
        )}
        {ikonGoster && <span className="shrink-0 text-sm leading-none">{ikon}</span>}
        {isimGoster && <span className="truncate">{sekme.baslik}</span>}
        {!isimGoster && !ikonGoster && <span className="truncate">{sekme.baslik}</span>}
      </button>
      {sekmelerUzunluk > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSekmeKapat(sekme.id);
          }}
          className="mr-1 rounded px-1 opacity-0 transition hover:bg-[var(--ap-hover)] group-hover:opacity-100"
          aria-label="Sekmeyi kapat"
        >
          ×
        </button>
      )}
      {hoverOnizleme && hover && isimGoster && (
        <div className="ap-sekme-tooltip pointer-events-none absolute left-0 top-full z-50 mt-1 whitespace-nowrap rounded border border-[var(--ap-border)] bg-[var(--ap-surface)] px-2 py-1 text-[10px] shadow-lg">
          {sekme.baslik}
        </div>
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
}: UstSekmeCubuguProps) {
  const [ayarlar, setAyarlar] = useState<SekmePanelAyarlari>(() => disAyarlari ?? sekmeAyarlariOku());
  const [surukleniyor, setSurukleniyor] = useState<string | null>(null);
  const [birlestirmeHedef, setBirlestirmeHedef] = useState<string | null>(null);
  const [dropMod, setDropMod] = useState<'once' | 'sonra' | 'grup' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [solOk, setSolOk] = useState(false);
  const [sagOk, setSagOk] = useState(false);
  const surukleBaslangic = useRef<{ x: number; y: number; id: string } | null>(null);
  const suruklendi = useRef(false);

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

  const kaydirmaGuncelle = () => {
    const el = scrollRef.current;
    if (!el) return;
    setSolOk(el.scrollLeft > 4);
    setSagOk(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    kaydirmaGuncelle();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', kaydirmaGuncelle, { passive: true });
    const gozlemci = new ResizeObserver(kaydirmaGuncelle);
    gozlemci.observe(el);
    return () => {
      el.removeEventListener('scroll', kaydirmaGuncelle);
      gozlemci.disconnect();
    };
  }, [ogeler]);

  function kaydir(yon: 'sol' | 'sag') {
    scrollRef.current?.scrollBy({ left: yon === 'sol' ? -180 : 180, behavior: 'smooth' });
  }

  function onDragStart(e: DragEvent, id: string) {
    if (!suruklendi.current) {
      e.preventDefault();
      return;
    }
    setSurukleniyor(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }

  function onPointerDown(e: MouseEvent, id: string) {
    surukleBaslangic.current = { x: e.clientX, y: e.clientY, id };
    suruklendi.current = false;
  }

  function onPointerMove(e: MouseEvent) {
    if (!surukleBaslangic.current) return;
    const dx = Math.abs(e.clientX - surukleBaslangic.current.x);
    const dy = Math.abs(e.clientY - surukleBaslangic.current.y);
    if (dx > SURUKLE_ESIK || dy > SURUKLE_ESIK) suruklendi.current = true;

    if (
      ayarlar.surukleAyirPencere &&
      onSekmeAyir &&
      e.clientY > 120 &&
      dy > SURUKLE_ESIK * 2
    ) {
      onSekmeAyir(surukleBaslangic.current.id);
      surukleBaslangic.current = null;
      suruklendi.current = false;
    }
  }

  function onPointerUp() {
    surukleBaslangic.current = null;
    setTimeout(() => {
      suruklendi.current = false;
    }, 50);
  }

  function onDragOver(e: DragEvent, hedefId: string) {
    e.preventDefault();
    if (!surukleniyor || surukleniyor === hedefId) return;

    if (ayarlar.birlestirmeModu === 'manuel') {
      setBirlestirmeHedef(null);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const oran = (e.clientX - rect.left) / rect.width;
      setDropMod(oran <= 0.5 ? 'once' : 'sonra');
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const oran = x / rect.width;

    if (oran > 0.3 && oran < 0.7) {
      setBirlestirmeHedef(hedefId);
      setDropMod('grup');
    } else {
      setBirlestirmeHedef(null);
      setDropMod(oran <= 0.3 ? 'once' : 'sonra');
    }
  }

  function onDrop(e: DragEvent, hedefId: string) {
    e.preventDefault();
    const kaynakId = surukleniyor ?? e.dataTransfer.getData('text/plain');
    if (!kaynakId || kaynakId === hedefId) {
      suruklemeSifirla();
      return;
    }

    const mod = dropMod ?? 'sonra';
    if (mod === 'grup') {
      onSekmeBirlestir(kaynakId, hedefId);
    } else {
      onSekmeTasi(kaynakId, hedefId, mod);
    }

    suruklemeSifirla();
  }

  function suruklemeSifirla() {
    setSurukleniyor(null);
    setBirlestirmeHedef(null);
    setDropMod(null);
  }

  const ortakSekmeProps = {
    surukleniyor,
    birlestirmeHedef,
    hoverOnizleme: ayarlar.hoverOnizleme,
    gorunumModu: ayarlar.sekmeGorunumModu,
    onSekmeSec,
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
    <div className="ap-sekme-scroll-wrap" style={tabCss}>
      <div className="ap-sekme-scroll-track">
        {solOk && (
          <button type="button" className="ap-sekme-scroll-btn ap-sekme-scroll-sol" onClick={() => kaydir('sol')} aria-label="Sola">
            ‹
          </button>
        )}

        <div ref={scrollRef} className="ap-sekme-scroll">
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
                className="flex shrink-0 items-end rounded-t-lg border border-b-0 border-[var(--ap-border)] bg-[var(--ap-tab-idle)] p-0.5 shadow-sm"
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

        {sagOk && (
          <button type="button" className="ap-sekme-scroll-btn ap-sekme-scroll-sag" onClick={() => kaydir('sag')} aria-label="Sağa">
            ›
          </button>
        )}
      </div>

      {ayarlar.sekmeAramaAktif && onModulSec && (
        <SekmeCubuguArama gorunum={ayarlar.sekmeAramaGorunum} onModulSec={onModulSec} />
      )}
    </div>
  );
}
