import { useEffect, useState } from 'react';
import type { Widget } from '@/types/site';
import { configOkuFromWidget } from './widgetHelpers';

interface PopupWidgetProps {
  widget: Widget;
  onizleme?: boolean;
}

export function PopupWidget({ widget, onizleme }: PopupWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const gecikme = (cfg.popupGecikme ?? 3) * 1000;
  const [acik, setAcik] = useState(onizleme ?? false);

  useEffect(() => {
    if (onizleme) {
      setAcik(true);
      return;
    }
    const zamanlayici = window.setTimeout(() => setAcik(true), gecikme);
    return () => window.clearTimeout(zamanlayici);
  }, [gecikme, onizleme]);

  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Kapat" onClick={() => setAcik(false)} />
      <div className="relative max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button type="button" onClick={() => setAcik(false)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600" aria-label="Kapat">
          ✕
        </button>
        {widget.baslik && <h3 className="pr-8 text-lg font-semibold text-slate-900">{widget.baslik}</h3>}
        {widget.aciklama && <p className="mt-2 text-sm text-slate-600">{widget.aciklama}</p>}
      </div>
    </div>
  );
}
