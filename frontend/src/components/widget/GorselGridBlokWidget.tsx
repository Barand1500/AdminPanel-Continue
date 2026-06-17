import { useEffect, useRef, useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

function kartlariFiltrele(
  kartlar: NonNullable<ReturnType<typeof configOkuFromWidget>['gridKartlar']>,
  filtreler: string[],
  seciliIndeks: number
) {
  if (filtreler.length === 0 || seciliIndeks === 0) return kartlar;
  const seciliKategori = filtreler[seciliIndeks];
  return kartlar.filter((k) => !k.filtreEtiketi || k.filtreEtiketi === seciliKategori);
}

export function GorselGridBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.gridKartlar ?? [];
  const filtreler = cfg.filtreler ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;

  const [seciliIndeks, setSeciliIndeks] = useState(0);
  const [filtreAcik, setFiltreAcik] = useState(false);
  const filtreRef = useRef<HTMLDivElement>(null);

  const gosterilenKartlar = kartlariFiltrele(kartlar, filtreler, seciliIndeks);
  const seciliFiltre = filtreler[seciliIndeks] ?? '';

  useEffect(() => {
    if (!filtreAcik) return;
    function disariTikla(e: MouseEvent) {
      if (filtreRef.current && !filtreRef.current.contains(e.target as Node)) {
        setFiltreAcik(false);
      }
    }
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, [filtreAcik]);

  return (
    <WidgetKabuk widget={widget}>
      <div className="grid gap-6 lg:grid-cols-[minmax(240px,1fr)_2fr]">
        <div className="gorsel-grid-sol rounded-2xl bg-white p-6 shadow-sm">
          {cfg.solBaslik && (
            <h2 className={`${baslikSinifi(cfg)} font-bold text-primary`}>{cfg.solBaslik}</h2>
          )}
          {cfg.solAciklama && <p className="mt-3 text-sm leading-relaxed text-slate-600">{cfg.solAciklama}</p>}

          {filtreler.length > 0 && (
            <div ref={filtreRef} className="gorsel-grid-filtre relative mt-5">
              <button
                type="button"
                className="gorsel-grid-filtre-tus"
                onClick={() => setFiltreAcik((o) => !o)}
                aria-expanded={filtreAcik}
              >
                <span>{seciliFiltre}</span>
                <span className={`gorsel-grid-filtre-ok ${filtreAcik ? 'gorsel-grid-filtre-ok-acik' : ''}`}>▾</span>
              </button>
              {filtreAcik && (
                <ul className="gorsel-grid-filtre-liste">
                  {filtreler.map((f, i) => (
                    <li key={`${f}-${i}`}>
                      <button
                        type="button"
                        className={`gorsel-grid-filtre-oge ${i === seciliIndeks ? 'gorsel-grid-filtre-oge-aktif' : ''}`}
                        onClick={() => {
                          setSeciliIndeks(i);
                          setFiltreAcik(false);
                        }}
                      >
                        {f}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {gosterilenKartlar.map((k) => (
            <a key={k.id} href={k.link || '#'} className="group relative overflow-hidden rounded-2xl">
              {k.gorselUrl && (
                <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className={`aspect-square w-full ${gorselSinifi(cfg)}`} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 pb-3 pt-10">
                <span className="text-sm font-semibold text-white">{k.etiket}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </WidgetKabuk>
  );
}
