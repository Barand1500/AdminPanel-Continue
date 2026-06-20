import { Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetSlide } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import { WidgetSayfalama, haberVurguRengi } from './haber/haberWidgetOrtak';

interface SliderWidgetProps {
  widget: Widget;
}

function useSliderState(slides: WidgetSlide[]) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const onceki = () => setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  const sonraki = () => setIndex((i) => (i >= slides.length - 1 ? 0 : i + 1));
  return { index, setIndex, slide, onceki, sonraki };
}

function SliderOklar({
  cok,
  onceki,
  sonraki,
  sinif = 'absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded bg-black/40 px-3 py-2 text-xl text-white hover:bg-black/60',
}: {
  cok: boolean;
  onceki: () => void;
  sonraki: () => void;
  sinif?: string;
}) {
  if (!cok) return null;
  return (
    <>
      <button type="button" onClick={onceki} className={sinif} aria-label="Önceki">
        ‹
      </button>
      <button type="button" onClick={sonraki} className={sinif.replace('left-2', 'right-2 left-auto')} aria-label="Sonraki">
        ›
      </button>
    </>
  );
}

function SlideMetin({
  slide,
  widget,
  sinifBaslik = 'text-2xl font-bold leading-tight md:text-3xl',
  sinifAlt = '',
  butonSinif = 'mt-4 inline-block rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-900',
}: {
  slide: WidgetSlide;
  widget: Widget;
  sinifBaslik?: string;
  sinifAlt?: string;
  butonSinif?: string;
}) {
  return (
    <>
      {slide.altBaslik && (
        <p className={`text-xs font-bold uppercase tracking-wider opacity-80 ${sinifAlt}`}>{slide.altBaslik}</p>
      )}
      <h2 className={`max-w-2xl ${sinifBaslik}`}>{slide.baslik || widget.baslik}</h2>
      {slide.butonMetni && slide.butonLink && (
        <Link to={slide.butonLink} className={butonSinif}>
          {slide.butonMetni}
        </Link>
      )}
    </>
  );
}

function SinematikSlider({
  widget,
  slides,
  index,
  setIndex,
  slide,
  onceki,
  sonraki,
  sayfalamaStili,
  vurguRenk,
}: ReturnType<typeof useSliderState> & {
  widget: Widget;
  slides: WidgetSlide[];
  sayfalamaStili: string;
  vurguRenk: string;
}) {
  if (!slide?.gorselUrl) return null;
  return (
    <div className="slider-sinematik relative min-h-[420px] overflow-hidden rounded-none md:min-h-[480px]">
      <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
      <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} />
      {slide.altBaslik && (
        <span className="absolute right-4 top-4 z-10 rounded bg-blue-600 px-2 py-1 text-xs font-bold uppercase text-white">
          {slide.altBaslik}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 pb-20 text-white">
        <SlideMetin slide={slide} widget={widget} sinifBaslik="text-3xl font-bold leading-tight md:text-4xl" />
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10">
          <WidgetSayfalama
            toplam={slides.length}
            aktif={index}
            stil={sayfalamaStili as 'numara'}
            vurguRenk={vurguRenk}
            onSec={setIndex}
            onOnceki={onceki}
            onSonraki={sonraki}
          />
        </div>
      )}
    </div>
  );
}

function KartGolgeSlider({
  widget,
  slides,
  index,
  setIndex,
  slide,
  onceki,
  sonraki,
  sayfalamaStili,
  vurguRenk,
}: ReturnType<typeof useSliderState> & {
  widget: Widget;
  slides: WidgetSlide[];
  sayfalamaStili: string;
  vurguRenk: string;
}) {
  if (!slide?.gorselUrl) return null;
  return (
    <div className="slider-kart-golge py-6">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200">
        <div className="relative min-h-[320px] md:min-h-[380px]">
          <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} />
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
            <SlideMetin slide={slide} widget={widget} />
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <WidgetSayfalama
          toplam={slides.length}
          aktif={index}
          stil={sayfalamaStili as 'numara'}
          vurguRenk={vurguRenk}
          onSec={setIndex}
          onOnceki={onceki}
          onSonraki={sonraki}
        />
      )}
    </div>
  );
}

