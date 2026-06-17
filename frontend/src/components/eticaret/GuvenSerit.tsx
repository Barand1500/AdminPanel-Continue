import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { HeroAyarlari, HeroKart } from '@/types/hero';
import { heroAyarlariBirlestir } from '@/types/hero';

interface GuvenSeritProps {
  heroJson?: HeroAyarlari | null;
}

function KartSarmalayici({ kart, children }: { kart: HeroKart; children: ReactNode }) {
  const link = kart.link?.trim();
  if (!link) return <>{children}</>;

  const sinif = 'flex items-center gap-3 transition hover:opacity-90';
  if (link.startsWith('http')) {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={sinif}>
        {children}
      </a>
    );
  }
  const yol = link.startsWith('/') ? link : `/${link}`;
  return (
    <Link to={yol} className={sinif}>
      {children}
    </Link>
  );
}

export function GuvenSerit({ heroJson }: GuvenSeritProps) {
  const hero = heroAyarlariBirlestir(heroJson);

  if (!hero.kartlarAktif || hero.kartlar.length === 0) {
    return null;
  }

  const kartlar = [...hero.kartlar].sort((a, b) => a.sira - b.sira);
  const kolonSinifi =
    kartlar.length === 1
      ? 'grid-cols-1'
      : kartlar.length === 2
        ? 'grid-cols-2'
        : kartlar.length === 3
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="guven-serit border-y border-primary/10 bg-white">
      <div className={`container-site grid gap-4 py-6 ${kolonSinifi}`}>
        {kartlar.map((o) => (
          <KartSarmalayici key={o.id} kart={o}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg">
              {o.ikon}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">{o.baslik}</p>
              <p className="truncate text-[10px] text-slate-500 sm:text-xs">{o.aciklama}</p>
            </div>
          </KartSarmalayici>
        ))}
      </div>
    </section>
  );
}
