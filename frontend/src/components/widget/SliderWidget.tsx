import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import { WidgetSayfalama, haberVurguRengi } from './haber/haberWidgetOrtak';

interface SliderWidgetProps {
  widget: Widget;
}

export function SliderWidget({ widget }: SliderWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const g = cfg.gorunum ?? {};
  const slides = (cfg.slides ?? []).filter((s) => s.aktif !== false);
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const vurguRenk = haberVurguRengi(g, '#dc2626');
  const sayfalamaStili = g.sayfalamaStili ?? 'numara';

  const onceki = () => setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  const sonraki = () => setIndex((i) => (i >= slides.length - 1 ? 0 : i + 1));

  if (slide?.gorselUrl) {
    return (
      <WidgetKabuk widget={widget}>
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl">
          <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={onceki}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded bg-black/40 px-3 py-2 text-xl text-white hover:bg-black/60"
                aria-label="Önceki"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={sonraki}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded bg-black/40 px-3 py-2 text-xl text-white hover:bg-black/60"
                aria-label="Sonraki"
              >
                ›
              </button>
            </>
          )}

          {slide.altBaslik && (
            <span className="absolute right-4 top-4 z-10 rounded bg-blue-600 px-2 py-1 text-xs font-bold uppercase text-white">
              {slide.altBaslik}
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-16 text-white">
            <h2 className="max-w-2xl text-2xl font-bold leading-tight md:text-3xl">{slide.baslik || widget.baslik}</h2>
            {slide.butonMetni && slide.butonLink && (
              <Link to={slide.butonLink} className="mt-4 inline-block rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-900">
                {slide.butonMetni}
              </Link>
            )}
          </div>
        </div>
        {slides.length > 1 && (
          <WidgetSayfalama
            toplam={slides.length}
            aktif={index}
            stil={sayfalamaStili}
            vurguRenk={vurguRenk}
            onSec={setIndex}
            onOnceki={onceki}
            onSonraki={sonraki}
          />
        )}
      </WidgetKabuk>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="container-site grid min-h-[420px] items-center gap-8 py-16 md:grid-cols-2">
        <div>
          {(slide?.altBaslik || widget.altBaslik) && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-200">
              {slide?.altBaslik || widget.altBaslik}
            </p>
          )}
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {slide?.baslik || widget.baslik}
          </h1>
          {widget.aciklama && (
            <p className="mt-4 max-w-xl text-base text-blue-100 sm:text-lg">{widget.aciklama}</p>
          )}
          {(slide?.butonMetni || widget.butonMetni) && (slide?.butonLink || widget.butonLink) && (
            <div className="mt-8">
              <Link to={slide?.butonLink || widget.butonLink!} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50">
                {slide?.butonMetni || widget.butonMetni}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