function BolunmusMetinSlider({
  widget,
  slides,
  index,
  setIndex,
  slide,
  onceki,
  sonraki,
}: ReturnType<typeof useSliderState> & { widget: Widget; slides: WidgetSlide[] }) {
  if (!slide?.gorselUrl) return null;
  return (
    <div className="slider-bolunmus-metin overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center bg-gradient-to-br from-sky-50 to-blue-100 p-8 md:p-10">
          <SlideMetin
            slide={slide}
            widget={widget}
            sinifBaslik="text-2xl font-bold text-slate-900 md:text-3xl"
            sinifAlt="text-blue-600"
            butonSinif="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          />
          {slides.length > 1 && (
            <div className="mt-8 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 flex-1 rounded-full transition ${i === index ? 'bg-blue-600' : 'bg-blue-200'}`}
                  aria-label={`Slayt ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="relative min-h-[280px] md:min-h-[360px]">
          <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} />
        </div>
      </div>
    </div>
  );
}

function MinimalCizgiSlider({
  widget,
  slides,
  index,
  setIndex,
  slide,
  onceki,
  sonraki,
}: ReturnType<typeof useSliderState> & { widget: Widget; slides: WidgetSlide[] }) {
  if (!slide?.gorselUrl) return null;
  return (
    <div className="slider-minimal-cizgi">
      <div className="relative min-h-[300px] overflow-hidden rounded-t-xl bg-slate-100 md:min-h-[360px]">
        <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <SliderOklar
          cok={slides.length > 1}
          onceki={onceki}
          sonraki={sonraki}
          sinif="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-300 bg-white/90 px-2.5 py-1.5 text-lg text-slate-700 shadow-sm hover:bg-white"
        />
      </div>
      <div className="border-x border-b border-slate-200 bg-white px-6 py-5">
        <SlideMetin
          slide={slide}
          widget={widget}
          sinifBaslik="text-xl font-semibold text-slate-900"
          sinifAlt="text-violet-600"
          butonSinif="mt-3 inline-block text-sm font-semibold text-violet-700 underline-offset-2 hover:underline"
        />
        {slides.length > 1 && (
          <div className="slider-minimal-nav mt-4 flex items-center gap-4 border-t border-slate-100 pt-4">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`text-sm font-medium transition ${i === index ? 'text-violet-700 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GradientHeroSlider({ widget, slide }: { widget: Widget; slide: WidgetSlide | undefined }) {
  return (
    <div className="slider-gradient-hero relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 px-8 py-16 text-center text-white md:px-16 md:py-20">
      <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        {(slide?.altBaslik || widget.altBaslik) && (
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-widest">
            {slide?.altBaslik || widget.altBaslik}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {slide?.baslik || widget.baslik}
        </h1>
        {widget.aciklama && <p className="mx-auto mt-4 max-w-xl text-purple-100">{widget.aciklama}</p>}
        {(slide?.butonMetni || widget.butonMetni) && (slide?.butonLink || widget.butonLink) && (
          <Link
            to={slide?.butonLink || widget.butonLink!}
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-purple-700 shadow-lg hover:bg-purple-50"
          >
            {slide?.butonMetni || widget.butonMetni}
          </Link>
        )}
      </div>
    </div>
  );
}

function KenarCerceveSlider({
  widget,
  slides,
  index,
  setIndex,
  slide,
  onceki,
  sonraki,
  sayfalamaStili,
  vurguRenk,
}: ReturnType<typeof useSliderState> & {
  widget: Widget;
  slides: WidgetSlide[];
  sayfalamaStili: string;
  vurguRenk: string;
}) {
  if (!slide?.gorselUrl) return null;
  return (
    <div className="slider-kenar-cerceve rounded-2xl border-4 border-amber-500 bg-amber-50 p-4 md:p-6">
      <div className="relative min-h-[300px] overflow-hidden rounded-xl border-2 border-amber-200 md:min-h-[360px]">
        <img src={medyaUrl(slide.gorselUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 to-transparent" />
        <SliderOklar cok={slides.length > 1} onceki={onceki} sonraki={sonraki} />
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-amber-50">
          <SlideMetin
            slide={slide}
            widget={widget}
            sinifBaslik="text-2xl font-bold text-amber-50"
            butonSinif="mt-4 inline-block rounded-lg border-2 border-amber-300 bg-amber-400 px-5 py-2 text-sm font-bold text-amber-950"
          />
        </div>
      </div>
      {slides.length > 1 && (
        <WidgetSayfalama
          toplam={slides.length}
          aktif={index}
          stil={sayfalamaStili as 'numara'}
          vurguRenk={vurguRenk || '#d97706'}
          onSec={setIndex}
          onOnceki={onceki}
          onSonraki={sonraki}
        />
      )}
    </div>
  );
}

function GorselSlider({
  gt,
  widget,
  slides,
  state,
  sayfalamaStili,
  vurguRenk,
}: {
  gt: string;
  widget: Widget;
  slides: WidgetSlide[];
  state: ReturnType<typeof useSliderState>;
  sayfalamaStili: string;
  vurguRenk: string;
}) {
  const props = { widget, slides, ...state, sayfalamaStili, vurguRenk };
  switch (gt) {
    case 'kart-golge':
      return <KartGolgeSlider {...props} />;
    case 'bolunmus-metin':
      return <BolunmusMetinSlider {...props} />;
    case 'minimal-cizgi':
      return <MinimalCizgiSlider {...props} />;
    case 'kenar-cerceve':
      return <KenarCerceveSlider {...props} />;
    case 'gradient-hero':
      return <GradientHeroSlider widget={widget} slide={state.slide} />;
    default:
      return <SinematikSlider {...props} />;
  }
}

export function SliderWidget({ widget }: SliderWidgetProps) {
  const cfg = configOkuFromWidget(widget);
  const g = cfg.gorunum ?? {};
  const slides = (cfg.slides ?? []).filter((s) => s.aktif !== false);
  const state = useSliderState(slides);
  const gt = widgetGorunumTipiAl(widget);
  const vurguRenk = haberVurguRengi(g, '#dc2626');
  const sayfalamaStili = g.sayfalamaStili ?? 'numara';

  if (slides.length === 0 && gt !== 'gradient-hero') return null;

  let icerik: ReactNode;

  if (gt === 'gradient-hero' || !state.slide?.gorselUrl) {
    icerik = <GradientHeroSlider widget={widget} slide={state.slide} />;
  } else {
    icerik = (
      <GorselSlider
        gt={gt}
        widget={widget}
        slides={slides}
        state={state}
        sayfalamaStili={sayfalamaStili}
        vurguRenk={vurguRenk}
      />
    );
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
