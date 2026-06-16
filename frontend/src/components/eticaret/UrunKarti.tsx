import type { Urun } from '@/types/site';

interface UrunKartiProps {
  urun: Urun;
}

function fiyatFormat(fiyat: number, birim: string) {
  if (birim === 'USD' || birim === '$') return `${fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} $`;
  return `${fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
}

export function UrunKarti({ urun }: UrunKartiProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-primary/30 hover:shadow-lg">
      {urun.yeni && (
        <span className="absolute left-2 top-2 z-10 rounded bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
          Yeni
        </span>
      )}
      {!urun.stokta && (
        <span className="absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-cyan-500/90 py-2 text-center text-xs font-bold text-white">
          STOKTA YOK!
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-slate-50 p-4">
        {urun.gorselUrl ? (
          <img src={urun.gorselUrl} alt={urun.ad} className="h-full w-full object-contain transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-slate-300">📦</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-snug text-slate-800 sm:text-sm">
          {urun.ad}
        </h3>

        <div className="my-2 flex gap-0.5 text-slate-300">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i}>★</span>
          ))}
        </div>

        <p className="text-base font-bold text-primary sm:text-lg">
          {fiyatFormat(urun.fiyat, urun.paraBirimi)}
        </p>
        <p className="text-[10px] text-primary/70">+ KDV (%20)</p>

        <button
          type="button"
          disabled={!urun.stokta}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          Sepete Ekle
          <span>🛒</span>
        </button>
      </div>
    </article>
  );
}
