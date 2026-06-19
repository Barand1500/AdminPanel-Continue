import type { HeaderTipi } from '@/data/headerTipleri';

/** Admin kartlarında mini wireframe önizleme */
export function HeaderTipWireframe({ tip }: { tip: HeaderTipi }) {
  const bar = 'rounded-sm bg-[var(--ap-accent)]/70';
  const muted = 'rounded-sm bg-[var(--ap-border)]';
  const line = 'rounded-sm bg-[var(--ap-muted)]/40';

  switch (tip) {
    case 'klasik':
      return (
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
      );
    case 'sade':
      return (
        <div className="flex items-center gap-1 p-2">
          <div className={`h-3 w-6 ${bar}`} />
          <div className={`h-1 flex-1 ${line}`} />
          <div className={`h-2 w-2 ${muted}`} />
          <div className={`h-2 w-2 ${muted}`} />
        </div>
      );
    case 'kompakt':
      return (
        <div className="flex items-center gap-0.5 px-2 py-2.5">
          <div className={`h-2 w-4 ${bar}`} />
          <div className={`h-0.5 flex-1 ${line}`} />
          <div className={`h-1.5 w-1.5 ${muted}`} />
        </div>
      );
    case 'merkez-logo':
      return (
        <div className="flex items-center gap-1 p-2">
          <div className={`h-1 flex-1 ${line}`} />
          <div className={`h-4 w-4 rounded-full ${bar}`} />
          <div className={`h-1 flex-1 ${line}`} />
        </div>
      );
    case 'arama-odakli':
      return (
        <div className="space-y-1 p-2">
          <div className="flex gap-1">
            <div className={`h-2 w-5 ${bar}`} />
            <div className={`h-2 flex-1 rounded-full ${line}`} />
          </div>
          <div className={`h-1 w-full ${line}`} />
        </div>
      );
    case 'modern':
      return (
        <div className="flex items-center gap-1 p-2">
          <div className={`h-3 w-6 ${bar}`} />
          <div className={`h-1 flex-1 ${line}`} />
          <div className={`h-2 w-6 rounded ${bar}`} />
        </div>
      );
    case 'kurumsal':
      return (
        <div className="space-y-1 p-2">
          <div className={`h-2 w-full ${bar}`} />
          <div className="flex gap-1">
            <div className={`h-3 w-7 ${bar}`} />
            <div className={`h-1 flex-1 ${line}`} />
          </div>
          <div className={`h-1.5 w-full ${line}`} />
        </div>
      );
    case 'mega-menu':
      return (
        <div className="space-y-1 p-2">
          <div className={`h-1.5 w-full ${bar}`} />
          <div className="flex gap-1">
            <div className={`h-3 w-6 ${bar}`} />
            <div className={`h-1 flex-1 ${line}`} />
          </div>
          <div className="grid grid-cols-4 gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-2 ${muted}`} />
            ))}
          </div>
        </div>
      );
    case 'seffaf-hero':
      return (
        <div className="relative p-2">
          <div className="absolute inset-0 rounded bg-gradient-to-b from-slate-400/30 to-transparent" />
          <div className="relative flex items-center gap-1">
            <div className={`h-2 w-5 bg-white/80 ${bar}`} />
            <div className="h-0.5 flex-1 bg-white/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      );
    case 'split':
      return (
        <div className="space-y-1 p-2">
          <div className="flex gap-1">
            <div className={`h-3 w-5 ${bar}`} />
            <div className={`h-2 w-6 ${muted}`} />
            <div className="flex-1" />
            <div className={`h-2 w-10 ${line}`} />
          </div>
          <div className={`h-1 w-full ${line}`} />
        </div>
      );
    default:
      return null;
  }
}
