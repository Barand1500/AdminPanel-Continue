import type { Widget } from '@/types/site';
import { Link } from 'react-router-dom';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl, youtubeEmbedUrl } from './widgetHelpers';

export function VideoBannerWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const videoUrl = cfg.videoUrl ?? '';
  const tip = cfg.videoTip ?? 'youtube';
  const poster = widget.gorselUrl ? medyaUrl(widget.gorselUrl) : undefined;
  const embed = tip === 'youtube' ? youtubeEmbedUrl(videoUrl) : null;

  return (
    <WidgetKabuk widget={widget}>
      <div className="relative min-h-[420px] overflow-hidden rounded-3xl shadow-xl">
        {embed ? (
          <iframe
            title={widget.baslik ?? 'Video'}
            src={embed}
            className="absolute inset-0 z-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : videoUrl && tip === 'dosya' ? (
          <video className="absolute inset-0 z-0 h-full w-full object-cover" poster={poster} controls playsInline>
            <source src={medyaUrl(videoUrl)} />
          </video>
        ) : poster ? (
          <img src={poster} alt="" className="absolute inset-0 z-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 to-primary-dark" />
        )}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-[2] flex min-h-[420px] flex-col justify-end p-8 sm:p-12">
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
