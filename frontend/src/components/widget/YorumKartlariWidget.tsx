import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle, medyaUrl } from './widgetHelpers';

function yildizGoster(puan: number, renk: string) {
  const p = Math.min(5, Math.max(0, Math.round(puan)));
  return (
    <div className="flex gap-0.5" aria-label={`${p} / 5 yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="text-lg leading-none"
          style={{ color: i < p ? renk : '#e2e8f0' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function kartAraligiSinifi(kartAraligi?: string) {
  if (kartAraligi === 'dar') return 'gap-4';
  if (kartAraligi === 'genis') return 'gap-8';
  return 'gap-6';
}

export function YorumKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const g = cfg.gorunum ?? {};
  const yorumlar = cfg.yorumlar ?? [];
  if (yorumlar.length === 0) return null;

  const yildizAcik = g.yildizGoster !== false;
  const yildizRenk = g.yildizRengi ?? '#facc15';
  const footerBg = g.kartFooterArkaPlan ?? '#f1f5f9';
  const radius = g.borderRadius ?? 12;
  const golge = g.kartGolge !== false;
  const metinRenk = g.metinRengi ?? '#475569';
  const baslikRenk = g.baslikRengi ?? '#0f172a';
  const ustEtiketRenk = g.vurguRengi ?? '#2563eb';
  const hizalamaSinifi =
    g.hizalama === 'sol' ? 'text-left' : g.hizalama === 'sag' ? 'text-right' : 'text-center';

  return (
    <WidgetKabuk widget={widget}>
      <div className={`mb-10 ${hizalamaSinifi}`}>
        {widget.altBaslik && (
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: ustEtiketRenk }}
          >
            {widget.altBaslik}
          </p>
        )}
        {widget.baslik && (
          <h2
            className={`${baslikSinifi(cfg)} mt-2 font-bold`}
            style={{ color: baslikRenk }}
          >
            {widget.baslik}
          </h2>
        )}
      </div>

      <div className={`grid ${kartAraligiSinifi(g.kartAraligi)}`} style={gridStyle(cfg)}>
        {yorumlar.map((y) => (
          <article
            key={y.id}
            className="flex flex-col overflow-hidden bg-white"
            style={{
              borderRadius: `${radius}px`,
              boxShadow: golge ? '0 4px 24px rgba(15, 23, 42, 0.08)' : undefined,
            }}
          >
            <div className="flex flex-1 flex-col p-6">
              {yildizAcik && (
                <div className="mb-4">
                  {yildizGoster(y.yildiz ?? 5, yildizRenk)}
                </div>
              )}
              <p className="flex-1 text-sm leading-relaxed" style={{ color: metinRenk }}>
                {y.metin}
              </p>
            </div>
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{ backgroundColor: footerBg }}
            >
              {y.gorselUrl ? (
                <img
                  src={medyaUrl(y.gorselUrl)}
                  alt={y.ad}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                  {y.ad.charAt(0) || '?'}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">{y.ad}</p>
                {y.firma && <p className="truncate text-sm text-slate-500">{y.firma}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </WidgetKabuk>
  );
}
