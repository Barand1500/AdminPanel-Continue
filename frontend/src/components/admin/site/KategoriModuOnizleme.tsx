import type { KategoriAcilisModu } from '@/types/header';
import { kategoriler } from '@/data/kategoriler';

/** Admin onizleme — acik kategori menusunun minimal semasi */
export function KategoriModuOnizleme({
  mod,
  baslik,
  onKapat,
}: {
  mod: KategoriAcilisModu;
  baslik: string;
  onKapat?: () => void;
}) {
  const ornek = kategoriler.slice(0, 3);

  const kapatBtn = onKapat ? (
    <button
      type="button"
      onClick={onKapat}
      className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      aria-label="Kapat"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  ) : (
    <span className="text-[8px] text-slate-400">✕</span>
  );

  if (mod === 'sidebar') {
    return (
      <div className="relative mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex h-28">
          <div className="flex w-[38%] flex-col border-r border-slate-100 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1">
              <span className="truncate text-[9px] font-bold text-slate-800">{baslik}</span>
              {kapatBtn}
            </div>
            <div className="scrollbar-hide flex-1 overflow-y-auto p-1.5">
              {ornek.map((k) => (
                <p key={k.id} className="mb-1 text-[8px] font-bold uppercase text-primary">
                  {k.baslik}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-slate-900/10" />
        </div>
      </div>
    );
  }

  if (mod === 'liste') {
    return (
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1">
          <span className="text-[9px] font-semibold text-slate-700">{baslik}</span>
          {kapatBtn}
        </div>
        <div className="scrollbar-hide max-h-24 overflow-y-auto p-1.5">
          {ornek.map((k) => (
            <div key={k.id} className="border-b border-slate-50 py-1 last:border-0">
              <p className="text-[8px] font-semibold text-slate-800">{k.baslik}</p>
              {k.altKategoriler?.slice(0, 2).map((alt) => (
                <p key={alt.id} className="pl-2 text-[7px] text-slate-500">
                  {alt.baslik}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1">
        <span className="text-[9px] font-semibold text-slate-700">{baslik}</span>
        {kapatBtn}
      </div>
      <div className="grid grid-cols-[72px_1fr]">
        <div className="space-y-0.5 border-r border-slate-100 bg-slate-50 p-1">
          {ornek.map((k, i) => (
            <p
              key={k.id}
              className={`truncate rounded px-1 py-0.5 text-[7px] ${
                i === 0 ? 'bg-white font-semibold text-primary' : 'text-slate-600'
              }`}
            >
              {k.baslik}
            </p>
          ))}
        </div>
        <div className="p-1.5">
          <p className="mb-1 text-[7px] font-bold uppercase text-primary">{ornek[0]?.baslik}</p>
          {ornek[0]?.altKategoriler?.slice(0, 2).map((alt) => (
            <p key={alt.id} className="text-[7px] text-slate-600">
              {alt.baslik}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
