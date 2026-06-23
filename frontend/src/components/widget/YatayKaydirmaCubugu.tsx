import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type Metrik = { scrollLeft: number; scrollWidth: number; clientWidth: number };

function metrikOku(el: HTMLDivElement | null): Metrik {
  if (!el) return { scrollLeft: 0, scrollWidth: 0, clientWidth: 0 };
  return { scrollLeft: el.scrollLeft, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
}

export function YatayKaydirmaCubugu({
  children,
  sinif = '',
  vurguRenk = '#7c3aed',
}: {
  children: ReactNode;
  sinif?: string;
  vurguRenk?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrik, setMetrik] = useState<Metrik>({ scrollLeft: 0, scrollWidth: 0, clientWidth: 0 });
  const surukleRef = useRef<{ basX: number; basScroll: number } | null>(null);

  const guncelle = useCallback(() => {
    setMetrik(metrikOku(scrollRef.current));
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    guncelle();
    el.addEventListener('scroll', guncelle, { passive: true });
    const ro = new ResizeObserver(guncelle);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', guncelle);
      ro.disconnect();
    };
  }, [guncelle]);

  const kaydirilabilir = metrik.scrollWidth > metrik.clientWidth + 4;
  const maxScroll = Math.max(metrik.scrollWidth - metrik.clientWidth, 0);
  const gorunurOran = metrik.clientWidth / Math.max(metrik.scrollWidth, 1);
  const thumbOran = kaydirilabilir ? Math.max(gorunurOran, 0.12) : 1;
  const thumbKayma =
    kaydirilabilir && maxScroll > 0 ? (metrik.scrollLeft / maxScroll) * (1 - thumbOran) : 0;

  const trackTikla = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track || !kaydirilabilir) return;
    if ((e.target as HTMLElement).classList.contains('ykc-thumb')) return;
    const rect = track.getBoundingClientRect();
    const oran = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const hedef = oran * maxScroll;
    el.scrollTo({ left: hedef, behavior: 'smooth' });
  };

  const thumbBas = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track || !kaydirilabilir) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    surukleRef.current = { basX: e.clientX, basScroll: el.scrollLeft };
  };

  const thumbSurukle = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    const surukle = surukleRef.current;
    if (!el || !track || !surukle || e.buttons === 0) return;
    const trackGenis = track.offsetWidth;
    const thumbGenis = trackGenis * thumbOran;
    const maxThumbKayma = trackGenis - thumbGenis;
    if (maxThumbKayma <= 0) return;
    const dx = e.clientX - surukle.basX;
    const scrollDx = (dx / maxThumbKayma) * maxScroll;
    el.scrollLeft = Math.min(maxScroll, Math.max(0, surukle.basScroll + scrollDx));
  };

  const thumbBitir = () => {
    surukleRef.current = null;
  };

  return (
    <div className="ykc-wrap">
      <div ref={scrollRef} className={`ykc-serit ${sinif}`.trim()}>
        {children}
      </div>
      {kaydirilabilir && (
        <div className="ykc-cubuk-alan" aria-hidden>
          <div
            ref={trackRef}
            className="ykc-track"
            onClick={trackTikla}
            role="presentation"
          >
            <div
              className="ykc-thumb"
              style={{
                width: `${thumbOran * 100}%`,
                left: `${thumbKayma * (1 - thumbOran) * 100}%`,
                backgroundColor: vurguRenk,
              }}
              onPointerDown={thumbBas}
              onPointerMove={thumbSurukle}
              onPointerUp={thumbBitir}
              onPointerCancel={thumbBitir}
            />
          </div>
        </div>
      )}
    </div>
  );
}
