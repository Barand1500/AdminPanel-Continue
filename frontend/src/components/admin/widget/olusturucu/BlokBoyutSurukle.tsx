import { useCallback, useRef, type ReactNode } from 'react';
import type { WidgetBlok } from '@/types/blokOlusturucu';
import {
  blokMinYukseklik,
  blokOnizlemeWrapperStili,
} from '@/types/blokOlusturucu';

type HandleKenar = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const HANDLELER: { kenar: HandleKenar; sinif: string }[] = [
  { kenar: 'n', sinif: 'ap-blok-boyut-handle-n' },
  { kenar: 's', sinif: 'ap-blok-boyut-handle-s' },
  { kenar: 'e', sinif: 'ap-blok-boyut-handle-e' },
  { kenar: 'w', sinif: 'ap-blok-boyut-handle-w' },
  { kenar: 'ne', sinif: 'ap-blok-boyut-handle-ne' },
  { kenar: 'nw', sinif: 'ap-blok-boyut-handle-nw' },
  { kenar: 'se', sinif: 'ap-blok-boyut-handle-se' },
  { kenar: 'sw', sinif: 'ap-blok-boyut-handle-sw' },
];

interface BlokBoyutSurukleProps {
  blok: WidgetBlok;
  secili: boolean;
  children: ReactNode;
  onBoyutDegistir: (genislikPx: number | undefined, yukseklikPx: number | undefined) => void;
}

export function BlokBoyutSurukle({ blok, secili, children, onBoyutDegistir }: BlokBoyutSurukleProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const surukleBaslat = useCallback(
    (clientX: number, clientY: number, kenar: HandleKenar) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      const parentW = wrapRef.current?.parentElement?.clientWidth ?? rect?.width ?? 300;
      const minH = blokMinYukseklik(blok.tip);
      const baslangicW = blok.blokGenislikPx ?? Math.round(rect?.width ?? parentW);
      const baslangicH = blok.gorselYukseklikPx ?? Math.round(rect?.height ?? minH);
      const baslangicX = clientX;
      const baslangicY = clientY;

      function hareket(e: MouseEvent) {
        const dx = e.clientX - baslangicX;
        const dy = e.clientY - baslangicY;
        let yeniW = baslangicW;
        let yeniH = baslangicH;

        if (kenar.includes('e')) yeniW = baslangicW + dx;
        if (kenar.includes('w')) yeniW = baslangicW - dx;
        if (kenar.includes('s')) yeniH = baslangicH + dy;
        if (kenar.includes('n')) yeniH = baslangicH - dy;

        yeniW = Math.min(parentW, Math.max(80, Math.round(yeniW)));
        yeniH = Math.min(600, Math.max(minH, Math.round(yeniH)));

        const genislikDegisti = kenar.includes('e') || kenar.includes('w');
        const yukseklikDegisti = kenar.includes('n') || kenar.includes('s');

        onBoyutDegistir(
          genislikDegisti ? yeniW : undefined,
          yukseklikDegisti ? yeniH : undefined
        );
      }

      function birak() {
        window.removeEventListener('mousemove', hareket);
        window.removeEventListener('mouseup', birak);
      }

      window.addEventListener('mousemove', hareket);
      window.addEventListener('mouseup', birak);
    },
    [blok, onBoyutDegistir]
  );

  const stil = blokOnizlemeWrapperStili(blok);

  return (
    <div
      ref={wrapRef}
      className={`ap-blok-boyut-wrap${secili ? ' secili' : ''}`}
      style={stil}
    >
      <div className="ap-blok-boyut-icerik">{children}</div>
      {secili &&
        HANDLELER.map(({ kenar, sinif }) => (
          <div
            key={kenar}
            className={`ap-blok-boyut-handle ${sinif}`}
            role="separator"
            aria-hidden
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              surukleBaslat(e.clientX, e.clientY, kenar);
            }}
          />
        ))}
    </div>
  );
}
