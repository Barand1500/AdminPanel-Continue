import { useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function SssWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const sorular = cfg.sorular ?? [];
  const [acik, setAcik] = useState<string | null>(sorular[0]?.id ?? null);

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mb-8 font-bold`}>{widget.baslik}</h2>}
      <div className="space-y-2">
        {sorular.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-white">
            <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-slate-900" onClick={() => setAcik(acik === s.id ? null : s.id)}>
              {s.soru}
              <span>{acik === s.id ? '−' : '+'}</span>
            </button>
            {acik === s.id && <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{s.cevap}</div>}
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
