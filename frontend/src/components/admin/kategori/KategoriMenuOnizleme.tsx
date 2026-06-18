import { useState } from 'react';
import type { KategoriAcilisModu } from '@/types/header';
import type { NavKategoriAgacDugumu } from '@/types/navKategori';

interface KategoriMenuOnizlemeProps {
  kategoriler: NavKategoriAgacDugumu[];
  baslikMetni?: string;
  acilisModu?: KategoriAcilisModu;
}

/** Admin panel — header kategori menüsü önizlemesi */
export function KategoriMenuOnizleme({
  kategoriler,
  baslikMetni = 'Tüm Kategoriler',
  acilisModu = 'dropdown',
}: KategoriMenuOnizlemeProps) {
  const [aktifId, setAktifId] = useState(kategoriler[0]?.id ?? '');
  const secili = kategoriler.find((k) => k.id === aktifId) ?? kategoriler[0];

  if (kategoriler.length === 0) {
    return (
      <div className="ap-kategori-onizleme-bos rounded-xl border border-dashed border-[var(--ap-border)] p-6 text-center">
        <p className="ap-muted text-sm">Henüz kategori yok. Sol listeden veya Yeni Ekle ile başlayın.</p>
      </div>
    );
  }

  if (acilisModu === 'liste') {
    return (
      <div className="ap-kategori-onizleme rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">{baslikMetni}</div>
        <div className="max-h-64 overflow-y-auto p-2">
          {kategoriler.map((kat) => (
            <div key={kat.id} className="border-b border-slate-50 py-2 last:border-0">
              <p className="text-xs font-bold uppercase text-primary">{kat.baslik}</p>
              {kat.altKategoriler?.map((alt) => (
                <p key={alt.id} className="pl-2 text-xs text-slate-600">
                  {alt.baslik}
                  {alt.altKategoriler?.map((c) => (
                    <span key={c.id} className="ap-muted"> · {c.baslik}</span>
                  ))}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (acilisModu === 'sidebar') {
    return (
      <div className="ap-kategori-onizleme flex h-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex w-2/5 flex-col border-r border-slate-100">
          <div className="border-b border-slate-100 px-3 py-2 text-sm font-bold text-slate-900">{baslikMetni}</div>
          <div className="flex-1 overflow-y-auto p-2">
            {kategoriler.map((kat) => (
              <p key={kat.id} className="mb-2 text-xs font-bold uppercase text-primary">
                {kat.baslik}
              </p>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-slate-100/60" />
      </div>
    );
  }

  return (
    <div className="ap-kategori-onizleme overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">{baslikMetni}</span>
        <span className="ap-muted flex-1 truncate text-xs">Mega menü önizlemesi</span>
      </div>
      <div className="grid sm:grid-cols-[180px_1fr]">
        <div className="space-y-0.5 border-r border-slate-100 bg-slate-50/80 p-2">
          {kategoriler.map((kat) => (
            <button
              key={kat.id}
              type="button"
              onClick={() => setAktifId(kat.id)}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm ${
                aktifId === kat.id ? 'bg-white font-medium text-primary shadow-sm' : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              <span className="truncate">{kat.baslik}</span>
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </div>
        <div className="p-3">
          {secili && (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{secili.baslik}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {secili.altKategoriler?.map((alt) => (
                  <div key={alt.id} className="rounded-lg border border-slate-100 bg-slate-50/80 p-2">
                    <p className="text-sm font-semibold text-slate-900">{alt.baslik}</p>
                    {alt.altKategoriler && alt.altKategoriler.length > 0 && (
                      <ul className="mt-1 space-y-0.5 border-l border-slate-200 pl-2">
                        {alt.altKategoriler.map((c) => (
                          <li key={c.id} className="text-xs text-slate-600">
                            {c.baslik}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
