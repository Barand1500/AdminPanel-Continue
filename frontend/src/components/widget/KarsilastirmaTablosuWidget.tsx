import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function hucreGoster(deger: string) {
  const d = deger.trim().toLowerCase();
  if (d === '✓' || d === 'evet' || d === 'var' || d === 'true') return <span className="text-lg text-emerald-500">✓</span>;
  if (d === '✗' || d === 'hayir' || d === 'yok' || d === 'false') return <span className="text-lg text-slate-300">✗</span>;
  return <span className="text-sm text-slate-700">{deger}</span>;
}

export function KarsilastirmaTablosuWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const paketler = cfg.karsilastirmaPaketler ?? [];
  const satirlar = cfg.karsilastirmaSatirlari ?? [];
  if (paketler.length === 0) return null;

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 text-sm font-semibold text-slate-500">Özellik</th>
              {paketler.map((p) => (
                <th
                  key={p.id}
                  className={`p-4 text-center ${p.oneCikan ? 'bg-primary/5 ring-2 ring-inset ring-primary/20' : ''}`}
                >
                  <p className="font-bold text-slate-900">{p.ad}</p>
                  {p.fiyat && <p className="mt-1 text-sm font-semibold text-primary">{p.fiyat}</p>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="p-4 text-sm font-medium text-slate-800">{s.ozellik}</td>
                {paketler.map((p, i) => (
                  <td key={p.id} className={`p-4 text-center ${p.oneCikan ? 'bg-primary/[0.03]' : ''}`}>
                    {hucreGoster(s.hucreler[i] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetKabuk>
  );
}
