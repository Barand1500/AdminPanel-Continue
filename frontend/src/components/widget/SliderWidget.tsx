import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Widget } from '@/types/site';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

interface SliderWidgetProps {
  widget: Widget;
}

export function SliderWidget({ widget }: SliderWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const slides = (cfg.slides ?? []).filter((s) => s.aktif !== false);
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];

  if (slide?.gorselUrl) {
    return (
      <WidgetKabuk widget={widget}>
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl">
          <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative z-10 max-w-xl p-8 text-white">
            {slide.altBaslik && <p className="text-sm uppercase tracking-wide text-white/80">{slide.altBaslik}</p>}
            <h2 className="mt-2 text-3xl font-bold">{slide.baslik || widget.baslik}</h2>
            {slide.butonMetni && slide.butonLink && (
              <Link to={slide.butonLink} className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900">
                {slide.butonMetni}
              </Link>
            )}
          </div>
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((_, i) => (
                <button key={i} type="button" onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
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
