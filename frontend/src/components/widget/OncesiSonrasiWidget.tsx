import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

export function OncesiSonrasiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const once = cfg.onceGorsel ?? widget.gorselUrl ?? '';
  const sonra = cfg.sonraGorsel ?? '';
  const [oran, setOran] = useState(50);
  const [genislik, setGenislik] = useState(0);
  const kapsayiciRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = kapsayiciRef.current;
    if (!el) return;
    const guncelle = () => setGenislik(el.offsetWidth);
    guncelle();
    const ro = new ResizeObserver(guncelle);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const surukle = useCallback((clientX: number) => {
    const el = kapsayiciRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const yuzde = ((clientX - rect.left) / rect.width) * 100;
    setOran(Math.min(98, Math.max(2, yuzde)));
  }, []);

  if (!once || !sonra) return null;

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
      <div
        ref={kapsayiciRef}
        className="oncesi-sonrasi-kapsayici relative mx-auto max-w-4xl cursor-ew-resize select-none overflow-hidden rounded-2xl shadow-lg"
        onPointerDown={(e) => {
          surukle(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) surukle(e.clientX);
        }}
      >
        <img src={medyaUrl(sonra)} alt="Sonra" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${oran}%` }}>
          <img
            src={medyaUrl(once)}
            alt="Önce"
            className="absolute left-0 top-0 h-full max-w-none object-cover"
            style={{ width: genislik || '100%' }}
            draggable={false}
          />
        </div>
        <div className="oncesi-sonrasi-cizgi" style={{ left: `${oran}%` }}>
          <span className="oncesi-sonrasi-tutamac">⟷</span>
        </div>
        <span className="oncesi-sonrasi-etiket oncesi-sonrasi-etiket-sol">Önce</span>
        <span className="oncesi-sonrasi-etiket oncesi-sonrasi-etiket-sag">Sonra</span>
      </div>
    </WidgetKabuk>
  );
}
