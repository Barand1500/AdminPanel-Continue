import { useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetGaleriOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, gridStyle, medyaUrl } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function GaleriBaslik({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  if (!widget.baslik) return null;
  return <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold`}>{widget.baslik}</h2>;
}

function GaleriOge({
  g,
  cfg,
  sinif,
  kap,
}: {
  g: WidgetGaleriOgesi;
  cfg: Cfg;
  sinif: string;
  kap?: (node: React.ReactNode) => React.ReactNode;
}) {
  const icerik = (
    <>
      {g.gorselUrl && <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className={gorselSinifi(cfg)} />}
      {g.baslik && <figcaption className="p-3 text-sm font-medium">{g.baslik}</figcaption>}
    </>
  );
  const link = g.link?.trim();
  const wrapped = kap ? kap(icerik) : icerik;
  if (link) {
    const href = link.startsWith('http') || link.startsWith('/') ? link : `https://${link}`;
    const dis = href.startsWith('http');
    return (
      <a
        key={g.id}
        href={href}
        className={sinif}
        {...(dis ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {wrapped}
      </a>
    );
  }
  return (
    <figure key={g.id} className={sinif}>
      {wrapped}
    </figure>
  );
}

function EsitGrid({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  return (
    <>
      <GaleriBaslik widget={widget} cfg={cfg} />
      <div className="galeri-esit-grid grid gap-4" style={gridStyle(cfg)}>
        {galeri.map((g) => (
          <GaleriOge key={g.id} g={g} cfg={cfg} sinif="overflow-hidden rounded-xl bg-white text-slate-700 shadow-sm transition hover:shadow-md" />
        ))}
      </div>
    </>
  );
}

function MasonryMor({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  return (
    <>
      <GaleriBaslik widget={widget} cfg={cfg} />
      <div className="galeri-masonry-mor columns-2 gap-4 md:columns-3">
        {galeri.map((g, i) => (
          <GaleriOge
            key={g.id}
            g={g}
            cfg={cfg}
            sinif={`galeri-masonry-oge mb-4 break-inside-avoid overflow-hidden rounded-2xl border-2 border-violet-200 bg-violet-50 text-violet-950 shadow-sm ${i % 2 ? 'mt-6' : ''}`}
          />
        ))}
      </div>
    </>
  );
}

function LightboxKoyu({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  const [acik, setAcik] = useState<WidgetGaleriOgesi | null>(null);
  return (
    <>
      <GaleriBaslik widget={widget} cfg={cfg} />
      <div className="galeri-lightbox-koyu rounded-2xl bg-slate-900 p-6 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" style={gridStyle(cfg)}>
          {galeri.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setAcik(g)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10"
            >
              {g.gorselUrl && (
                <img src={medyaUrl(g.gorselUrl)} alt={g.baslik} className="h-full w-full object-cover transition group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100" />
              {g.baslik && (
                <span className="absolute bottom-2 left-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  {g.baslik}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {acik && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4" onClick={() => setAcik(null)}>
          <figure className="max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {acik.gorselUrl && <img src={medyaUrl(acik.gorselUrl)} alt={acik.baslik} className="max-h-[80vh] rounded-lg object-contain" />}
            {acik.baslik && <figcaption className="mt-3 text-center text-white">{acik.baslik}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}

function CerceveliAltin({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  return (
    <>
      <GaleriBaslik widget={widget} cfg={cfg} />
      <div className="galeri-cerceveli-altin rounded-2xl border-4 border-amber-500 bg-amber-50 p-4 md:p-6">
        <div className="grid gap-4" style={gridStyle(cfg)}>
          {galeri.map((g) => (
            <GaleriOge
              key={g.id}
              g={g}
              cfg={cfg}
              sinif="overflow-hidden rounded-lg border-2 border-amber-400 bg-white text-amber-950 shadow-md"
            />
          ))}
        </div>
      </div>
    </>
  );
}

function YesilHover({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  return (
    <>
      <GaleriBaslik widget={widget} cfg={cfg} />
      <div className="galeri-yesil-hover grid gap-4" style={gridStyle(cfg)}>
        {galeri.map((g) => (
          <GaleriOge
            key={g.id}
            g={g}
            cfg={cfg}
            sinif="galeri-yesil-kart overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 transition hover:scale-[1.02] hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200"
          />
        ))}
      </div>
    </>
  );
}

function GenisSerit({ widget, cfg, galeri }: { widget: Widget; cfg: Cfg; galeri: WidgetGaleriOgesi[] }) {
  return (
    <>
      <GaleriBaslik widget={widget} cfg={cfg} />
      <div className="galeri-genis-serit flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {galeri.map((g) => (
          <GaleriOge
            key={g.id}
            g={g}
            cfg={cfg}
            sinif="galeri-serit-oge min-w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl border border-sky-200 bg-sky-50 text-sky-950 shadow-sm md:min-w-[360px]"
          />
        ))}
      </div>
    </>
  );
}

export function GaleriWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const galeri = cfg.galeri ?? [];
  const gt = widgetGorunumTipiAl(widget);
  if (galeri.length === 0) return null;

  const props = { widget, cfg, galeri };

  let icerik;
  switch (gt) {
    case 'masonry-mor':
      icerik = <MasonryMor {...props} />;
      break;
    case 'lightbox-koyu':
      icerik = <LightboxKoyu {...props} />;
      break;
    case 'cerceveli-altin':
      icerik = <CerceveliAltin {...props} />;
      break;
    case 'yesil-hover':
      icerik = <YesilHover {...props} />;
      break;
    case 'genis-serit':
      icerik = <GenisSerit {...props} />;
      break;
    default:
      icerik = <EsitGrid {...props} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
