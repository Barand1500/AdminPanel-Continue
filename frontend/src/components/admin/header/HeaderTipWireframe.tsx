import type { ReactNode } from 'react';
import type { HeaderTipi } from '@/data/headerTipleri';

export function HeaderTipWireframe({ tip }: { tip: HeaderTipi }) {
  const bar = 'rounded-sm bg-[var(--ap-accent)]/70';
  const muted = 'rounded-sm bg-[var(--ap-border)]';
  const line = 'rounded-sm bg-[var(--ap-muted)]/40';

  const wireframes: Record<HeaderTipi, ReactNode> = {
    klasik: (
      <div className="space-y-1 p-2">
        <div className={`h-1.5 w-full ${bar}`} />
        <div className="flex items-center gap-1">
          <div className={`h-3 w-6 ${bar}`} />
          <div className={`h-1.5 flex-1 ${line}`} />
          <div className={`h-2 w-2 ${muted}`} />
        </div>
        <div className="flex gap-1">
          <div className={`h-2 w-8 ${muted}`} />
          <div className={`h-2 flex-1 ${line}`} />
        </div>
      </div>
    ),
    sade: (
      <div className="flex items-center gap-1 p-2">
        <div className={`h-3 w-6 ${bar}`} />
        <div className={`h-1 flex-1 ${line}`} />
        <div className={`h-2 w-2 ${muted}`} />
      </div>
    ),
    kompakt: (
      <div className="flex items-center gap-0.5 px-2 py-2.5">
        <div className={`h-2 w-4 ${bar}`} />
        <div className={`h-0.5 flex-1 ${line}`} />
        <div className={`h-1.5 w-1.5 ${muted}`} />
      </div>
    ),
    'merkez-logo': (
      <div className="flex items-center gap-1 p-2">
        <div className={`h-1 flex-1 ${line}`} />
        <div className={`h-4 w-4 rounded-full ${bar}`} />
        <div className={`h-1 flex-1 ${line}`} />
      </div>
    ),
    'arama-odakli': (
      <div className="space-y-1 p-2">
        <div className="flex gap-1">
          <div className={`h-2 w-5 ${bar}`} />
          <div className={`h-2 flex-1 rounded-full ${line}`} />
        </div>
        <div className={`h-1 w-full ${line}`} />
      </div>
    ),
    modern: (
      <div className="flex items-center gap-1 p-2">
        <div className={`h-3 w-6 ${bar}`} />
        <div className={`h-1 flex-1 ${line}`} />
        <div className={`h-2 w-6 rounded ${bar}`} />
      </div>
    ),
    kurumsal: (
      <div className="space-y-1 p-2">
        <div className={`h-2 w-full ${bar}`} />
        <div className="flex gap-1">
          <div className={`h-3 w-7 ${bar}`} />
          <div className={`h-1 flex-1 ${line}`} />
        </div>
      </div>
    ),
    'mega-menu': (
      <div className="space-y-1 p-2">
        <div className={`h-1.5 w-full ${bar}`} />
        <div className="grid grid-cols-4 gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-2 ${muted}`} />
          ))}
        </div>
      </div>
    ),
    'seffaf-hero': (
      <div className="relative p-2">
        <div className="absolute inset-0 rounded bg-gradient-to-b from-slate-400/30 to-transparent" />
        <div className="relative flex items-center gap-1">
          <div className="h-2 w-5 bg-white/80" />
          <div className="h-0.5 flex-1 bg-white/50" />
        </div>
      </div>
    ),
    split: (
      <div className="space-y-1 p-2">
        <div className="flex gap-1">
          <div className={`h-3 w-5 ${bar}`} />
          <div className="flex-1" />
          <div className={`h-2 w-10 ${line}`} />
        </div>
        <div className={`h-1 w-full ${line}`} />
      </div>
    ),
  };

  return wireframes[tip] ?? null;
}
