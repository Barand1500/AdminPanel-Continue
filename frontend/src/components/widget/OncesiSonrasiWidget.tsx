import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function SurukleKarsilastir({
  widget,
  cfg,
  once,
  sonra,
  rounded,
  cizgiRenk = '#fff',
  tutamacSinif = '',
  etiketSinif = '',
}: {
  widget: Widget;
  cfg: ReturnType<typeof configOkuFromWidget>;
  once: string;
  sonra: string;
  rounded: string;
  cizgiRenk?: string;
  tutamacSinif?: string;
  etiketSinif?: string;
}) {
  const [oran, setOran] = useState(50);
  const [genislik, setGenislik] = useState(0);
  const kapsayiciRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = kapsayiciRef.current;
    if (!el) return;
    const guncelle = () => setGenislik(el.offsetWidth);
    guncelle();
    const ro = new ResizeObserver(guncelle);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const surukle = useCallback((clientX: number) => {
    const el = kapsayiciRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const yuzde = ((clientX - rect.left) / rect.width) * 100;
    setOran(Math.min(98, Math.max(2, yuzde)));
  }, []);

  return (
    <>
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
      <div
        ref={kapsayiciRef}
        className={`oncesi-sonrasi-kapsayici relative mx-auto max-w-4xl cursor-ew-resize select-none overflow-hidden ${rounded}`}
        onPointerDown={(e) => {
          surukle(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) surukle(e.clientX);
        }}
      >
        <img src={medyaUrl(sonra)} alt="Sonra" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${oran}%` }}>
          <img
            src={medyaUrl(once)}
            alt="Önce"
            className="absolute left-0 top-0 h-full max-w-none object-cover"
            style={{ width: genislik || '100%' }}
            draggable={false}
          />
        </div>
        <div className="oncesi-sonrasi-cizgi" style={{ left: `${oran}%`, background: cizgiRenk }}>
          <span className={`oncesi-sonrasi-tutamac ${tutamacSinif}`}>⟷</span>
        </div>
        <span className={`oncesi-sonrasi-etiket oncesi-sonrasi-etiket-sol ${etiketSinif}`}>Önce</span>
        <span className={`oncesi-sonrasi-etiket oncesi-sonrasi-etiket-sag ${etiketSinif}`}>Sonra</span>
      </div>
    </>
  );
}

export function OncesiSonrasiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const once = cfg.onceGorsel ?? widget.gorselUrl ?? '';
  const sonra = cfg.sonraGorsel ?? '';
  const gt = widgetGorunumTipiAl(widget);

  if (!once || !sonra) return null;

  if (gt === 'yan-yana-sabit') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} mb-8 text-center font-bold text-slate-900`}>{widget.baslik}</h2>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl shadow-md">
            <img src={medyaUrl(once)} alt="Önce" className="h-64 w-full object-cover" />
            <figcaption className="bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white">Önce</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl shadow-md">
            <img src={medyaUrl(sonra)} alt="Sonra" className="h-64 w-full object-cover" />
            <figcaption className="bg-primary px-4 py-2 text-center text-sm font-semibold text-white">Sonra</figcaption>
          </figure>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cerceveli-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="mx-auto max-w-4xl rounded-xl border-2 border-violet-200 bg-violet-50/50 p-4">
          <SurukleKarsilastir
            widget={widget}
            cfg={cfg}
            once={once}
            sonra={sonra}
            rounded="rounded-lg border border-violet-200"
          />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'koyu-etiket') {
    return (
      <WidgetKabuk widget={widget}>
        <SurukleKarsilastir
          widget={widget}
          cfg={cfg}
          once={once}
          sonra={sonra}
          rounded="rounded-2xl shadow-lg ring-1 ring-slate-800"
          etiketSinif="!bg-slate-900 !text-white !top-auto !bottom-4"
        />
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-cizgi') {
    return (
      <WidgetKabuk widget={widget}>
        <SurukleKarsilastir
          widget={widget}
          cfg={cfg}
          once={once}
          sonra={sonra}
          rounded="rounded-2xl shadow-lg"
          cizgiRenk="#ea580c"
          tutamacSinif="!bg-orange-500 !text-white !border-2 !border-white"
        />
      </WidgetKabuk>
    );
  }

  if (gt === 'yesil-etiket') {
    return (
      <WidgetKabuk widget={widget}>
        <SurukleKarsilastir
          widget={widget}
          cfg={cfg}
          once={once}
          sonra={sonra}
          rounded="rounded-2xl shadow-md"
          etiketSinif="!bg-emerald-600 !text-white"
        />
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <SurukleKarsilastir
        widget={widget}
        cfg={cfg}
        once={once}
        sonra={sonra}
        rounded="rounded-2xl shadow-lg"
      />
    </WidgetKabuk>
  );
}
