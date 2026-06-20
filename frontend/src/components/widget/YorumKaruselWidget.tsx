import { useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetYorum } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="mb-8 text-center">
      {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
    </div>
  );
}

function YazarBilgi({ y, koyu }: { y: WidgetYorum; koyu?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {y.gorselUrl && (
        <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className="h-12 w-12 rounded-full object-cover" />
      )}
      <div className="text-left">
        <p className={`font-semibold ${koyu ? 'text-white' : 'text-slate-900'}`}>{y.ad}</p>
        <p className={`text-sm ${koyu ? 'text-slate-400' : 'text-slate-500'}`}>{y.firma}</p>
      </div>
    </div>
  );
}

function Yildizlar({ puan }: { puan: number }) {
  const p = Math.min(5, Math.max(0, Math.round(puan)));
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-sm" style={{ color: i < p ? '#facc15' : '#e2e8f0' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function KartKarusel({
  widget,
  cfg,
  yorumlar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  yorumlar: WidgetYorum[];
}) {
  const [aktif, setAktif] = useState(0);
  const y = yorumlar[aktif];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
        <p className="text-lg leading-relaxed text-slate-600">&ldquo;{y.metin}&rdquo;</p>
        <div className="mt-6">
          <YazarBilgi y={y} />
        </div>
      </div>
      {yorumlar.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {yorumlar.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAktif(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === aktif ? 'bg-primary' : 'bg-slate-300'}`}
              aria-label={`Yorum ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TekAlinti({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const y = yorumlar[aktif];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <blockquote className="mx-auto max-w-4xl text-center">
        <p className="text-2xl font-medium italic leading-relaxed text-violet-800 md:text-4xl">
          &ldquo;{y.metin}&rdquo;
        </p>
        <footer className="mt-8">
          <p className="text-lg font-bold text-slate-900">{y.ad}</p>
          {y.firma && <p className="text-sm text-violet-600">{y.firma}</p>}
        </footer>
      </blockquote>
      {yorumlar.length > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setAktif((a) => Math.max(0, a - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm"
            disabled={aktif === 0}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setAktif((a) => Math.min(yorumlar.length - 1, a + 1))}
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm"
            disabled={aktif === yorumlar.length - 1}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}

function KompaktYildiz({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
        {yorumlar.map((y) => (
          <article key={y.id} className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
            <Yildizlar puan={y.yildiz ?? 5} />
            <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">&ldquo;{y.metin}&rdquo;</p>
            <p className="mt-2 text-xs font-semibold text-violet-800">{y.ad}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function KoyuPanel({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const y = yorumlar[aktif];

  return (
    <div className="rounded-2xl bg-slate-900 px-6 py-12 md:px-12">
      <div className="mb-8 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>}
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg leading-relaxed text-slate-300">&ldquo;{y.metin}&rdquo;</p>
        <div className="mt-6">
          <YazarBilgi y={y} koyu />
        </div>
      </div>
      {yorumlar.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {yorumlar.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAktif(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === aktif ? 'bg-sky-400' : 'bg-slate-600'}`}
              aria-label={`Yorum ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OkyanusKart({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const y = yorumlar[aktif];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-3xl rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-100 p-8 text-center shadow-md">
        <p className="text-lg leading-relaxed text-blue-900">&ldquo;{y.metin}&rdquo;</p>
        <div className="mt-6">
          <YazarBilgi y={y} />
        </div>
      </div>
      {yorumlar.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {yorumlar.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAktif(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === aktif ? 'bg-sky-500' : 'bg-sky-200'}`}
              aria-label={`Yorum ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

function MintMinimal({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="mx-auto max-w-2xl space-y-6">
        {yorumlar.map((y) => (
          <div key={y.id} className="border-l-2 border-teal-400 pl-4">
            <p className="text-sm leading-relaxed text-slate-600">&ldquo;{y.metin}&rdquo;</p>
            <p className="mt-2 text-xs font-semibold text-teal-800">
              {y.ad}
              {y.firma ? ` · ${y.firma}` : ''}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function YorumKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const yorumlar = cfg.yorumlar ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (yorumlar.length === 0) return null;

  const ortak = { widget, cfg, yorumlar };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'tek-alinti' && <TekAlinti {...ortak} />}
      {gt === 'kompakt-yildiz' && <KompaktYildiz {...ortak} />}
      {gt === 'koyu-panel' && <KoyuPanel {...ortak} />}
      {gt === 'okyanus-kart' && <OkyanusKart {...ortak} />}
      {gt === 'mint-minimal' && <MintMinimal {...ortak} />}
      {gt === 'kart-karusel' && <KartKarusel {...ortak} />}
    </WidgetKabuk>
  );
}
