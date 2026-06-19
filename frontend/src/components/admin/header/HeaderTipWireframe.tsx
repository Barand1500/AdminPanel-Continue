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
      <div className="space-y-1 p-2">
        <div className="flex justify-center">
          <div className={`h-2.5 w-8 ${bar}`} />
        </div>
        <div className={`mx-4 h-px ${muted}`} />
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-0.5 w-3 ${line}`} />
          ))}
        </div>
      </div>
    ),
    kompakt: (
      <div className="rounded bg-[#111] p-2">
        <div className="flex items-center gap-1">
          <div className={`h-2 w-4 bg-white/80`} />
          <div className={`h-1.5 w-5 rounded-full bg-white/25`} />
          <div className={`h-1.5 w-5 rounded-full bg-white/25`} />
          <div className={`h-1.5 w-5 rounded-full bg-white/25`} />
          <div className="flex-1" />
          <div className={`h-1.5 w-1.5 rounded-full bg-white/50`} />
        </div>
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
      <div className="relative overflow-hidden rounded bg-[#1a1a1a] p-2">
        <div className="mb-3 flex items-center gap-1">
          <div className="h-1.5 w-4 rounded bg-white/70" />
          <div className="flex-1" />
          <div className="h-0.5 w-8 rounded bg-white/40" />
        </div>
        <div className="flex flex-col items-center gap-1 py-2">
          <div className="h-1 w-10 rounded bg-white/30" />
          <div className="h-2.5 w-14 rounded bg-white/80" />
          <div className="mt-1 flex gap-1">
            <div className="h-1.5 w-6 rounded bg-white/70" />
            <div className="h-1.5 w-6 rounded border border-white/40" />
          </div>
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
