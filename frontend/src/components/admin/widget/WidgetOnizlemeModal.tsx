import { WidgetRender } from '@/components/widget/WidgetAlani';
import { formToWidgetOnizleme } from '@/types/widget';
import type { WidgetFormDegeri } from '@/types/admin';

interface WidgetOnizlemeModalProps {
  acik: boolean;
  form: WidgetFormDegeri;
  otomatikDoldur?: boolean;
  onKapat: () => void;
}

export function WidgetOnizlemeModal({ acik, form, otomatikDoldur = false, onKapat }: WidgetOnizlemeModalProps) {
  if (!acik) return null;

  const widget = formToWidgetOnizleme(form, 'onizleme', otomatikDoldur);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/70" aria-label="Kapat" onClick={onKapat} />
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-white">Widget Önizleme</h2>
            <p className="text-xs text-slate-400">{form.ad || 'Taslak'} · {form.tip.replaceAll('_', ' ')}</p>
          </div>
          <button type="button" onClick={onKapat} className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800">
            Kapat
          </button>
        </div>
        <div className="ap-scroll overflow-y-auto bg-slate-100">
          <WidgetRender widget={widget} onizleme />
        </div>
      </div>
    </div>
  );
}
