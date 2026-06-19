import type { ReactNode } from 'react';
import type { FooterTipi } from '@/data/footerTipleri';

export function FooterTipWireframe({ tip }: { tip: FooterTipi }) {
  const bar = 'rounded-sm bg-[var(--ap-accent)]/70';
  const muted = 'rounded-sm bg-[var(--ap-border)]';
  const line = 'rounded-sm bg-[var(--ap-muted)]/40';

  const wireframes: Record<FooterTipi, ReactNode> = {
    klasik: (
      <div className="space-y-1 p-2">
        <div className="grid grid-cols-4 gap-1">
          <div className={`h-4 ${bar}`} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-0.5">
              <div className={`h-1 w-6 ${bar}`} />
              <div className={`h-0.5 w-full ${line}`} />
              <div className={`h-0.5 w-full ${line}`} />
            </div>
          ))}
        </div>
        <div className={`h-1 w-full ${muted}`} />
      </div>
    ),
    sade: (
      <div className="space-y-1 p-2">
        <div className="flex items-center justify-between gap-1">
          <div className={`h-2 w-6 ${bar}`} />
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-0.5 w-3 ${line}`} />
            ))}
          </div>
        </div>
        <div className={`mx-auto h-0.5 w-16 ${muted}`} />
      </div>
    ),
    kurumsal: (
      <div className="space-y-1 p-2">
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-0.5">
              <div className={`h-1 w-5 ${bar}`} />
              <div className={`h-0.5 w-full ${line}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 w-8 rounded ${muted}`} />
          ))}
        </div>
      </div>
    ),
    magaza: (
      <div className="space-y-1 p-2">
        <div className={`h-2 w-full rounded ${bar}`} />
        <div className="grid grid-cols-4 gap-0.5">
          <div className={`h-3 ${bar}`} />
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-3 ${line}`} />
          ))}
        </div>
      </div>
    ),
    merkezi: (
      <div className="flex flex-col items-center gap-1 p-2">
        <div className={`h-2.5 w-8 ${bar}`} />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-0.5 w-3 ${line}`} />
          ))}
        </div>
        <div className={`h-0.5 w-12 ${muted}`} />
      </div>
    ),
    newsletter: (
      <div className="space-y-1 p-2">
        <div className="grid grid-cols-3 gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 ${line}`} />
          ))}
        </div>
        <div className="flex gap-1">
          <div className={`h-2 flex-1 rounded ${line}`} />
          <div className={`h-2 w-6 rounded ${bar}`} />
        </div>
      </div>
    ),
    kompakt: (
      <div className="rounded bg-[#111] p-2">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-4 bg-white/70" />
          <div className="flex flex-1 justify-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-0.5 w-3 bg-white/30" />
            ))}
          </div>
        </div>
        <div className="mx-auto mt-1 h-px w-3/4 bg-white/15" />
      </div>
    ),
    detayli: (
      <div className="space-y-1 p-2">
        <div className="grid grid-cols-4 gap-0.5">
          <div className={`h-4 ${bar}`} />
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-4 ${line}`} />
          ))}
        </div>
        <div className={`h-1.5 w-full ${bar}`} />
        <div className="flex justify-center gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 w-6 rounded ${muted}`} />
          ))}
        </div>
        <div className={`h-0.5 w-full ${muted}`} />
      </div>
    ),
  };

  return wireframes[tip] ?? null;
}
