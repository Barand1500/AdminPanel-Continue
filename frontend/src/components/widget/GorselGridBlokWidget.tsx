import { useEffect, useRef, useState } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
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

function GridKart({
  k,
  cfg,
  sinif = 'group relative overflow-hidden rounded-2xl',
}: {
  k: NonNullable<ReturnType<typeof configOkuFromWidget>['gridKartlar']>[number];
  cfg: ReturnType<typeof configOkuFromWidget>;
  sinif?: string;
}) {
  return (
    <a key={k.id} href={k.link || '#'} className={sinif}>
      {k.gorselUrl && (
        <img src={medyaUrl(k.gorselUrl)} alt={k.etiket} className={`aspect-square w-full ${gorselSinifi(cfg)}`} />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 pb-3 pt-10">
        <span className="text-sm font-semibold text-white">{k.etiket}</span>
      </div>
    </a>
  );
}

export function GorselGridBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.gridKartlar ?? [];
  const filtreler = cfg.filtreler ?? [];
  const kolon = cfg.gorunum?.kolonSayisi ?? 4;
  const gt = widgetGorunumTipiAl(widget);

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

  const solPanel = (
    <div className="gorsel-grid-sol rounded-2xl bg-white p-6 shadow-sm">
      {cfg.solBaslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-primary`}>{cfg.solBaslik}</h2>}
      {cfg.solAciklama && <p className="mt-3 text-sm leading-relaxed text-slate-600">{cfg.solAciklama}</p>}
      {filtreler.length > 0 && (
        <div ref={filtreRef} className="gorsel-grid-filtre relative mt-5">
          <button type="button" className="gorsel-grid-filtre-tus" onClick={() => setFiltreAcik((o) => !o)} aria-expanded={filtreAcik}>
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
  );

  if (gt === 'tam-grid-mavi') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ggb-tam-grid rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 p-6">
          <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
            {gosterilenKartlar.map((k) => (
              <GridKart key={k.id} k={k} cfg={cfg} sinif="group relative overflow-hidden rounded-xl ring-2 ring-blue-200 transition hover:ring-blue-500" />
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'hero-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ggb-hero-kart grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {gosterilenKartlar.map((k, i) => (
            <div key={k.id} className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
              <GridKart k={k} cfg={cfg} sinif="group relative h-full min-h-[160px] overflow-hidden rounded-2xl shadow-lg" />
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'koyu-overlay') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ggb-koyu-overlay rounded-2xl bg-slate-900 p-6">
          <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
            {gosterilenKartlar.map((k) => (
              <GridKart key={k.id} k={k} cfg={cfg} sinif="group relative overflow-hidden rounded-xl ring-1 ring-white/10" />
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'yesil-filtre') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ggb-yesil-filtre">
          {filtreler.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filtreler.map((f, i) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSeciliIndeks(i)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    i === seciliIndeks ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
            {gosterilenKartlar.map((k) => (
              <GridKart key={k.id} k={k} cfg={cfg} sinif="group relative overflow-hidden rounded-xl border-2 border-emerald-200" />
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-vurgu') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {gosterilenKartlar.map((k) => (
            <GridKart
              key={k.id}
              k={k}
              cfg={cfg}
              sinif="group relative overflow-hidden rounded-2xl border-2 border-transparent transition hover:border-orange-500 hover:shadow-orange-200/50 hover:shadow-lg"
            />
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="ggb-sol-panel grid gap-6 lg:grid-cols-[minmax(240px,1fr)_2fr]">
        {solPanel}
        <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...cfg.gorunum, kolonSayisi: kolon } })}>
          {gosterilenKartlar.map((k) => (
            <GridKart key={k.id} k={k} cfg={cfg} />
          ))}
        </div>
      </div>
    </WidgetKabuk>
  );
}
