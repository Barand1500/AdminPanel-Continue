import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function hucreGoster(deger: string, hucreStili: CSSProperties) {
  const d = deger.trim().toLowerCase();
  if (d === '✓' || d === 'evet' || d === 'var' || d === 'true') {
    return <span className="text-lg text-emerald-500">✓</span>;
  }
  if (d === '✗' || d === 'hayir' || d === 'yok' || d === 'false') {
    return <span className="text-lg opacity-40">✗</span>;
  }
  return <span className="text-sm" style={hucreStili}>{deger}</span>;
}

export function KarsilastirmaTablosuWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const paketler = cfg.karsilastirmaPaketler ?? [];
  const satirlar = cfg.karsilastirmaSatirlari ?? [];
  const g = cfg.gorunum ?? {};
  if (paketler.length === 0) return null;

  const baslikRengi = g.baslikRengi || widget.yaziRenk || '#0f172a';
  const metinRengi = g.metinRengi || widget.yaziRenk || '#475569';
  const tabloArkaPlan = widget.arkaPlanRenk || '#ffffff';
  const baslikSatirBg = g.tabloBaslikArkaPlan || '#f8fafc';
  const kenarRengi = g.tabloKenarRengi || '#e2e8f0';
  const vurguRengi = g.vurguRengi || 'var(--color-primary, #7c3aed)';

  const hucreStili: CSSProperties = { color: metinRengi };
  const ozellikStili: CSSProperties = { color: baslikRengi };

  return (
    <WidgetKabuk widget={widget}>
      {widget.baslik && (
        <h2
          className={`${baslikSinifi(cfg)} mb-8 text-center font-bold`}
          style={{ color: baslikRengi }}
        >
          {widget.baslik}
        </h2>
      )}
      <div
        className="overflow-x-auto rounded-2xl shadow-sm"
        style={{ border: `1px solid ${kenarRengi}`, backgroundColor: tabloArkaPlan }}
      >
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr style={{ borderBottom: `1px solid ${kenarRengi}`, backgroundColor: baslikSatirBg }}>
              <th className="p-4 text-sm font-semibold" style={{ color: metinRengi }}>
                Özellik
              </th>
              {paketler.map((p) => (
                <th
                  key={p.id}
                  className="p-4 text-center"
                  style={
                    p.oneCikan
                      ? {
                          backgroundColor: `${vurguRengi}14`,
                          boxShadow: `inset 0 0 0 2px ${vurguRengi}33`,
                        }
                      : undefined
                  }
                >
                  <p className="font-bold" style={{ color: baslikRengi }}>
                    {p.ad}
                  </p>
                  {p.fiyat && (
                    <p className="mt-1 text-sm font-semibold" style={{ color: vurguRengi }}>
                      {p.fiyat}
                    </p>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${kenarRengi}` }}>
                <td className="p-4 text-sm font-medium" style={ozellikStili}>
                  {s.ozellik}
                </td>
                {paketler.map((p, i) => (
                  <td
                    key={p.id}
                    className="p-4 text-center"
                    style={p.oneCikan ? { backgroundColor: `${vurguRengi}08` } : undefined}
                  >
                    {hucreGoster(s.hucreler[i] ?? '—', hucreStili)}
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
