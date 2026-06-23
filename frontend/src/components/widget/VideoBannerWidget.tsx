import { useState } from 'react';
import type { Widget } from '@/types/site';
import { Link } from 'react-router-dom';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl, youtubeEmbedUrl } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function BaslikSonKelimeVurgulu({ baslik, sinif = '' }: { baslik: string; sinif?: string }) {
  const kelimeler = baslik.trim().split(/\s+/);
  if (kelimeler.length <= 1) {
    return <span className={sinif}>{baslik}</span>;
  }
  const son = kelimeler.pop()!;
  return (
    <span className={sinif}>
      {kelimeler.join(' ')}{' '}
      <strong className="font-extrabold text-slate-900">{son}</strong>
    </span>
  );
}

function VideoPlayTusu({
  onClick,
  sinif = 'vb-play-tusu',
}: {
  onClick: () => void;
  sinif?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={sinif} aria-label="Videoyu oynat">
      <span className="vb-play-ikon" aria-hidden>
        ▶
      </span>
    </button>
  );
}

function VideoOynatici({
  widget,
  embed,
  videoUrl,
  tip,
  poster,
  oynuyor,
  onOynat: _onOynat,
  sinif = 'absolute inset-0 z-0 h-full w-full',
  posterSinif = 'object-cover',
}: {
  widget: Widget;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
  oynuyor: boolean;
  onOynat: () => void;
  sinif?: string;
  posterSinif?: string;
}) {
  if (oynuyor && embed) {
    return (
      <iframe
        title={widget.baslik ?? 'Video'}
        src={`${embed}${embed.includes('?') ? '&' : '?'}autoplay=1`}
        className={`${sinif} border-0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  if (oynuyor && videoUrl && tip === 'dosya') {
    return (
      <video className={`${sinif} object-cover`} poster={poster} controls autoPlay playsInline>
        <source src={medyaUrl(videoUrl)} />
      </video>
    );
  }

  return (
    <div className={`${sinif} overflow-hidden`}>
      {poster ? (
        <img src={poster} alt="" className={`h-full w-full ${posterSinif}`} />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-slate-800 to-primary-dark" />
      )}
    </div>
  );
}

function VideoMetin({
  widget,
  cfg,
  sinifBaslik = 'font-bold text-white',
  sinifAciklama = 'text-white/90',
  butonSinif = 'rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900',
  hizalama = 'sol',
}: {
  widget: Widget;
  cfg: Cfg;
  sinifBaslik?: string;
  sinifAciklama?: string;
  butonSinif?: string;
  hizalama?: 'sol' | 'orta';
}) {
  const hiz = hizalama === 'orta' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col ${hiz}`}>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{widget.altBaslik}</p>
      )}
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 ${sinifBaslik}`}>{widget.baslik}</h2>}
      {widget.aciklama && <p className={`mt-3 max-w-xl ${sinifAciklama}`}>{widget.aciklama}</p>}
      {widget.butonMetni && widget.butonLink && (
        <Link to={widget.butonLink} className={`pointer-events-auto mt-6 inline-flex w-fit ${butonSinif}`}>
          {widget.butonMetni}
        </Link>
      )}
    </div>
  );
}

function SinematikHero({
  widget,
  cfg,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  cfg: Cfg;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  const [oynuyor, setOynuyor] = useState(false);
  const oynatilabilir = Boolean(embed || (videoUrl && tip === 'dosya'));

  return (
    <div className="vb-sinematik relative min-h-[480px] overflow-hidden rounded-none bg-black md:min-h-[520px] md:rounded-3xl">
      <div className="vb-sinematik-letterbox vb-sinematik-letterbox--ust" aria-hidden />
      <VideoOynatici
        widget={widget}
        embed={embed}
        videoUrl={videoUrl}
        tip={tip}
        poster={poster}
        oynuyor={oynuyor}
        onOynat={() => setOynuyor(true)}
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
      {!oynuyor && oynatilabilir && (
        <div className="absolute inset-0 z-[3] flex items-center justify-center">
          <VideoPlayTusu onClick={() => setOynuyor(true)} sinif="vb-play-tusu vb-play-tusu--buyuk" />
        </div>
      )}
      <div className="relative z-[2] flex min-h-[480px] flex-col justify-end p-8 md:min-h-[520px] md:p-12">
        <VideoMetin widget={widget} cfg={cfg} sinifBaslik="text-3xl font-bold text-white md:text-4xl" />
      </div>
      <div className="vb-sinematik-letterbox vb-sinematik-letterbox--alt" aria-hidden />
    </div>
  );
}

function EditoryalSplit({
  widget,
  cfg,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  cfg: Cfg;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  const [oynuyor, setOynuyor] = useState(false);
  const oynatilabilir = Boolean(embed || (videoUrl && tip === 'dosya'));

  return (
    <div className="vb-editoryal container-site">
      <div className="vb-editoryal-grid">
        <div className="vb-editoryal-metin">
          <div className="vb-editoryal-cizgi" aria-hidden />
          {widget.altBaslik && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{widget.altBaslik}</p>
          )}
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} vb-editoryal-baslik`}>{widget.baslik}</h2>
          )}
          {widget.aciklama && <p className="mt-4 text-lg text-slate-600">{widget.aciklama}</p>}
          {widget.butonMetni && widget.butonLink && (
            <Link
              to={widget.butonLink}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              {widget.butonMetni} →
            </Link>
          )}
        </div>
        <div className="vb-editoryal-video">
          <div className="vb-editoryal-video-kart">
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <VideoOynatici
                widget={widget}
                embed={embed}
                videoUrl={videoUrl}
                tip={tip}
                poster={poster}
                oynuyor={oynuyor}
                onOynat={() => setOynuyor(true)}
              />
              {!oynuyor && oynatilabilir && (
                <VideoPlayTusu onClick={() => setOynuyor(true)} sinif="vb-play-tusu vb-play-tusu--kucuk" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TarayiciCerceve({
  widget,
  cfg,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  cfg: Cfg;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  const [oynuyor, setOynuyor] = useState(false);
  const oynatilabilir = Boolean(embed || (videoUrl && tip === 'dosya'));

  return (
    <div className="vb-tarayici mx-auto max-w-4xl">
      <div className="vb-tarayici-pencere">
        <div className="vb-tarayici-ust">
          <div className="vb-tarayici-noktalar" aria-hidden>
            <span className="vb-tarayici-nokta vb-tarayici-nokta--kirmizi" />
            <span className="vb-tarayici-nokta vb-tarayici-nokta--sari" />
            <span className="vb-tarayici-nokta vb-tarayici-nokta--yesil" />
          </div>
          <div className="vb-tarayici-adres">
            <span>▶</span> {widget.baslik ?? 'video'} — tanıtım
          </div>
        </div>
        <div className="relative aspect-video bg-slate-900">
          <VideoOynatici
            widget={widget}
            embed={embed}
            videoUrl={videoUrl}
            tip={tip}
            poster={poster}
            oynuyor={oynuyor}
            onOynat={() => setOynuyor(true)}
          />
          {!oynuyor && oynatilabilir && (
            <VideoPlayTusu onClick={() => setOynuyor(true)} sinif="vb-play-tusu vb-play-tusu--orta" />
          )}
        </div>
      </div>
      {(widget.baslik || widget.aciklama) && (
        <div className="mt-6 text-center">
          {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold text-slate-900`}>{widget.baslik}</h2>}
          {widget.aciklama && <p className="mt-2 text-slate-500">{widget.aciklama}</p>}
        </div>
      )}
    </div>
  );
}

function DiyagonalMor({
  widget,
  cfg,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  cfg: Cfg;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  const [oynuyor, setOynuyor] = useState(false);
  const oynatilabilir = Boolean(embed || (videoUrl && tip === 'dosya'));

  return (
    <div className="vb-diyagonal overflow-hidden rounded-3xl md:flex md:min-h-[400px]">
      <div className="vb-diyagonal-metin flex flex-col justify-center p-8 md:w-[42%] md:p-12">
        {widget.altBaslik && (
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">{widget.altBaslik}</p>
        )}
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} mt-3 text-3xl font-bold text-white md:text-4xl`}>{widget.baslik}</h2>
        )}
        {widget.aciklama && <p className="mt-4 text-violet-100/90">{widget.aciklama}</p>}
        {widget.butonMetni && widget.butonLink && (
          <Link
            to={widget.butonLink}
            className="mt-8 inline-flex w-fit rounded-full border-2 border-white/40 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            {widget.butonMetni}
          </Link>
        )}
      </div>
      <div className="vb-diyagonal-video relative min-h-[260px] flex-1 md:min-h-0">
        <VideoOynatici
          widget={widget}
          embed={embed}
          videoUrl={videoUrl}
          tip={tip}
          poster={poster}
          oynuyor={oynuyor}
          onOynat={() => setOynuyor(true)}
        />
        {!oynuyor && oynatilabilir && (
          <VideoPlayTusu onClick={() => setOynuyor(true)} sinif="vb-play-tusu vb-play-tusu--mor" />
        )}
      </div>
    </div>
  );
}

function KurucuMerkez({
  widget,
  cfg,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  cfg: Cfg;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  const [oynuyor, setOynuyor] = useState(false);
  const oynatilabilir = Boolean(embed || (videoUrl && tip === 'dosya'));

  return (
    <div className="vb-kurucu relative overflow-hidden bg-white py-14 md:py-20">
      <div className="vb-kurucu-blob vb-kurucu-blob--sol" aria-hidden />
      <div className="vb-kurucu-blob vb-kurucu-blob--sag" aria-hidden />
      <div className="container-site relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} vb-kurucu-baslik text-3xl text-slate-700 md:text-4xl lg:text-[2.75rem]`}>
              <BaslikSonKelimeVurgulu baslik={widget.baslik} />
            </h2>
          )}
          {widget.aciklama && (
            <p className="vb-kurucu-alt mx-auto mt-4 max-w-2xl text-base text-slate-500 md:text-lg">
              {widget.aciklama}
            </p>
          )}
        </div>
        <div className="vb-kurucu-video-wrap mx-auto mt-10 max-w-4xl md:mt-12">
          <div className="vb-kurucu-rozet" aria-hidden>
            <span className="text-lg">🎬</span>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-200 shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
            <VideoOynatici
              widget={widget}
              embed={embed}
              videoUrl={videoUrl}
              tip={tip}
              poster={poster}
              oynuyor={oynuyor}
              onOynat={() => setOynuyor(true)}
            />
            {!oynuyor && oynatilabilir && (
              <VideoPlayTusu onClick={() => setOynuyor(true)} sinif="vb-play-tusu vb-play-tusu--kurucu" />
            )}
          </div>
        </div>
        {widget.butonMetni && widget.butonLink && (
          <div className="mt-8 text-center">
            <Link
              to={widget.butonLink}
              className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-dark"
            >
              {widget.butonMetni}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function YanPlaylist({
  widget,
  cfg,
  embed,
  videoUrl,
  tip,
  poster,
}: {
  widget: Widget;
  cfg: Cfg;
  embed: string | null;
  videoUrl: string;
  tip: string;
  poster?: string;
}) {
  const [oynuyor, setOynuyor] = useState(false);
  const [aktif, setAktif] = useState(0);
  const oynatilabilir = Boolean(embed || (videoUrl && tip === 'dosya'));
  const liste = [
    { baslik: widget.baslik ?? 'Ana video', sure: '12:34' },
    { baslik: widget.altBaslik ?? 'Bölüm 2', sure: '8:21' },
    { baslik: 'Ek içerik', sure: '5:07' },
  ];

  return (
    <div className="vb-playlist overflow-hidden rounded-3xl bg-slate-900 text-white">
      <div className="vb-playlist-grid">
        <div className="vb-playlist-liste">
          <p className="vb-playlist-etiket">Oynatma listesi</p>
          {liste.map((oge, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setAktif(i);
                setOynuyor(false);
              }}
              className={`vb-playlist-oge ${aktif === i ? 'vb-playlist-oge--aktif' : ''}`}
            >
              <span className="vb-playlist-thumb">
                {poster ? <img src={poster} alt="" /> : <span className="vb-playlist-thumb-bos" />}
                <span className="vb-playlist-thumb-play" aria-hidden>▶</span>
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-semibold">{oge.baslik}</span>
                <span className="text-xs text-slate-400">{oge.sure}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="vb-playlist-oynatici">
          <div className="relative aspect-video bg-black">
            <VideoOynatici
              widget={widget}
              embed={embed}
              videoUrl={videoUrl}
              tip={tip}
              poster={poster}
              oynuyor={oynuyor}
              onOynat={() => setOynuyor(true)}
            />
            {!oynuyor && oynatilabilir && (
              <VideoPlayTusu onClick={() => setOynuyor(true)} sinif="vb-play-tusu vb-play-tusu--playlist" />
            )}
          </div>
          <div className="p-5 md:p-6">
            {widget.baslik && (
              <h2 className={`${baslikSinifi(cfg)} text-xl font-bold text-white md:text-2xl`}>{widget.baslik}</h2>
            )}
            {widget.aciklama && <p className="mt-2 text-sm text-slate-400">{widget.aciklama}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoBannerWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const videoUrl = cfg.videoUrl ?? '';
  const tip = cfg.videoTip ?? 'youtube';
  const poster = widget.gorselUrl ? medyaUrl(widget.gorselUrl) : undefined;
  const embed = tip === 'youtube' ? youtubeEmbedUrl(videoUrl) : null;
  let gt = widgetGorunumTipiAl(widget);
  if (gt === 'turuncu-cta') gt = 'kurucu-merkez';
  if (gt === 'mint-minimal') gt = 'yan-playlist';

  const ortak = { widget, cfg, embed, videoUrl, tip, poster };

  let icerik;
  switch (gt) {
    case 'bolunmus-metin':
      icerik = <EditoryalSplit {...ortak} />;
      break;
    case 'cerceveli-kart':
      icerik = <TarayiciCerceve {...ortak} />;
      break;
    case 'mor-overlay':
      icerik = <DiyagonalMor {...ortak} />;
      break;
    case 'kurucu-merkez':
      icerik = <KurucuMerkez {...ortak} />;
      break;
    case 'yan-playlist':
      icerik = <YanPlaylist {...ortak} />;
      break;
    case 'tam-video':
    default:
      icerik = <SinematikHero {...ortak} />;
      break;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
