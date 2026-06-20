import type { Widget } from '@/types/site';
import { Link } from 'react-router-dom';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl, youtubeEmbedUrl } from './widgetHelpers';

function VideoIcerik({
  widget,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  if (embed) {
    return (
      <iframe
        title={widget.baslik ?? 'Video'}
        src={embed}
        className="absolute inset-0 z-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  if (videoUrl && tip === 'dosya') {
    return (
      <video className="absolute inset-0 z-0 h-full w-full object-cover" poster={poster} controls playsInline>
        <source src={medyaUrl(videoUrl)} />
      </video>
    );
  }
  if (poster) {
    return <img src={poster} alt="" className="absolute inset-0 z-0 h-full w-full object-cover" />;
  }
  return <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 to-primary-dark" />;
}

function VideoMetin({
  widget,
  cfg,
  sinifBaslik = 'font-bold text-white',
  sinifAciklama = 'text-white/90',
  butonSinif = 'rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900',
}: {
  widget: Widget;
  cfg: ReturnType<typeof configOkuFromWidget>;
  sinifBaslik?: string;
  sinifAciklama?: string;
  butonSinif?: string;
}) {
  return (
    <>
      {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{widget.altBaslik}</p>}
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 ${sinifBaslik}`}>{widget.baslik}</h2>}
      {widget.aciklama && <p className={`mt-3 max-w-xl ${sinifAciklama}`}>{widget.aciklama}</p>}
      {widget.butonMetni && widget.butonLink && (
        <Link to={widget.butonLink} className={`pointer-events-auto mt-6 inline-flex w-fit ${butonSinif}`}>
          {widget.butonMetni}
        </Link>
      )}
    </>
  );
}

export function VideoBannerWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const videoUrl = cfg.videoUrl ?? '';
  const tip = cfg.videoTip ?? 'youtube';
  const poster = widget.gorselUrl ? medyaUrl(widget.gorselUrl) : undefined;
  const embed = tip === 'youtube' ? youtubeEmbedUrl(videoUrl) : null;
  const gt = widgetGorunumTipiAl(widget);

  if (gt === 'bolunmus-metin') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="vb-bolunmus grid min-h-[320px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          <div className="flex flex-col justify-center p-8">
            {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
            {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
            {widget.aciklama && <p className="mt-3 text-slate-600">{widget.aciklama}</p>}
            {widget.butonMetni && widget.butonLink && (
              <Link to={widget.butonLink} className="mt-6 inline-flex w-fit rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">
                {widget.butonMetni}
              </Link>
            )}
          </div>
          <div className="relative min-h-[240px]">
            <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cerceveli-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="vb-cerceveli relative min-h-[300px] overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-2 shadow-lg">
          <div className="relative min-h-[280px] overflow-hidden rounded-xl">
            <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative z-[2] flex min-h-[280px] flex-col justify-end p-6">
              <VideoMetin widget={widget} cfg={cfg} />
            </div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'mor-overlay') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="vb-mor-overlay relative min-h-[420px] overflow-hidden rounded-3xl">
          <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-violet-900/80 via-purple-800/60 to-fuchsia-900/70" />
          <div className="relative z-[2] flex min-h-[420px] flex-col items-center justify-center p-8 text-center sm:p-12">
            <VideoMetin widget={widget} cfg={cfg} sinifBaslik="text-3xl font-bold text-white" />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-cta') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="vb-turuncu-cta relative min-h-[380px] overflow-hidden rounded-2xl">
          <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/50" />
          <div className="relative z-[2] flex min-h-[380px] flex-col justify-end p-8 sm:p-10">
            <VideoMetin
              widget={widget}
              cfg={cfg}
              butonSinif="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:from-orange-600"
            />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'mint-minimal') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="vb-mint-minimal mx-auto max-w-2xl overflow-hidden rounded-xl border-2 border-teal-300 bg-teal-50">
          <div className="relative aspect-video">
            <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
          </div>
          <div className="p-4 text-center">
            {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-teal-900`}>{widget.baslik}</h2>}
            {widget.aciklama && <p className="mt-1 text-sm text-teal-700">{widget.aciklama}</p>}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="vb-tam-video relative min-h-[420px] overflow-hidden rounded-3xl shadow-xl">
        <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-[2] flex min-h-[420px] flex-col justify-end p-8 sm:p-12">
          <VideoMetin widget={widget} cfg={cfg} />
        </div>
      </div>
    </WidgetKabuk>
  );
}
