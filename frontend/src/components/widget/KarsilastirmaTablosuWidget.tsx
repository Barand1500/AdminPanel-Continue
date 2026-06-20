import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
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
  const gt = widgetGorunumTipiAl(widget);
  if (paketler.length === 0) return null;

  const baslikRengi = g.baslikRengi || widget.yaziRenk || '#0f172a';
  const metinRengi = g.metinRengi || widget.yaziRenk || '#475569';
  const tabloArkaPlan = widget.arkaPlanRenk || '#ffffff';
  const baslikSatirBg = g.tabloBaslikArkaPlan || '#f8fafc';
  const kenarRengi = g.tabloKenarRengi || '#e2e8f0';
  const vurguRengi = g.vurguRengi || 'var(--color-primary, #7c3aed)';

  const hucreStili: CSSProperties = { color: metinRengi };
  const ozellikStili: CSSProperties = { color: baslikRengi };

  if (gt === 'kart') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold`} style={{ color: baslikRengi }}>
            {widget.baslik}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paketler.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border p-6 shadow-sm"
              style={{
                borderColor: p.oneCikan ? vurguRengi : kenarRengi,
                backgroundColor: p.oneCikan ? `${vurguRengi}08` : tabloArkaPlan,
              }}
            >
              <h3 className="text-lg font-bold" style={{ color: baslikRengi }}>{p.ad}</h3>
              {p.fiyat && <p className="mt-1 font-semibold" style={{ color: vurguRengi }}>{p.fiyat}</p>}
              <ul className="mt-4 space-y-2">
                {satirlar.map((s) => {
                  const pi = paketler.findIndex((x) => x.id === p.id);
                  return (
                    <li key={s.id} className="flex justify-between gap-2 text-sm">
                      <span style={ozellikStili}>{s.ozellik}</span>
                      {hucreGoster(s.hucreler[pi] ?? '—', hucreStili)}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  const tabloSinif = gt === 'minimal' ? 'text-sm' : '';

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
        className={`overflow-x-auto rounded-2xl shadow-sm ${tabloSinif}`}
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
