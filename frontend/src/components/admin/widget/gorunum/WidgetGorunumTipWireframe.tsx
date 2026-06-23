import type { ReactNode } from 'react';
import {
  WIDGET_GORUNUM_TEMA_RENKLERI,
  widgetGorunumTipTanimiBul,
  widgetGorunumTipiNormalize,
} from '@/data/widgetGorunumTipleri';

const bar = 'rounded-sm';
const line = 'rounded-sm';

function strip(items: number, cls: string) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className={`h-1 w-3 ${cls}`} />
      ))}
    </div>
  );
}

/** Widget tipi + görünüm varyantı için renkli mini wireframe */
export function WidgetGorunumTipWireframe({
  widgetTip,
  gorunumTipi,
}: {
  widgetTip: string;
  gorunumTipi: string;
}) {
  const tip = widgetGorunumTipiNormalize(widgetTip, gorunumTipi);
  const tanim = widgetGorunumTipTanimiBul(widgetTip, tip);
  const renk = WIDGET_GORUNUM_TEMA_RENKLERI[tanim.tema];
  const key = `${widgetTip}:${tip}`;

  const ozel: Record<string, ReactNode> = {
    'MARKA_SERIDI:neon-gece': (
      <div className="rounded p-2" style={{ background: '#0f172a' }}>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-[8px] font-bold" style={{ color: '#38bdf8' }}>
              ABC
            </span>
          ))}
        </div>
      </div>
    ),
    'MARKA_SERIDI:dalga-mor': (
      <div className="rounded p-2" style={{ background: `linear-gradient(90deg, ${renk.accent}, #ec4899)` }}>
        {strip(3, `${bar} h-0.5 w-4 bg-white/80`)}
      </div>
    ),
    'MARKA_SERIDI:cift-serit': (
      <div className="space-y-1 p-1" style={{ background: renk.bg }}>
        <div className="flex gap-1 rounded px-1 py-0.5" style={{ background: renk.accent, opacity: 0.9 }}>{strip(3, `${bar} h-0.5 w-2 bg-white/70`)}</div>
        <div className="flex gap-1 rounded px-1 py-0.5 opacity-70" style={{ background: renk.surface }}>{strip(3, `${bar} h-0.5 w-2`)}</div>
      </div>
    ),
    'SUREC_ADIMLARI:renkli-kart': (
      <div className="grid grid-cols-3 gap-0.5 p-1">
        {['#9333ea', '#2563eb', '#059669'].map((c) => (
          <div key={c} className="h-5 rounded border-2" style={{ borderColor: c, background: `${c}18` }} />
        ))}
      </div>
    ),
    'ILETISIM_FORMU:koyu-cam': (
      <div className="rounded p-2" style={{ background: `${renk.bg}dd`, border: `1px solid ${renk.accent}50` }}>
        <div className="h-1 w-8 rounded" style={{ background: renk.accent }} />
      </div>
    ),
    'ILETISIM_FORMU:mor-serit': (
      <div className="rounded p-2" style={{ background: renk.accent }}>
        <div className="h-1 w-6 rounded bg-white/80" />
      </div>
    ),
    'SLIDER:split-ozellik-vitrin': (
      <div className="flex gap-0.5 p-1">
        <div className="h-5 flex-1 rounded-l p-1" style={{ background: renk.bg }}>
          <div className="h-0.5 w-2 rounded" style={{ background: renk.accent }} />
          <div className="mt-0.5 h-0.5 w-4 rounded" style={{ background: renk.text, opacity: 0.2 }} />
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded" style={{ background: renk.surface }} />
            ))}
          </div>
        </div>
        <div className="relative h-5 w-5 rounded-full" style={{ background: renk.surface }}>
          <div className="absolute inset-1 rounded-full border border-dashed" style={{ borderColor: `${renk.accent}55` }} />
        </div>
      </div>
    ),
    'SLIDER:cam-hero-beyaz': (
      <div className="relative h-6 overflow-hidden rounded p-1" style={{ background: renk.bg }}>
        <div className="absolute inset-0 opacity-40" style={{ background: renk.accent }} />
        <div className="relative mx-2 mt-2 rounded bg-white/70 p-1 backdrop-blur">
          <div className="h-0.5 w-4 rounded" style={{ background: renk.text, opacity: 0.3 }} />
        </div>
      </div>
    ),
    'SLIDER:orbit-merkez': (
      <div className="relative flex h-6 items-center justify-center p-1" style={{ background: renk.bg }}>
        <div className="absolute h-5 w-5 rounded-full border border-dashed" style={{ borderColor: `${renk.accent}44` }} />
        <div className="h-2 w-2 rounded-full" style={{ background: renk.accent }} />
      </div>
    ),
    'SLIDER:badge-modern': (
      <div className="space-y-1 p-1" style={{ background: renk.bg }}>
        <div className="h-0.5 w-2 rounded" style={{ background: renk.accent }} />
        <div className="h-1 w-5 rounded" style={{ background: renk.text, opacity: 0.25 }} />
        <div className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2 flex-1 rounded" style={{ background: renk.surface }} />
          ))}
        </div>
      </div>
    ),
    'SLIDER:sinematik-acik': (
      <div className="flex gap-0.5 p-1">
        <div className="h-5 flex-1 rounded-l" style={{ background: `linear-gradient(135deg, ${renk.surface}, ${renk.accent}44)` }} />
        <div className="h-5 flex-1 rounded-r p-1" style={{ background: renk.bg }}>
          <div className="h-0.5 w-3 rounded" style={{ background: renk.accent }} />
        </div>
      </div>
    ),
    'SLIDER:gradient-split': (
      <div className="flex gap-0.5 rounded p-1" style={{ background: `linear-gradient(135deg, ${renk.accent}, #6366f1)` }}>
        <div className="h-5 flex-1 rounded-l p-1">
          <div className="h-0.5 w-3 rounded bg-white/70" />
        </div>
        <div className="h-5 w-3 rounded-r bg-white/20" />
      </div>
    ),
    'UCRETSIZ_DENEME:split-form-sol': (
      <div className="flex gap-0.5 p-1">
        <div className="h-5 flex-1 rounded-l p-1" style={{ background: renk.bg }}>
          <div className="h-0.5 w-3 rounded" style={{ background: renk.text, opacity: 0.25 }} />
          <div className="mt-0.5 grid grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1 rounded" style={{ background: renk.surface }} />
            ))}
          </div>
        </div>
        <div className="h-5 w-4 rounded-r p-0.5" style={{ background: renk.surface }}>
          <div className="h-0.5 w-full rounded" style={{ background: renk.accent, opacity: 0.5 }} />
          <div className="mt-0.5 h-1 w-full rounded" style={{ background: renk.accent }} />
        </div>
      </div>
    ),
    'UCRETSIZ_DENEME:split-form-ters': (
      <div className="flex gap-0.5 p-1">
        <div className="h-5 w-4 rounded-l p-0.5" style={{ background: renk.surface }}>
          <div className="h-1 w-full rounded" style={{ background: renk.accent }} />
        </div>
        <div className="h-5 flex-1 rounded-r p-1" style={{ background: renk.bg }}>
          <div className="h-0.5 w-3 rounded" style={{ background: renk.text, opacity: 0.25 }} />
        </div>
      </div>
    ),
    'UCRETSIZ_DENEME:dikey-ortali': (
      <div className="space-y-0.5 p-1 text-center" style={{ background: renk.bg }}>
        <div className="mx-auto h-0.5 w-4 rounded" style={{ background: renk.text, opacity: 0.3 }} />
        <div className="mx-auto grid w-3/4 grid-cols-2 gap-0.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-1 rounded" style={{ background: renk.surface }} />
          ))}
        </div>
        <div className="mx-auto h-2 w-2/3 rounded" style={{ background: renk.surface }} />
      </div>
    ),
    'UCRETSIZ_DENEME:minimal-ortali': (
      <div className="space-y-1 p-1 text-center" style={{ background: renk.bg }}>
        <div className="mx-auto h-0.5 w-4 rounded" style={{ background: renk.text, opacity: 0.3 }} />
        <div className="mx-auto h-2 w-2/3 rounded" style={{ background: renk.surface }} />
      </div>
    ),
    'UCRETSIZ_DENEME:blob-arkaplan': (
      <div className="relative h-6 overflow-hidden rounded p-1" style={{ background: renk.surface }}>
        <div className="relative z-10 flex gap-0.5">
          <div className="h-4 flex-1 rounded bg-white/80 p-0.5">
            <div className="h-0.5 w-2 rounded" style={{ background: renk.accent }} />
          </div>
          <div className="h-4 w-3 rounded bg-white/90" />
        </div>
      </div>
    ),
    'UCRETSIZ_DENEME:kart-golge': (
      <div className="p-1" style={{ background: renk.surface }}>
        <div className="flex gap-0.5 rounded bg-white p-1 shadow-sm">
          <div className="h-4 flex-1 rounded" style={{ background: renk.bg }} />
          <div className="h-4 w-3 rounded" style={{ background: `${renk.accent}33` }} />
        </div>
      </div>
    ),
  };

  const icerik =
    ozel[key] ??
    (tip.includes('grid') || tip.includes('kart') ? (
      <div className="grid grid-cols-3 gap-0.5 p-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-3 rounded opacity-80"
            style={{ background: i === 1 ? renk.accent : renk.surface }}
          />
        ))}
      </div>
    ) : tip.includes('liste') || tip.includes('minimal') || tip.includes('kompakt') ? (
      <div className="space-y-0.5 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-full ${line} h-1`} style={{ background: renk.accent, opacity: 0.25 + i * 0.15 }} />
        ))}
      </div>
    ) : tip.includes('banner') || tip.includes('serit') ? (
      <div className="mx-1 h-5 rounded" style={{ background: `linear-gradient(90deg, ${renk.surface}, ${renk.accent}55)` }} />
    ) : tip.includes('bol') || tip.includes('split') || tip.includes('bolunmus') ? (
      <div className="flex gap-0.5 p-2">
        <div className="h-5 flex-1 rounded" style={{ background: renk.surface }} />
        <div className="h-5 flex-1 rounded" style={{ background: renk.accent }} />
      </div>
    ) : (
      <div className="space-y-1 p-2">
        <div className={`w-6 ${bar} h-2`} style={{ background: renk.accent }} />
        <div className={`w-full ${line} h-1`} style={{ background: renk.text, opacity: 0.2 }} />
      </div>
    ));

  return (
    <div className="rounded-md" style={{ background: renk.bg }}>
      {icerik}
    </div>
  );
}
