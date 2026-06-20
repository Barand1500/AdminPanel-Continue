import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function hucreGoster(deger: string, hucreStili: CSSProperties, yesilOnay = false) {
  const d = deger.trim().toLowerCase();
  if (d === '✓' || d === 'evet' || d === 'var' || d === 'true') {
    return (
      <span className={`text-lg ${yesilOnay ? 'font-bold text-emerald-600' : 'text-emerald-500'}`}>✓</span>
    );
  }
  if (d === '✗' || d === 'hayir' || d === 'yok' || d === 'false') {
    return <span className="text-lg opacity-40">✗</span>;
  }
  return <span className="text-sm" style={hucreStili}>{deger}</span>;
}

function TabloBaslik({ widget, cfg, baslikRengi }: { widget: Widget; cfg: ReturnType<typeof configOkuFromWidget>; baslikRengi: string }) {
  if (!widget.baslik) return null;
  return (
    <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold`} style={{ color: baslikRengi }}>
      {widget.baslik}
    </h2>
  );
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

  if (gt === 'mobil-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslik widget={widget} cfg={cfg} baslikRengi={baslikRengi} />
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

  if (gt === 'minimal-cizgi') {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslik widget={widget} cfg={cfg} baslikRengi={baslikRengi} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 pr-4 font-medium text-slate-500">Özellik</th>
                {paketler.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-center font-semibold" style={{ color: baslikRengi }}>
                    {p.ad}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium" style={ozellikStili}>{s.ozellik}</td>
                  {paketler.map((p, i) => (
                    <td key={p.id} className="px-4 py-3 text-center">
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

  if (gt === 'koyu-baslik') {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslik widget={widget} cfg={cfg} baslikRengi={baslikRengi} />
        <div
          className="overflow-x-auto rounded-2xl shadow-sm"
          style={{ border: `1px solid ${kenarRengi}`, backgroundColor: tabloArkaPlan }}
        >
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-900">
                <th className="p-4 text-sm font-semibold text-slate-400">Özellik</th>
                {paketler.map((p) => (
                  <th key={p.id} className="p-4 text-center">
                    <p className="font-bold text-white">{p.ad}</p>
                    {p.fiyat && <p className="mt-1 text-sm font-semibold text-sky-400">{p.fiyat}</p>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map((s) => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${kenarRengi}` }}>
                  <td className="p-4 text-sm font-medium" style={ozellikStili}>{s.ozellik}</td>
                  {paketler.map((p, i) => (
                    <td key={p.id} className="p-4 text-center">
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

  if (gt === 'mor-vurgu') {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslik widget={widget} cfg={cfg} baslikRengi={baslikRengi} />
        <div
          className="overflow-x-auto rounded-2xl shadow-sm"
          style={{ border: `1px solid ${kenarRengi}`, backgroundColor: tabloArkaPlan }}
        >
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: `1px solid ${kenarRengi}`, backgroundColor: baslikSatirBg }}>
                <th className="p-4 text-sm font-semibold" style={{ color: metinRengi }}>Özellik</th>
                {paketler.map((p) => (
                  <th
                    key={p.id}
                    className="p-4 text-center"
                    style={
                      p.oneCikan
                        ? { backgroundColor: '#7c3aed', color: '#fff' }
                        : undefined
                    }
                  >
                    <p className="font-bold" style={{ color: p.oneCikan ? '#fff' : baslikRengi }}>{p.ad}</p>
                    {p.fiyat && (
                      <p className="mt-1 text-sm font-semibold" style={{ color: p.oneCikan ? '#e9d5ff' : vurguRengi }}>
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
                  <td className="p-4 text-sm font-medium" style={ozellikStili}>{s.ozellik}</td>
                  {paketler.map((p, i) => (
                    <td
                      key={p.id}
                      className="p-4 text-center"
                      style={p.oneCikan ? { backgroundColor: '#faf5ff' } : undefined}
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

  if (gt === 'yesil-onay') {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslik widget={widget} cfg={cfg} baslikRengi={baslikRengi} />
        <div
          className="overflow-x-auto rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 shadow-sm"
        >
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-emerald-200 bg-emerald-100/80">
                <th className="p-4 text-sm font-semibold text-emerald-800">Özellik</th>
                {paketler.map((p) => (
                  <th key={p.id} className="p-4 text-center">
                    <p className="font-bold text-emerald-950">{p.ad}</p>
                    {p.fiyat && <p className="mt-1 text-sm font-semibold text-emerald-700">{p.fiyat}</p>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map((s) => (
                <tr key={s.id} className="border-b border-emerald-100">
                  <td className="p-4 text-sm font-medium text-emerald-900">{s.ozellik}</td>
                  {paketler.map((p, i) => (
                    <td key={p.id} className="p-4 text-center">
                      {hucreGoster(s.hucreler[i] ?? '—', hucreStili, true)}
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

  return (
    <WidgetKabuk widget={widget}>
      <TabloBaslik widget={widget} cfg={cfg} baslikRengi={baslikRengi} />
      <div
        className="overflow-x-auto rounded-2xl shadow-sm"
        style={{ border: `1px solid ${kenarRengi}`, backgroundColor: tabloArkaPlan }}
      >
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr style={{ borderBottom: `1px solid ${kenarRengi}`, backgroundColor: baslikSatirBg }}>
              <th className="p-4 text-sm font-semibold" style={{ color: metinRengi }}>Özellik</th>
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
                  <p className="font-bold" style={{ color: baslikRengi }}>{p.ad}</p>
                  {p.fiyat && (
                    <p className="mt-1 text-sm font-semibold" style={{ color: vurguRengi }}>{p.fiyat}</p>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${kenarRengi}` }}>
                <td className="p-4 text-sm font-medium" style={ozellikStili}>{s.ozellik}</td>
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
