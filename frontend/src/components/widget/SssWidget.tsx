import { useState } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function SssWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const sorular = cfg.sorular ?? [];
  const [acik, setAcik] = useState<string | null>(sorular[0]?.id ?? null);
  const gt = widgetGorunumTipiAl(widget);

  const baslik = widget.baslik ? (
    <h2 className={`${baslikSinifi(cfg)} mb-8 font-bold`}>{widget.baslik}</h2>
  ) : null;

  if (gt === 'iki-kolon-mavi') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="sss-iki-kolon grid gap-4 md:grid-cols-2">
          {sorular.map((s) => (
            <div key={s.id} className="rounded-xl border border-blue-200 bg-blue-50">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-blue-900"
                onClick={() => setAcik(acik === s.id ? null : s.id)}
              >
                {s.soru}
                <span className="text-blue-600">{acik === s.id ? '−' : '+'}</span>
              </button>
              {acik === s.id && <div className="border-t border-blue-200 px-4 py-3 text-sm text-blue-800">{s.cevap}</div>}
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'kart-golgeli') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="sss-kart-golgeli space-y-3">
          {sorular.map((s) => (
            <div key={s.id} className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-violet-100">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left font-semibold text-violet-950"
                onClick={() => setAcik(acik === s.id ? null : s.id)}
              >
                {s.soru}
                <span>{acik === s.id ? '−' : '+'}</span>
              </button>
              {acik === s.id && <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.cevap}</p>}
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'koyu-panel') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="sss-koyu-panel rounded-2xl bg-slate-900 p-6 md:p-8">
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mb-6 font-bold text-white`}>{widget.baslik}</h2>}
          <div className="space-y-2">
            {sorular.map((s) => (
              <div key={s.id} className="rounded-lg border border-white/10 bg-white/5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-white"
                  onClick={() => setAcik(acik === s.id ? null : s.id)}
                >
                  {s.soru}
                  <span className="text-sky-400">{acik === s.id ? '−' : '+'}</span>
                </button>
                {acik === s.id && <div className="border-t border-white/10 px-4 py-3 text-sm text-slate-300">{s.cevap}</div>}
              </div>
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-vurgu') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <div className="sss-turuncu space-y-2">
          {sorular.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50">
              <button
                type="button"
                className="flex w-full items-center justify-between bg-orange-100 px-4 py-3 text-left font-semibold text-orange-950"
                onClick={() => setAcik(acik === s.id ? null : s.id)}
              >
                {s.soru}
                <span>{acik === s.id ? '−' : '+'}</span>
              </button>
              {acik === s.id && <div className="px-4 py-3 text-sm text-orange-900">{s.cevap}</div>}
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cizgili-sade') {
    return (
      <WidgetKabuk widget={widget}>
        {baslik}
        <dl className="sss-cizgili divide-y divide-slate-200 border-y border-slate-200">
          {sorular.map((s) => (
            <div key={s.id} className="py-4">
              <dt className="font-semibold text-slate-900">{s.soru}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{s.cevap}</dd>
            </div>
          ))}
        </dl>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      {baslik}
      <div className="sss-accordion space-y-2">
        {sorular.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-slate-900"
              onClick={() => setAcik(acik === s.id ? null : s.id)}
            >
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
