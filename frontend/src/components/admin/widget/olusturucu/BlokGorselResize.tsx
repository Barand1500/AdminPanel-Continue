import { useCallback, useRef } from 'react';
import type { WidgetBlok } from '@/types/blokOlusturucu';
import { VARSAYILAN_GORSEL_YUKSEKLIK } from '@/types/blokOlusturucu';
import { gorselBlokStili } from './blokOlusturucuYardimci';

interface BlokGorselResizeProps {
  blok: WidgetBlok;
  secili: boolean;
  src?: string;
  placeholder?: string;
  onBoyutDegistir: (yukseklikPx: number) => void;
}

export function BlokGorselResize({
  blok,
  secili,
  src,
  placeholder = 'Görsel',
  onBoyutDegistir,
}: BlokGorselResizeProps) {
  const surukleniyorRef = useRef(false);
  const baslangicYRef = useRef(0);
  const baslangicHRef = useRef(VARSAYILAN_GORSEL_YUKSEKLIK);

  const yukseklik = blok.gorselYukseklikPx ?? VARSAYILAN_GORSEL_YUKSEKLIK;

  const surukleBaslat = useCallback(
    (clientY: number) => {
      surukleniyorRef.current = true;
      baslangicYRef.current = clientY;
      baslangicHRef.current = yukseklik;

      function hareket(e: MouseEvent) {
        if (!surukleniyorRef.current) return;
        const fark = e.clientY - baslangicYRef.current;
        const yeni = Math.min(600, Math.max(80, baslangicHRef.current + fark));
        onBoyutDegistir(yeni);
      }

      function birak() {
        surukleniyorRef.current = false;
        window.removeEventListener('mousemove', hareket);
        window.removeEventListener('mouseup', birak);
      }

      window.addEventListener('mousemove', hareket);
      window.addEventListener('mouseup', birak);
    },
    [yukseklik, onBoyutDegistir]
  );

  const stil = gorselBlokStili(blok);

  return (
    <div className={`ap-blok-gorsel-wrap${secili ? ' secili' : ''}`} style={{ width: stil.width, maxWidth: '100%' }}>
      {src ? (
        <img src={src} alt="" className="ap-blok-gorsel-img rounded object-cover" style={stil} />
      ) : (
        <div
          className="ap-blok-gorsel-placeholder flex items-center justify-center rounded bg-slate-100 text-xs text-slate-400"
          style={{ height: stil.height, width: '100%' }}
        >
          {placeholder}
        </div>
      )}
      {secili && (
        <div
          className="ap-blok-gorsel-resize-handle"
          role="separator"
          aria-label="Görsel yüksekliğini ayarla"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            surukleBaslat(e.clientY);
          }}
        />
      )}
    </div>
  );
}
