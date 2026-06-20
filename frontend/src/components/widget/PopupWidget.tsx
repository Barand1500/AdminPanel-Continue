import { useEffect, useState } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { configOkuFromWidget } from './widgetHelpers';

interface PopupWidgetProps {
  widget: Widget;
  onizleme?: boolean;
}

function PopupIcerik({
  widget,
  kapat,
  sinifKutu,
  sinifBaslik = 'text-lg font-semibold text-slate-900',
  sinifMetin = 'mt-2 text-sm text-slate-600',
}: {
  widget: Widget;
  kapat: () => void;
  sinifKutu: string;
  sinifBaslik?: string;
  sinifMetin?: string;
}) {
  return (
    <div className={sinifKutu}>
      <button type="button" onClick={kapat} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600" aria-label="Kapat">
        ✕
      </button>
      {widget.baslik && <h3 className={`pr-8 ${sinifBaslik}`}>{widget.baslik}</h3>}
      {widget.aciklama && <p className={sinifMetin}>{widget.aciklama}</p>}
      {widget.butonMetni && widget.butonLink && (
        <a href={widget.butonLink} className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          {widget.butonMetni}
        </a>
      )}
    </div>
  );
}

export function PopupWidget({ widget, onizleme }: PopupWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const gecikme = (cfg.popupGecikme ?? 3) * 1000;
  const [acik, setAcik] = useState(onizleme ?? false);
  const gt = widgetGorunumTipiAl(widget);
  const kapat = () => setAcik(false);

  useEffect(() => {
    if (onizleme) {
      setAcik(true);
      return;
    }
    const zamanlayici = window.setTimeout(() => setAcik(true), gecikme);
    return () => window.clearTimeout(zamanlayici);
  }, [gecikme, onizleme]);

  if (!acik) return null;

  if (gt === 'alt-kaydirma') {
    return (
      <div className="popup-alt-kaydirma fixed inset-x-0 bottom-0 z-50 p-4">
        <button type="button" className="fixed inset-0 bg-black/40" aria-label="Kapat" onClick={kapat} />
        <PopupIcerik
          widget={widget}
          kapat={kapat}
          sinifKutu="popup-alt-panel relative mx-auto max-w-2xl rounded-t-2xl bg-white p-6 shadow-2xl"
        />
      </div>
    );
  }

  if (gt === 'sag-kose') {
    return (
      <div className="popup-sag-kose fixed bottom-4 right-4 z-50 max-w-xs">
        <PopupIcerik
          widget={widget}
          kapat={kapat}
          sinifKutu="relative rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
          sinifBaslik="text-base font-bold text-slate-900"
          sinifMetin="mt-1 text-xs text-slate-600"
        />
      </div>
    );
  }

  if (gt === 'mor-kart') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button type="button" className="absolute inset-0 bg-purple-900/40" aria-label="Kapat" onClick={kapat} />
        <PopupIcerik
          widget={widget}
          kapat={kapat}
          sinifKutu="relative max-w-md rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-50 to-purple-100 p-6 shadow-xl"
          sinifBaslik="text-lg font-bold text-violet-950"
          sinifMetin="mt-2 text-sm text-violet-800"
        />
      </div>
    );
  }

  if (gt === 'turuncu-uyari') {
    return (
      <div className="popup-turuncu-uyari fixed inset-x-0 top-0 z-50">
        <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-white shadow-lg">
          <button type="button" onClick={kapat} className="absolute right-4 top-3 text-white/80 hover:text-white" aria-label="Kapat">
            ✕
          </button>
          {widget.baslik && <p className="pr-8 font-bold">{widget.baslik}</p>}
          {widget.aciklama && <p className="mt-1 text-sm text-orange-50">{widget.aciklama}</p>}
        </div>
      </div>
    );
  }

  if (gt === 'mint-minimal') {
    return (
      <div className="popup-mint-minimal fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <PopupIcerik
          widget={widget}
          kapat={kapat}
          sinifKutu="relative flex items-center gap-3 rounded-full border border-teal-200 bg-teal-50 px-5 py-3 shadow-lg"
          sinifBaslik="text-sm font-semibold text-teal-900"
          sinifMetin="text-xs text-teal-700"
        />
      </div>
    );
  }

  return (
    <div className="popup-ortada-modal fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Kapat" onClick={kapat} />
      <PopupIcerik widget={widget} kapat={kapat} sinifKutu="relative max-w-md rounded-xl bg-white p-6 shadow-xl" />
    </div>
  );
}
