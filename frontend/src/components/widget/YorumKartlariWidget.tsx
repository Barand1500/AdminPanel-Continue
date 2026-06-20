import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetYorum } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gridStyle, medyaUrl } from './widgetHelpers';

function yildizGoster(puan: number, renk: string, boyut = 'text-lg') {
  const p = Math.min(5, Math.max(0, Math.round(puan)));
  return (
    <div className={`flex gap-0.5 ${boyut}`} aria-label={`${p} / 5 yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="leading-none" style={{ color: i < p ? renk : '#e2e8f0' }}>
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

function BaslikAlani({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const g = cfg.gorunum ?? {};
  const hizalamaSinifi =
    g.hizalama === 'sol' ? 'text-left' : g.hizalama === 'sag' ? 'text-right' : 'text-center';

  return (
    <div className={`mb-10 ${hizalamaSinifi}`}>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: g.vurguRengi ?? '#2563eb' }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold`} style={{ color: g.baslikRengi ?? '#0f172a' }}>
          {widget.baslik}
        </h2>
      )}
    </div>
  );
}

function YazarFooter({ y, footerBg }: { y: WidgetYorum; footerBg: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4" style={{ backgroundColor: footerBg }}>
      {y.gorselUrl ? (
        <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className="h-11 w-11 shrink-0 rounded-full object-cover" />
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
  );
}

function GridBeyaz({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const g = cfg.gorunum ?? {};
  const yildizAcik = g.yildizGoster !== false;
  const yildizRenk = g.yildizRengi ?? '#facc15';
  const footerBg = g.kartFooterArkaPlan ?? '#f1f5f9';
  const radius = g.borderRadius ?? 12;
  const golge = g.kartGolge !== false;
  const metinRenk = g.metinRengi ?? '#475569';

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
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
              {yildizAcik && <div className="mb-4">{yildizGoster(y.yildiz ?? 5, yildizRenk)}</div>}
              <p className="flex-1 text-sm leading-relaxed" style={{ color: metinRenk }}>
                {y.metin}
              </p>
            </div>
            <YazarFooter y={y} footerBg={footerBg} />
          </article>
        ))}
      </div>
    </>
  );
}

function YildizVurgu({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const g = cfg.gorunum ?? {};
  const yildizRenk = g.yildizRengi ?? '#d97706';

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className={`grid ${kartAraligiSinifi(g.kartAraligi)}`} style={gridStyle(cfg)}>
        {yorumlar.map((y) => (
          <article key={y.id} className="flex flex-col overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50/30">
            <div className="border-b border-amber-200 bg-amber-100/50 px-6 py-4 text-center">
            <div className="mb-4 flex justify-center">{yildizGoster(y.yildiz ?? 5, yildizRenk, 'text-2xl')}</div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="flex-1 text-sm leading-relaxed text-slate-700">{y.metin}</p>
            </div>
            <YazarFooter y={y} footerBg="#fef3c7" />
          </article>
        ))}
      </div>
    </>
  );
}

function KoyuKart({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const g = cfg.gorunum ?? {};

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className={`grid ${kartAraligiSinifi(g.kartAraligi)}`} style={gridStyle(cfg)}>
        {yorumlar.map((y) => (
          <article key={y.id} className="flex flex-col overflow-hidden rounded-xl bg-slate-800">
            <div className="flex flex-1 flex-col p-6">
              {yildizGoster(y.yildiz ?? 5, '#38bdf8', 'text-base')}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">{y.metin}</p>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-700 px-6 py-4">
              {y.gorselUrl ? (
                <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-300">
                  {y.ad.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-white">{y.ad}</p>
                {y.firma && <p className="text-sm text-slate-400">{y.firma}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function MorCerceve({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const g = cfg.gorunum ?? {};

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className={`grid ${kartAraligiSinifi(g.kartAraligi)}`} style={gridStyle(cfg)}>
        {yorumlar.map((y) => (
          <article key={y.id} className="flex flex-col overflow-hidden rounded-2xl border-2 border-violet-400 bg-white p-6">
            {yildizGoster(y.yildiz ?? 5, '#9333ea')}
            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{y.metin}</p>
            <div className="mt-4 border-t border-violet-100 pt-4">
              <p className="font-bold text-violet-900">{y.ad}</p>
              {y.firma && <p className="text-sm text-violet-600">{y.firma}</p>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function OkyanusListe({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-3xl space-y-4">
        {yorumlar.map((y) => (
          <article key={y.id} className="flex gap-4 rounded-xl border-l-4 border-sky-500 bg-sky-50/50 p-5">
            {y.gorselUrl && (
              <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className="h-12 w-12 shrink-0 rounded-full object-cover" />
            )}
            <div className="min-w-0 flex-1">
              {yildizGoster(y.yildiz ?? 5, '#2563eb', 'text-sm')}
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{y.metin}</p>
              <p className="mt-2 text-xs font-semibold text-sky-800">
                {y.ad}
                {y.firma ? ` · ${y.firma}` : ''}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function YesilMinimal({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} />
      <div className={`grid ${kartAraligiSinifi(cfg.gorunum?.kartAraligi)}`} style={gridStyle(cfg)}>
        {yorumlar.map((y) => (
          <article key={y.id} className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-5">
            <p className="text-sm leading-relaxed text-slate-600">{y.metin}</p>
            <p className="mt-3 text-xs font-semibold text-emerald-800">{y.ad}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export function YorumKartlariWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const yorumlar = cfg.yorumlar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (yorumlar.length === 0) return null;

  const ortak = { widget, cfg, yorumlar };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'yildiz-vurgu' && <YildizVurgu {...ortak} />}
      {gt === 'koyu-kart' && <KoyuKart {...ortak} />}
      {gt === 'mor-cerceve' && <MorCerceve {...ortak} />}
      {gt === 'okyanus-liste' && <OkyanusListe {...ortak} />}
      {gt === 'yesil-minimal' && <YesilMinimal {...ortak} />}
      {gt === 'grid-beyaz' && <GridBeyaz {...ortak} />}
    </WidgetKabuk>
  );
}
