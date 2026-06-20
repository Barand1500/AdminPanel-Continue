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

export function VideoBannerWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const videoUrl = cfg.videoUrl ?? '';
  const tip = cfg.videoTip ?? 'youtube';
  const poster = widget.gorselUrl ? medyaUrl(widget.gorselUrl) : undefined;
  const embed = tip === 'youtube' ? youtubeEmbedUrl(videoUrl) : null;
  const gt = widgetGorunumTipiAl(widget);

  if (gt === 'bol-split') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="grid min-h-[320px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
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

  const minH = gt === 'kart' ? 'min-h-[280px]' : 'min-h-[420px]';
  const rounded = gt === 'kart' ? 'rounded-2xl border border-slate-200' : 'rounded-3xl shadow-xl';

  return (
    <WidgetKabuk widget={widget}>
      <div className={`relative overflow-hidden ${rounded} ${minH}`}>
        <VideoIcerik widget={widget} embed={embed} videoUrl={videoUrl} tip={tip} poster={poster} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className={`relative z-[2] flex flex-col justify-end p-8 sm:p-12 ${minH}`}>
          {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{widget.altBaslik}</p>}
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>}
          {widget.aciklama && <p className="mt-3 max-w-xl text-white/90">{widget.aciklama}</p>}
          {widget.butonMetni && widget.butonLink && (
            <Link
              to={widget.butonLink}
              className="pointer-events-auto mt-6 inline-flex w-fit rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50"
            >
              {widget.butonMetni}
            </Link>
          )}
        </div>
      </div>
    </WidgetKabuk>
  );
}
