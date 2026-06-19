import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { Kategori } from '@/data/kategoriler';
import type { KategoriAcilisModu } from '@/types/header';
import { kategoriAcilisModuNormalize } from '@/types/header';

interface KategoriMenuProps {
  baslikMetni?: string;
  acilisModu?: KategoriAcilisModu | string;
  kategoriler?: Kategori[];
  mega?: boolean;
  kolonSayisi?: 3 | 4 | 5;
}

function AltKategoriListesi({
  liste,
  derinlik = 0,
  onSec,
}: {
  liste: Kategori[];
  derinlik?: number;
  onSec?: () => void;
}) {
  return (
    <ul className={derinlik > 0 ? 'mt-1 space-y-0.5 border-l border-slate-200 pl-3' : 'space-y-1'}>
      {liste.map((kat) => (
        <li key={kat.id}>
          {kat.yol ? (
            <Link
              to={kat.yol}
              onClick={onSec}
              className="block rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-violet-50 hover:text-primary"
            >
              {kat.baslik}
            </Link>
          ) : (
            <span className="block px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              {kat.baslik}
            </span>
          )}
          {kat.altKategoriler && kat.altKategoriler.length > 0 && (
            <AltKategoriListesi liste={kat.altKategoriler} derinlik={derinlik + 1} onSec={onSec} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function KategoriMenu({
  baslikMetni = 'Tüm Kategoriler',
  acilisModu: acilisModuProp = 'dropdown',
  kategoriler: kategoriListesi = [],
  mega = false,
  kolonSayisi = 4,
}: KategoriMenuProps) {
  const acilisModu = kategoriAcilisModuNormalize(acilisModuProp);
  const [acik, setAcik] = useState(false);
  const [aktifKat, setAktifKat] = useState(kategoriListesi[0]?.id ?? '');
  const ref = useRef<HTMLDivElement>(null);

  const secili = kategoriListesi.find((k) => k.id === aktifKat);

  useEffect(() => {
    setAktifKat(kategoriListesi[0]?.id ?? '');
  }, [kategoriListesi]);

  useEffect(() => {
    setAcik(false);
  }, [acilisModu]);

  useEffect(() => {
    function disariTikla(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAcik(false);
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, []);

  useEffect(() => {
    if (!acik || acilisModu !== 'sidebar') return;
    const html = document.documentElement;
    const oncekiHtml = html.style.overflow;
    const oncekiBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = oncekiHtml;
      document.body.style.overflow = oncekiBody;
    };
  }, [acik, acilisModu]);

  if (kategoriListesi.length === 0) return null;

  const kapat = () => setAcik(false);

  const tetikleyici = (
    <button
      type="button"
      onClick={() => setAcik((a) => !a)}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
        acik
          ? 'border-primary bg-primary text-white shadow-md shadow-primary/25'
          : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:border-primary hover:text-primary'
      }`}
    >
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span className="truncate">{baslikMetni}</span>
      <svg
        className={`h-3.5 w-3.5 shrink-0 transition ${acik ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  if (acilisModu === 'sidebar') {
    return (
      <div ref={ref} className="kategori-menu-root relative hidden shrink-0 sm:block">
        {tetikleyici}
        {acik && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
              onClick={kapat}
              aria-hidden
            />
            <aside className="kategori-menu-panel fixed left-0 top-0 z-50 flex h-full w-[min(320px,90vw)] flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <p className="font-bold text-slate-900">{baslikMetni}</p>
                <button type="button" onClick={kapat} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="scrollbar-hide flex-1 overflow-y-auto p-4">
                {kategoriListesi.map((kat) => (
                  <div key={kat.id} className="mb-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{kat.baslik}</p>
                    {kat.altKategoriler && (
                      <AltKategoriListesi liste={kat.altKategoriler} onSec={kapat} />
                    )}
                  </div>
                ))}
              </div>
            </aside>
          </>
        )}
      </div>
    );
  }

  if (acilisModu === 'liste') {
    return (
      <div ref={ref} className="kategori-menu-root relative hidden shrink-0 sm:block">
        {tetikleyici}
        {acik && (
          <div className="kategori-menu-panel absolute left-0 top-full z-50 mt-2 w-[min(300px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800">
              {baslikMetni}
            </div>
            <div className="scrollbar-hide max-h-[min(420px,60vh)] overflow-y-auto p-2">
              {kategoriListesi.map((kat) => (
                <div key={kat.id} className="border-b border-slate-100 py-2 last:border-0">
                  <p className="px-2 text-xs font-bold uppercase tracking-wide text-primary">{kat.baslik}</p>
                  {kat.altKategoriler && (
                    <AltKategoriListesi liste={kat.altKategoriler} onSec={kapat} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`kategori-menu-root relative hidden shrink-0 sm:block ${mega ? 'kategori-menu--mega' : ''}`}>
      {tetikleyici}

      {acik && (
        <div
          className={`kategori-menu-panel absolute left-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 ${
            mega ? 'w-[min(960px,calc(100vw-2rem))]' : 'w-[min(720px,calc(100vw-2rem))]'
          }`}
        >
          <div className="grid sm:grid-cols-[200px_1fr]">
            <div className="border-r border-slate-200 bg-slate-50 p-2">
              {kategoriListesi.map((kat) => (
                <button
                  key={kat.id}
                  type="button"
                  onMouseEnter={() => setAktifKat(kat.id)}
                  onClick={() => setAktifKat(kat.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    aktifKat === kat.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{kat.baslik}</span>
                  <span className="text-slate-400">›</span>
                </button>
              ))}
            </div>
            <div className="bg-white p-4">
              {secili && (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                    {secili.baslik}
                  </p>
                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${mega ? kolonSayisi : 2}, minmax(0, 1fr))` }}
                  >
                    {secili.altKategoriler?.map((alt) => (
                      <div key={alt.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        {alt.yol ? (
                          <Link
                            to={alt.yol}
                            onClick={kapat}
                            className="font-semibold text-slate-900 hover:text-primary"
                          >
                            {alt.baslik}
                          </Link>
                        ) : (
                          <p className="font-semibold text-slate-900">{alt.baslik}</p>
                        )}
                        {alt.altKategoriler && (
                          <AltKategoriListesi liste={alt.altKategoriler} derinlik={1} onSec={kapat} />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
