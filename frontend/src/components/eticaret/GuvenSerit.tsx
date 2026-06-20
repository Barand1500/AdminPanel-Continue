import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { HeroAyarlari, HeroKart } from '@/types/hero';
import { heroAyarlariBirlestir } from '@/types/hero';

interface GuvenSeritProps {
  heroJson?: HeroAyarlari | null;
}

function KartSarmalayici({ kart, children }: { kart: HeroKart; children: ReactNode }) {
  const link = kart.link?.trim();
  const sinif = 'guven-serit-kart';
  if (!link) return <div className={sinif}>{children}</div>;

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
  const adet = Math.min(kartlar.length, 4);
  const listeSinifi = `guven-serit-liste guven-serit-liste-${adet}`;

  return (
    <section className="guven-serit" aria-label="Güven kartları">
      <div className="guven-serit-icerik">
        <ul className={listeSinifi}>
          {kartlar.map((o) => (
            <li key={o.id} className="guven-serit-hucre">
              <KartSarmalayici kart={o}>
                <span className="guven-serit-ikon" aria-hidden>
                  {o.ikon}
                </span>
                <div className="guven-serit-metin min-w-0">
                  <p className="guven-serit-baslik">{o.baslik}</p>
                  {o.aciklama?.trim() ? <p className="guven-serit-aciklama">{o.aciklama}</p> : null}
                </div>
              </KartSarmalayici>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
