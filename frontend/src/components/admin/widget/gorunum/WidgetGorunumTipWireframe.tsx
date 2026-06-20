import type { ReactNode } from 'react';
import { widgetGorunumTipiNormalize } from '@/data/widgetGorunumTipleri';

const bar = 'rounded-sm bg-[var(--ap-accent)]/70';
const muted = 'rounded-sm bg-[var(--ap-border)]';
const line = 'rounded-sm bg-[var(--ap-muted)]/40';
const orange = 'rounded-sm bg-orange-500/80';

function strip(items: number, cls = line) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className={`h-1 w-3 ${cls}`} />
      ))}
    </div>
  );
}

/** Widget tipi + görünüm varyantı için mini wireframe */
export function WidgetGorunumTipWireframe({
  widgetTip,
  gorunumTipi,
}: {
  widgetTip: string;
  gorunumTipi: string;
}) {
  const tip = widgetGorunumTipiNormalize(widgetTip, gorunumTipi);
  const key = `${widgetTip}:${tip}`;

  const ozel: Record<string, ReactNode> = {
    'MARKA_SERIDI:logo-kayan': (
      <div className="space-y-1 p-2">
        <div className="flex gap-1 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-3 w-6 shrink-0 ${muted}`} />
          ))}
        </div>
      </div>
    ),
    'MARKA_SERIDI:egik-metin-seridi': (
      <div className="overflow-hidden p-1">
        <div className="-rotate-2 rounded bg-orange-500/90 px-2 py-1">
          {strip(4, 'h-0.5 w-2 rounded-sm bg-white/70')}
        </div>
      </div>
    ),
    'MARKA_SERIDI:istatistik-kapsul': (
      <div className="flex justify-center p-2">
        <div className="flex gap-1 rounded-full border border-[var(--ap-border)] px-2 py-1 shadow-sm">
          <div className={`h-2 w-5 ${bar}`} />
          <div className={`h-2 w-5 ${line}`} />
          <div className={`h-2 w-5 ${orange}`} />
        </div>
      </div>
    ),
    'SUREC_ADIMLARI:kart-grid': (
      <div className="grid grid-cols-3 gap-0.5 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-6 rounded border ${muted}`} />
        ))}
      </div>
    ),
    'SUREC_ADIMLARI:koyu-yatay-adim': (
      <div className="rounded bg-slate-800 p-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <div className="h-0.5 w-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    ),
    'SUREC_ADIMLARI:dikey-zaman': (
      <div className="space-y-1 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${bar}`} />
            <div className={`h-1 flex-1 ${line}`} />
          </div>
        ))}
      </div>
    ),
    'ILETISIM_FORMU:merkez-basit': (
      <div className="space-y-1 p-2 text-center">
        <div className={`mx-auto h-1 w-8 ${line}`} />
        <div className={`mx-auto h-0.5 w-12 ${muted}`} />
        <div className={`mx-auto h-2 w-6 rounded ${bar}`} />
      </div>
    ),
    'ILETISIM_FORMU:gradient-banner': (
      <div className="rounded bg-gradient-to-r from-orange-500 to-orange-600 p-2">
        <div className="flex items-center justify-between gap-1">
          <div className="space-y-0.5">
            <div className="h-1 w-6 rounded bg-white/80" />
            <div className="h-0.5 w-8 rounded bg-white/40" />
          </div>
          <div className="h-2 w-5 rounded-full bg-white" />
        </div>
      </div>
    ),
    'ILETISIM_FORMU:bol-split': (
      <div className="flex items-center gap-1 p-2">
        <div className="flex-1 space-y-0.5">
          <div className={`h-1 w-6 ${line}`} />
          <div className={`h-0.5 w-8 ${muted}`} />
        </div>
        <div className={`h-2 w-4 rounded ${bar}`} />
      </div>
    ),
  };

  if (ozel[key]) return ozel[key];

  if (tip.includes('grid') || tip.includes('klasik-grid')) {
    return (
      <div className="grid grid-cols-3 gap-0.5 p-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-3 rounded ${muted}`} />
        ))}
      </div>
    );
  }
  if (tip.includes('cam')) {
    return (
      <div className="grid grid-cols-2 gap-0.5 p-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-5 rounded border border-white/30 bg-white/10 backdrop-blur-sm" />
        ))}
      </div>
    );
  }
  if (tip.includes('minimal') || tip.includes('liste')) {
    return (
      <div className="space-y-0.5 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 w-full ${line}`} />
        ))}
      </div>
    );
  }
  if (tip.includes('banner')) {
    return (
      <div className={`mx-1 h-5 rounded ${bar}`} />
    );
  }
  if (tip.includes('bol-split') || tip.includes('bolunmus')) {
    return (
      <div className="flex gap-0.5 p-2">
        <div className={`h-5 flex-1 ${line}`} />
        <div className={`h-5 flex-1 ${bar}`} />
      </div>
    );
  }
  if (tip.includes('overlay')) {
    return (
      <div className="relative p-2">
        <div className={`h-6 w-full rounded ${muted}`} />
        <div className="absolute inset-x-3 bottom-3 h-1 rounded bg-white/80" />
      </div>
    );
  }
  if (tip.includes('kapsul') || tip.includes('pill')) {
    return (
      <div className="flex justify-center gap-0.5 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-2 w-4 rounded-full ${i === 2 ? bar : muted}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      <div className={`h-1 w-6 ${bar}`} />
      <div className={`h-3 w-full ${line}`} />
      <div className={`h-1 w-4 ${muted}`} />
    </div>
  );
}
