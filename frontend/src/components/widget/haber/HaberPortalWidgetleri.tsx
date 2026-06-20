import { useEffect, useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import type { WidgetVideoKarti } from '@/types/haberWidget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk } from '../widgetKabuk';
import { configOkuFromWidget, gridStyle, haritaEmbedUrl, medyaUrl } from '../widgetHelpers';
import { havaDurumuGetir, type HavaDurumuYanit } from '@/features/site/havaApi';
import { kriptoListesiGetir, type KriptoPiyasaVeri } from '@/features/site/kriptoApi';
import {
  HaberBolumBaslik,
  HaberKartGovde,
  WidgetSayfalama,
  haberVurguRengi,
} from './haberWidgetOrtak';

function cfgOku(widget: Widget) {
  return configOkuFromWidget(widget);
}

function gOku(cfg: WidgetConfig) {
  return cfg.gorunum ?? {};
}

function VideoKapak({
  v,
  playSinif = 'flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-2xl text-white',
}: {
  v: WidgetVideoKarti;
  playSinif?: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
      {v.gorselUrl && <img src={medyaUrl(v.gorselUrl)} alt="" className="h-full w-full object-cover opacity-80" />}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className={playSinif}>▶</span>
      </span>
    </div>
  );
}

export function KoseYazarlariWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const yazarlar = cfg.koseYazarlari ?? [];
  const konum = g.gorselKonumu ?? 'sol';
  const gt = widgetGorunumTipiAl(widget);
  const [sayfa, setSayfa] = useState(0);
  const kolon = gt === 'buyuk-profil' ? Math.min(g.kolonSayisi ?? 2, 2) : g.kolonSayisi ?? 4;
  const listeMod = gt === 'dikey-liste' || gt === 'yesil-minimal';
  const sayfaAdet = listeMod ? 1 : Math.max(1, Math.ceil(yazarlar.length / kolon));
  const dilim = listeMod ? yazarlar : yazarlar.slice(sayfa * kolon, sayfa * kolon + kolon);

  const kartSinif =
    gt === 'koyu-yazar'
      ? 'rounded-xl bg-slate-800 p-4 text-white'
      : gt === 'turuncu-unvan'
        ? 'rounded-lg border border-orange-200 bg-orange-50 p-3'
        : gt === 'yesil-minimal'
          ? 'rounded-lg border-b border-emerald-100 bg-white py-3'
          : gt === 'buyuk-profil'
            ? 'rounded-2xl border border-slate-100 bg-white p-5 shadow-sm'
            : 'rounded-lg border border-slate-100 bg-white p-3';

  const govdeSinif =
    gt === 'dikey-liste'
      ? `flex gap-4 ${konum === 'sag' ? 'flex-row-reverse' : ''}`
      : `flex gap-3 ${konum === 'sag' ? 'flex-row-reverse' : ''} ${konum === 'ust' ? 'flex-col' : ''}`;

  const gorselSinif =
    gt === 'buyuk-profil'
      ? 'h-24 w-20 shrink-0 rounded-lg object-cover'
      : gt === 'dikey-liste'
        ? 'h-20 w-16 shrink-0 rounded object-cover'
        : 'h-16 w-14 shrink-0 rounded object-cover';

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '✒️'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      <div
        className={listeMod ? 'space-y-2' : 'grid gap-4'}
        style={listeMod ? undefined : gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}
      >
        {dilim.map((y) => (
          <article key={y.id} className={kartSinif}>
            <div className={govdeSinif}>
              {y.yazarGorsel && <img src={medyaUrl(y.yazarGorsel)} alt="" className={gorselSinif} />}
              <div className="min-w-0">
                <p
                  className={`font-bold ${gt === 'koyu-yazar' ? 'text-white' : gt === 'turuncu-unvan' ? 'text-orange-700' : 'text-slate-900'}`}
                >
                  {y.yazarAd}
                </p>
                {y.tarih && (
                  <p className={`text-xs ${gt === 'koyu-yazar' ? 'text-slate-400' : 'text-slate-500'}`}>{y.tarih}</p>
                )}
              </div>
            </div>
            <h3
              className={`mt-2 font-bold ${gt === 'koyu-yazar' ? 'text-white' : 'text-slate-900'} ${gt === 'buyuk-profil' ? 'text-lg' : ''}`}
            >
              {y.baslik}
            </h3>
            {y.ozet && (
              <p
                className={`mt-1 line-clamp-3 text-sm ${gt === 'koyu-yazar' ? 'text-slate-300' : gt === 'yesil-minimal' ? 'text-emerald-700' : 'text-slate-500'}`}
              >
                {y.ozet}
              </p>
            )}
          </article>
        ))}
      </div>
      {!listeMod && (
        <WidgetSayfalama
          toplam={sayfaAdet}
          aktif={sayfa}
          stil={g.sayfalamaStili ?? 'ok'}
          vurguRenk={haberVurguRengi(g)}
          onSec={setSayfa}
          onOnceki={() => setSayfa((p) => Math.max(0, p - 1))}
          onSonraki={() => setSayfa((p) => Math.min(sayfaAdet - 1, p + 1))}
        />
      )}
    </WidgetKabuk>
  );
}

export function IletisimBlokWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.iletisimKartlari ?? [];
  const harita = haritaEmbedUrl(cfg.haritaUrl, cfg.haritaLat, cfg.haritaLng, cfg.haritaZoom ?? 14);
  const mapSag = (g.icerikDuzeni ?? 'sag') === 'sag';
  const gt = widgetGorunumTipiAl(widget);

  const baslikSinif =
    gt === 'turuncu-baslik'
      ? 'mb-2 text-2xl font-bold text-orange-700'
      : gt === 'koyu-iletisim'
        ? 'mb-2 text-2xl font-bold text-white'
        : 'mb-2 text-2xl font-bold text-slate-900';

  const altBaslikSinif =
    gt === 'turuncu-baslik'
      ? 'mb-1 text-xs font-bold uppercase tracking-wider text-orange-600'
      : gt === 'koyu-iletisim'
        ? 'mb-1 text-xs font-bold uppercase tracking-wider text-sky-300'
        : 'mb-1 text-xs font-bold uppercase tracking-wider text-blue-600';

  const aciklamaSinif =
    gt === 'koyu-iletisim' ? 'mb-6 text-slate-300' : 'mb-6 text-slate-600';

  const kartSinif =
    gt === 'kompakt-kart'
      ? 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
      : gt === 'koyu-iletisim'
        ? 'flex gap-3 rounded-xl bg-slate-700/80 p-4 text-white'
        : gt === 'mor-kart'
          ? 'flex gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4'
          : gt === 'turuncu-baslik'
            ? 'flex gap-3 rounded-xl border-l-4 border-orange-500 bg-orange-50 p-4'
            : gt === 'bolunmus-panel'
              ? 'flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4'
              : 'flex gap-3 rounded-xl bg-slate-50 p-4';

  const ikonSinif =
    gt === 'koyu-iletisim'
      ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-lg text-sky-300'
      : gt === 'mor-kart'
        ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-200 text-lg text-violet-700'
        : gt === 'turuncu-baslik'
          ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-200 text-lg text-orange-700'
          : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg';

  const kartGridSinif =
    gt === 'kompakt-kart'
      ? 'grid gap-3'
      : gt === 'kart-harita'
        ? 'grid gap-3 sm:grid-cols-2'
        : 'grid gap-3 sm:grid-cols-2';

  const icerikDuzenSinif =
    gt === 'bolunmus-panel'
      ? `grid gap-8 lg:grid-cols-2 ${mapSag ? '' : 'lg:[direction:rtl] lg:*:[direction:ltr]'}`
      : gt === 'kompakt-kart'
        ? 'space-y-4'
        : gt === 'kart-harita'
          ? `grid gap-6 lg:grid-cols-2 ${mapSag ? '' : 'lg:[direction:rtl] lg:*:[direction:ltr]'}`
          : `grid gap-8 lg:grid-cols-2 ${mapSag ? '' : 'lg:[direction:rtl] lg:*:[direction:ltr]'}`;

  const icerik = (
    <>
      {widget.altBaslik && <p className={altBaslikSinif}>{widget.altBaslik}</p>}
      {widget.baslik && <h2 className={baslikSinif}>{widget.baslik}</h2>}
      {widget.aciklama && <p className={aciklamaSinif}>{widget.aciklama}</p>}
      <div className={icerikDuzenSinif}>
        <div className={kartGridSinif}>
          {kartlar.map((k) => (
            <div key={k.id} className={kartSinif}>
              <span className={ikonSinif}>{k.ikon || '📍'}</span>
              <div>
                <p className={`text-xs ${gt === 'koyu-iletisim' ? 'text-slate-400' : 'text-slate-500'}`}>{k.etiket}</p>
                <p className={`font-bold ${gt === 'koyu-iletisim' ? 'text-white' : 'text-slate-900'}`}>{k.deger}</p>
              </div>
            </div>
          ))}
        </div>
        {harita && gt !== 'kompakt-kart' && (
          <iframe
            title="Harita"
            src={harita}
            className={`w-full rounded-2xl shadow-lg ${gt === 'kart-harita' ? 'min-h-[360px]' : 'min-h-[320px]'}`}
            loading="lazy"
          />
        )}
      </div>
      {harita && gt === 'kompakt-kart' && (
        <iframe
          title="Harita"
          src={harita}
          className="mt-6 min-h-[280px] w-full rounded-2xl border border-slate-200 shadow-sm"
          loading="lazy"
        />
      )}
    </>
  );

  if (gt === 'koyu-iletisim') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8">{icerik}</div>
      </WidgetKabuk>
    );
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}

export function KategoriHaberListesiWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const kolon =
    gt === 'kompakt-satir'
      ? 1
      : gt === 'hero-liste'
        ? 4
        : g.kolonSayisi ?? 2;

  const gridSinif =
    gt === 'koyu-kart'
      ? 'grid gap-3 rounded-2xl bg-slate-900 p-4'
      : gt === 'hero-liste'
        ? 'grid gap-3'
        : 'grid gap-3';

  const kartProps = (k: typeof kartlar[number], i: number) => {
    if (gt === 'hero-liste' && i === 0) {
      return { kartStili: 'duz' as const, gorselKonumu: 'ust' as const };
    }
    if (gt === 'kompakt-satir') {
      return { kartStili: 'yatay' as const, gorselKonumu: 'sol' as const };
    }
    if (gt === 'mor-overlay') {
      return { kartStili: 'overlay' as const };
    }
    if (gt === 'turuncu-kategori') {
      return { kartStili: k.kartStili ?? 'yatay' as const, gorselKonumu: g.gorselKonumu };
    }
    return {
      kartStili: k.kartStili,
      gorselKonumu: k.kartStili ? undefined : g.gorselKonumu,
    };
  };

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '🚗'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      {gt === 'turuncu-kategori' && (
        <div className="mb-3 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
          {widget.baslik ?? 'Kategori'}
        </div>
      )}
      <div className={gridSinif} style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
        {kartlar.map((k, i) => (
          <div
            key={k.id}
            className={
              gt === 'koyu-kart'
                ? 'rounded-xl bg-slate-800 p-2'
                : gt === 'kompakt-satir'
                  ? 'border-b border-slate-100 py-1 last:border-0'
                  : ''
            }
          >
            <HaberKartGovde kart={k} g={g} {...kartProps(k, i)} />
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}

export function KategoriHaberOverlayWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const kolon =
    gt === 'kucuk-grid'
      ? Math.max(g.kolonSayisi ?? 4, 4)
      : gt === 'hero-grid'
        ? 4
        : g.kolonSayisi ?? 3;

  const sariciSinif =
    gt === 'koyu-overlay'
      ? 'rounded-2xl bg-slate-900 p-4'
      : gt === 'korall-baslik'
        ? 'rounded-2xl border border-rose-100 bg-rose-50/50 p-4'
        : gt === 'yesil-etiket'
          ? 'rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4'
          : '';

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '📶'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      {gt === 'korall-baslik' && (
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-rose-600">{widget.altBaslik ?? widget.baslik}</p>
      )}
      <div className={sariciSinif}>
        <div
          className={`grid gap-3 ${gt === 'kucuk-grid' ? 'gap-2' : ''}`}
          style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}
        >
          {kartlar.map((k, i) => (
            <div
              key={k.id}
              className={
                gt === 'hero-grid' && i === 0
                  ? 'md:col-span-2 md:row-span-2'
                  : gt === 'kucuk-grid'
                    ? 'text-sm'
                    : ''
              }
            >
              <HaberKartGovde
                kart={{
                  ...k,
                  badge: gt === 'yesil-etiket' ? k.badge ?? 'Haber' : k.badge,
                }}
                g={g}
                kartStili="overlay"
              />
            </div>
          ))}
        </div>
      </div>
    </WidgetKabuk>
  );
}

export function VideoGalerisiWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const videolar = cfg.videoKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const [sayfa, setSayfa] = useState(0);
  const kolon = gt === 'dikey-liste' ? 1 : g.kolonSayisi ?? 4;
  const listeMod = gt === 'dikey-liste' || gt === 'yesil-minimal';
  const sayfaAdet = listeMod ? 1 : Math.max(1, Math.ceil(videolar.length / kolon));
  const dilim = listeMod ? videolar : videolar.slice(sayfa * kolon, sayfa * kolon + kolon);

  const playSinif =
    gt === 'turuncu-play'
      ? 'flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-2xl text-white shadow-lg'
      : 'flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-2xl text-white';

  const linkSinif =
    gt === 'okyanus-kart'
      ? 'group block rounded-xl border border-blue-200 bg-blue-50 p-3 transition hover:border-blue-400'
      : gt === 'yesil-minimal'
        ? 'group flex items-center gap-3 rounded-lg border-b border-emerald-100 py-2'
        : 'group block';

  const baslikSinif =
    gt === 'yesil-minimal'
      ? 'text-sm font-semibold text-emerald-900'
      : gt === 'okyanus-kart'
        ? 'mt-2 text-center text-sm font-bold text-blue-900'
        : 'mt-2 text-center text-sm font-bold text-slate-900';

  if (gt === 'hero-video') {
    const hero = videolar[0];
    const kucuk = videolar.slice(1);
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '▶️'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {hero && (
            <a href={hero.link || hero.videoLink || '#'} className="group block lg:col-span-2">
              <VideoKapak v={hero} playSinif={playSinif} />
              <p className="mt-2 text-lg font-bold text-slate-900">{hero.baslik}</p>
            </a>
          )}
          <div className="space-y-3">
            {kucuk.map((v) => (
              <a key={v.id} href={v.link || v.videoLink || '#'} className="group flex gap-3">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {v.gorselUrl && <img src={medyaUrl(v.gorselUrl)} alt="" className="h-full w-full object-cover opacity-80" />}
                  <span className="absolute inset-0 flex items-center justify-center text-white">▶</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{v.baslik}</p>
              </a>
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '▶️'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      <div
        className={listeMod ? 'space-y-2' : 'grid gap-4'}
        style={listeMod ? undefined : gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}
      >
        {dilim.map((v) => (
          <a key={v.id} href={v.link || v.videoLink || '#'} className={linkSinif}>
            {gt === 'yesil-minimal' ? (
              <>
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-slate-800">
                  {v.gorselUrl && <img src={medyaUrl(v.gorselUrl)} alt="" className="h-full w-full object-cover" />}
                </div>
                <span className={baslikSinif}>{v.baslik}</span>
              </>
            ) : (
              <>
                <VideoKapak v={v} playSinif={playSinif} />
                <p className={baslikSinif}>{v.baslik}</p>
              </>
            )}
          </a>
        ))}
      </div>
      {!listeMod && (
        <WidgetSayfalama
          toplam={sayfaAdet}
          aktif={sayfa}
          stil={g.sayfalamaStili ?? 'ok'}
          vurguRenk={haberVurguRengi(g)}
          onSec={setSayfa}
          onOnceki={() => setSayfa((p) => Math.max(0, p - 1))}
          onSonraki={() => setSayfa((p) => Math.min(sayfaAdet - 1, p + 1))}
        />
      )}
    </WidgetKabuk>
  );
}

export function SekmeliHaberWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const sekmeler = cfg.haberSekmeler ?? [];
  const [aktif, setAktif] = useState(0);
  const sekme = sekmeler[aktif];
  const oneCikan = sekme?.kartlar[0];
  const liste = sekme?.kartlar.slice(1) ?? [];
  const gt = widgetGorunumTipiAl(widget);

  const sekmeSinif = (i: number) => {
    const aktifMi = i === aktif;
    if (gt === 'pill-sekme') {
      return `rounded-full px-4 py-2 text-sm font-semibold transition ${aktifMi ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`;
    }
    if (gt === 'sade-sekme') {
      return `px-3 py-2 text-sm transition ${aktifMi ? 'font-bold text-slate-900' : 'text-slate-400 hover:text-slate-600'}`;
    }
    if (gt === 'turuncu-aktif') {
      return `border-b-2 px-4 py-2 text-sm font-semibold transition ${aktifMi ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500'}`;
    }
    if (gt === 'mor-vurgu') {
      return `border-b-2 px-4 py-2 text-sm font-semibold transition ${aktifMi ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500'}`;
    }
    return `border-b-2 px-4 py-2 text-sm font-semibold transition ${aktifMi ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`;
  };

  const sekmeKapsayiciSinif =
    gt === 'pill-sekme'
      ? 'mb-4 flex flex-wrap gap-2'
      : gt === 'sade-sekme'
        ? 'mb-4 flex flex-wrap gap-1'
        : 'mb-4 flex flex-wrap gap-2 border-b border-slate-200';

  const icerikSinif =
    gt === 'koyu-panel'
      ? 'rounded-2xl bg-slate-900 p-6 text-white'
      : gt === 'sade-sekme'
        ? 'space-y-4'
        : '';

  const icerikIci =
    sekme &&
    (gt === 'sade-sekme' ? (
      <div className="space-y-3">
        {sekme.kartlar.map((k) => (
          <HaberKartGovde key={k.id} kart={k} g={g} gorselKonumu="sol" kartStili="yatay" />
        ))}
      </div>
    ) : (
      <div className="grid gap-6 lg:grid-cols-2">
        {oneCikan && (
          <div>
            <HaberKartGovde kart={oneCikan} g={g} kartStili="duz" gorselKonumu="ust" />
            {oneCikan.ozet && (
              <p className={`mt-3 text-sm ${gt === 'koyu-panel' ? 'text-slate-300' : 'text-slate-600'}`}>
                {oneCikan.ozet}
              </p>
            )}
          </div>
        )}
        <div className="space-y-3">
          {liste.map((k) => (
            <HaberKartGovde key={k.id} kart={k} g={g} gorselKonumu="sol" kartStili="yatay" />
          ))}
        </div>
      </div>
    ));

  return (
    <WidgetKabuk widget={widget}>
      <div className={sekmeKapsayiciSinif}>
        {sekmeler.map((s, i) => (
          <button key={s.id} type="button" onClick={() => setAktif(i)} className={sekmeSinif(i)}>
            {s.baslik}
          </button>
        ))}
      </div>
      {icerikSinif ? <div className={icerikSinif}>{icerikIci}</div> : icerikIci}
    </WidgetKabuk>
  );
}

export function HavaDurumuWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const sehir = cfg.havaSehir ?? 'İstanbul';
  const ilce = cfg.havaIlce ?? '';
  const apiMod = cfg.havaKaynak !== 'manuel';
  const gt = widgetGorunumTipiAl(widget);
  const [apiVeri, setApiVeri] = useState<HavaDurumuYanit | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!apiMod || !sehir.trim()) return;
    let iptal = false;
    setYukleniyor(true);
    setHata('');
    void havaDurumuGetir(sehir, ilce)
      .then((veri) => {
        if (!iptal) setApiVeri(veri);
      })
      .catch((err) => {
        if (!iptal) setHata(err instanceof Error ? err.message : 'Hava verisi alınamadı');
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [apiMod, sehir, ilce]);

  const anlik = apiVeri?.anlik ?? cfg.havaAnlik ?? {
    sicaklik: '—',
    durum: yukleniyor ? 'Yükleniyor...' : hata || 'Veri yok',
    hissedilen: '—',
    nem: '—',
    ruzgar: '—',
  };
  const gunler = apiVeri?.gunler ?? cfg.havaGunler ?? [];
  const gosterSehir = apiVeri?.sehir ?? sehir;
  const gosterIlce = apiVeri?.ilce ?? ilce;

  const panelSinif: Record<string, string> = {
    'detayli-panel': 'rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white',
    'kompakt-ozet': 'rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm',
    'tam-banner': '-mx-[var(--container-pad,1rem)] rounded-none bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 px-6 py-6 text-white sm:px-10',
    'turuncu-gunes': 'rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 p-4 text-white',
    'yesil-tahmin': 'rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-emerald-950',
    'mor-gece': 'rounded-2xl bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 p-4 text-white',
  };

  const koyuTema = gt === 'detayli-panel' || gt === 'tam-banner' || gt === 'mor-gece' || gt === 'turuncu-gunes';
  const kompakt = gt === 'kompakt-ozet';

  const gunKutuSinif = koyuTema
    ? 'rounded-lg bg-white/10 p-2 text-center text-xs'
    : gt === 'yesil-tahmin'
      ? 'rounded-lg border border-emerald-200 bg-white p-2 text-center text-xs'
      : 'rounded-lg bg-slate-50 p-2 text-center text-xs';

  const govde = (
    <>
      <div className={`mb-4 flex gap-2 ${kompakt ? 'flex-wrap' : ''}`}>
        <span
          className={`rounded-lg px-3 py-1 text-sm ${koyuTema ? 'bg-white/10' : 'bg-slate-100 text-slate-700'}`}
        >
          {gosterSehir}
        </span>
        {gosterIlce && (
          <span
            className={`rounded-lg px-3 py-1 text-sm ${koyuTema ? 'bg-white/10' : 'bg-slate-100 text-slate-700'}`}
          >
            {gosterIlce}
          </span>
        )}
      </div>
      {hata && !yukleniyor && (
        <p
          className={`mb-3 rounded-lg px-3 py-2 text-sm ${koyuTema ? 'bg-red-500/20' : 'bg-red-50 text-red-700'}`}
        >
          {hata}
        </p>
      )}
      <div className={`${kompakt ? 'flex items-center justify-between gap-4' : 'mb-6 flex items-center justify-between'}`}>
        <div>
          <p className={`font-bold ${kompakt ? 'text-3xl' : 'text-5xl'}`}>{anlik.sicaklik}</p>
          <p className={`text-sm ${koyuTema ? 'text-white/70' : 'text-slate-500'}`}>{anlik.durum}</p>
        </div>
        <span className={kompakt ? 'text-4xl' : 'text-6xl'}>{gt === 'turuncu-gunes' ? '☀️' : '⛅'}</span>
      </div>
      {!kompakt && (
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className={gunKutuSinif}>
            <p className={koyuTema ? 'text-white/60' : 'text-slate-500'}>Hissedilen</p>
            <p className="font-bold">{anlik.hissedilen}</p>
          </div>
          <div className={gunKutuSinif}>
            <p className={koyuTema ? 'text-white/60' : 'text-slate-500'}>Nem</p>
            <p className="font-bold">{anlik.nem}</p>
          </div>
          <div className={gunKutuSinif}>
            <p className={koyuTema ? 'text-white/60' : 'text-slate-500'}>Rüzgar</p>
            <p className="font-bold">{anlik.ruzgar}</p>
          </div>
        </div>
      )}
      {!kompakt && (
        <div className={`grid gap-2 ${gt === 'yesil-tahmin' ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-4'}`}>
          {gunler.map((gun) => (
            <div key={gun.id} className={gunKutuSinif}>
              <p className="font-semibold">{gun.gun}</p>
              <p className="my-1 text-lg">{gun.ikon ?? '☀️'}</p>
              <p className={koyuTema ? 'text-white/70' : 'text-slate-500'}>{gun.durum}</p>
              <p className="mt-1 font-bold">{gun.max} / {gun.min}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <WidgetKabuk widget={widget}>
      <div className={panelSinif[gt] ?? panelSinif['detayli-panel']}>{govde}</div>
    </WidgetKabuk>
  );
}

export function KriptoListesiWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const apiMod = cfg.kriptoKaynak !== 'manuel';
  const limit = cfg.kriptoLimit ?? 10;
  const semboller = cfg.kriptoSemboller ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const [apiListe, setApiListe] = useState<KriptoPiyasaVeri[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!apiMod) return;
    let iptal = false;

    const yukle = () => {
      setYukleniyor(true);
      void kriptoListesiGetir(limit, semboller.length ? semboller : undefined)
        .then((veri) => {
          if (!iptal) setApiListe(veri);
        })
        .finally(() => {
          if (!iptal) setYukleniyor(false);
        });
    };

    yukle();
    const timer = window.setInterval(yukle, 5 * 60 * 1000);
    return () => {
      iptal = true;
      window.clearInterval(timer);
    };
  }, [apiMod, limit, semboller.join(',')]);

  const liste = apiMod
    ? apiListe.map((k) => ({
        id: k.id,
        sembol: k.sembol,
        ad: k.ad,
        fiyat: k.fiyat,
        degisim: k.degisim,
        ikonUrl: k.ikonUrl,
      }))
    : (cfg.kriptoParalar ?? []);
  const renk = haberVurguRengi(g);

  const satirSinif =
    gt === 'kart-liste'
      ? 'rounded-xl border border-slate-200 bg-slate-800 p-4 text-white'
      : gt === 'mor-koyu'
        ? 'rounded-xl bg-violet-950/90 p-4 text-violet-50'
        : gt === 'altin-premium'
          ? 'rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4'
          : gt === 'yesil-artis'
            ? 'rounded-xl border border-slate-100 bg-white px-4 py-3'
            : 'flex items-center gap-3 px-4 py-3';

  const listeSinif =
    gt === 'ticker-serit'
      ? 'flex gap-3 overflow-x-auto pb-2'
      : gt === 'kart-liste' || gt === 'mor-koyu' || gt === 'altin-premium'
        ? 'space-y-3'
        : 'overflow-hidden rounded-xl border border-slate-100 bg-white';

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} g={g} />
      {yukleniyor && liste.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-500">Kripto verileri yükleniyor...</p>
      )}
      <div className={listeSinif}>
        {liste.map((k, i) => {
          const neg = k.degisim.trim().startsWith('-');
          const degisimSinif =
            gt === 'altin-premium'
              ? `rounded px-2 py-0.5 text-xs font-bold ${neg ? 'bg-red-100 text-red-700' : 'bg-amber-200 text-amber-900'}`
              : `rounded px-2 py-0.5 text-xs font-bold text-white ${neg ? 'bg-red-500' : 'bg-emerald-500'}`;

          if (gt === 'ticker-serit') {
            return (
              <div key={k.id} className="min-w-[140px] shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-center">
                <p className="text-xs font-bold text-blue-800">{k.sembol}</p>
                <p className="text-sm font-semibold text-slate-800">{k.fiyat}</p>
                <p className={`text-xs font-bold ${neg ? 'text-red-600' : 'text-emerald-600'}`}>{k.degisim}</p>
              </div>
            );
          }

          if (gt === 'kart-liste' || gt === 'mor-koyu' || gt === 'altin-premium') {
            return (
              <div key={k.id} className={satirSinif}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-lg font-bold ${gt === 'altin-premium' ? 'text-amber-900' : ''}`}>{k.sembol}</p>
                    <p className={`text-sm ${gt === 'altin-premium' ? 'text-amber-700' : 'text-white/70'}`}>{k.ad}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${gt === 'altin-premium' ? 'text-amber-950' : ''}`}>{k.fiyat}</p>
                    <span className={degisimSinif}>{k.degisim}</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={k.id} className={`${satirSinif} ${i > 0 ? 'border-t border-slate-100' : ''}`}>
              <span className="w-10 text-center font-bold text-slate-700">{k.ikonUrl ? '🪙' : k.sembol.slice(0, 1)}</span>
              <span className="w-14 font-bold">{k.sembol}</span>
              <span className="flex-1 text-slate-700">{k.fiyat}</span>
              <span className={degisimSinif}>{k.degisim}</span>
            </div>
          );
        })}
      </div>
      {cfg.tumunuGorLink && (
        <a
          href={cfg.tumunuGorLink}
          className="mt-3 block rounded-lg py-3 text-center text-sm font-bold text-white"
          style={{ backgroundColor: renk }}
        >
          {cfg.tumunuGorMetin ?? 'Tümünü Göster →'}
        </a>
      )}
    </WidgetKabuk>
  );
}

export function GuncelKonularWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const renk = haberVurguRengi(g);

  const numaraRenk =
    gt === 'okyanus-vurgu'
      ? '#2563eb'
      : gt === 'koyu-numara'
        ? '#1e293b'
        : gt === 'turuncu-baslik'
          ? '#ea580c'
          : renk;

  const listeSinif =
    gt === 'koyu-numara'
      ? 'divide-y divide-slate-700 rounded-xl bg-slate-900'
      : gt === 'kompakt-liste'
        ? 'divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white'
        : 'divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white';

  const linkSinif =
    gt === 'kompakt-liste'
      ? 'flex gap-2 p-2 transition hover:bg-slate-50'
      : 'flex gap-3 p-3 transition hover:bg-slate-50';

  const metinSinif =
    gt === 'koyu-numara'
      ? 'text-sm font-medium leading-snug text-slate-100'
      : 'text-sm font-medium leading-snug text-slate-800';

  if (gt === 'hero-konu' && kartlar[0]) {
    const hero = kartlar[0];
    const liste = kartlar.slice(1);
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} g={g} />
        <a href={hero.link || '#'} className="mb-4 block overflow-hidden rounded-2xl border border-rose-100 bg-rose-50">
          {hero.gorselUrl && (
            <img src={medyaUrl(hero.gorselUrl)} alt="" className="aspect-video w-full object-cover" />
          )}
          <div className="p-4">
            <p className="text-lg font-bold text-rose-900">{hero.baslik}</p>
            {hero.ozet && <p className="mt-2 text-sm text-rose-700">{hero.ozet}</p>}
          </div>
        </a>
        <ol className={listeSinif}>
          {liste.map((k, i) => (
            <li key={k.id}>
              <a href={k.link || '#'} className={linkSinif}>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
                  style={{ backgroundColor: numaraRenk }}
                >
                  {i + 2}
                </span>
                <span className={metinSinif}>{k.baslik}</span>
              </a>
            </li>
          ))}
        </ol>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'turuncu-baslik' && (
        <div className="mb-3 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
          {widget.baslik ?? 'Güncel Konular'}
        </div>
      )}
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} g={g} />
      <ol className={listeSinif}>
        {kartlar.map((k, i) => (
          <li key={k.id}>
            <a href={k.link || '#'} className={linkSinif}>
              <span
                className={`flex shrink-0 items-center justify-center rounded text-xs font-bold text-white ${
                  gt === 'kompakt-liste' ? 'h-6 w-6' : 'h-7 w-7'
                }`}
                style={{ backgroundColor: numaraRenk }}
              >
                {i + 1}
              </span>
              <span className={metinSinif}>{k.baslik}</span>
            </a>
          </li>
        ))}
      </ol>
    </WidgetKabuk>
  );
}

export function SirketGirisCikisWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const v = cfg.acilisKapanisSaatleri;
  const gt = widgetGorunumTipiAl(widget);
  const renk = g.vurguRengi ?? '#2563eb';

  if (!v) return null;

  const gunler = [
    { ad: 'Hafta İçi', acilis: v.haftaIciAcilis, kapanis: v.haftaIciKapanis },
    { ad: 'Cumartesi', acilis: v.cumartesiAcilis, kapanis: v.cumartesiKapanis },
    { ad: 'Pazar', acilis: v.pazarAcilis, kapanis: v.pazarKapanis },
  ];

  const koyuTema = gt !== 'bilgi-kart';
  const buyukSaat = gt === 'canli-banner' || gt === 'koyu-saat' || gt === 'turuncu-uyari';

  const govde = (
    <>
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${koyuTema ? 'border-white/20' : 'border-slate-200'}`}
      >
        <span className={`font-bold ${koyuTema ? '' : 'text-slate-900'}`}>🏢 Şirket Açılış / Kapanış</span>
        {gt === 'canli-banner' && cfg.sirketAnlikSaat && (
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">🕐 {cfg.sirketAnlikSaat}</span>
        )}
      </div>
      <div className="p-4">
        <p className={`text-xl font-bold ${koyuTema ? '' : 'text-slate-900'}`}>{cfg.sirketKonum ?? 'Merkez Ofis'}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {cfg.sirketAnlikSaat && (
            <div>
              <p className={`text-xs ${koyuTema ? 'text-white/70' : 'text-slate-500'}`}>Anlık saat</p>
              <p className={`font-bold ${buyukSaat ? 'text-2xl' : 'text-lg'}`}>{cfg.sirketAnlikSaat}</p>
            </div>
          )}
          {cfg.kapanisaKalan && (
            <div>
              <p className={`text-xs ${koyuTema ? 'text-white/70' : 'text-slate-500'}`}>Kapanışa kalan</p>
              <p className={`font-bold ${buyukSaat ? 'text-2xl' : 'text-lg'}`}>{cfg.kapanisaKalan}</p>
            </div>
          )}
        </div>
      <div className="mt-4 space-y-2">
        {gunler.map((gun) => (
          <div
            key={gun.ad}
            className={
              gt === 'bilgi-kart'
                ? 'rounded-lg border border-slate-200 bg-slate-50 p-2'
                : gt === 'yesil-acik'
                  ? 'rounded-lg bg-white/15 p-2'
                  : 'rounded-lg bg-white/10 p-2'
            }
          >
            <p
              className={`mb-2 text-center text-[11px] font-bold uppercase tracking-wide ${
                koyuTema ? 'text-white/80' : 'text-slate-500'
              }`}
            >
              {gun.ad}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white p-2 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-500">Açılış</p>
                <p className="text-sm font-bold text-slate-900">{gun.acilis}</p>
              </div>
              <div className="rounded-lg bg-white p-2 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-500">Kapanış</p>
                <p className="text-sm font-bold text-slate-900">{gun.kapanis}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );

  const arkaPlanSinif: Record<string, string> = {
    'saat-tablosu': '',
    'canli-banner': 'bg-gradient-to-r from-blue-600 to-blue-500',
    'bilgi-kart': '',
    'koyu-saat': 'bg-slate-900',
    'yesil-acik': 'bg-emerald-600',
    'turuncu-uyari': 'bg-gradient-to-r from-orange-500 to-amber-500',
  };

  if (gt === 'bilgi-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">{govde}</div>
      </WidgetKabuk>
    );
  }

  if (gt === 'canli-banner') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="-mx-[var(--container-pad,1rem)] overflow-hidden rounded-none bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          {govde}
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div
        className={`overflow-hidden rounded-2xl text-white ${arkaPlanSinif[gt] ?? ''}`}
        style={gt === 'saat-tablosu' ? { backgroundColor: renk } : undefined}
      >
        {govde}
      </div>
    </WidgetKabuk>
  );
}

export function HaberMagazinWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const kolon =
    gt === 'kompakt-magazin'
      ? Math.max(g.kolonSayisi ?? 4, 4)
      : gt === 'hero-magazin'
        ? 4
        : g.kolonSayisi ?? 3;

  const sariciSinif =
    gt === 'koyu-editor'
      ? 'rounded-2xl bg-slate-900 p-4'
      : gt === 'okyanus-kategori'
        ? 'rounded-2xl border border-blue-100 bg-blue-50/40 p-4'
        : '';

  const kartStiliBelirle = (k: typeof kartlar[number], i: number) => {
    if (gt === 'turuncu-spot' && i === 0) return 'overlay' as const;
    return k.kartStili ?? (k.badge ? 'overlay' : 'duz');
  };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'okyanus-kategori' && (
        <div className="mb-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
          {widget.baslik ?? 'Magazin'}
        </div>
      )}
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '📊'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      <div className={sariciSinif}>
        <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
          {kartlar.map((k, i) => (
            <div
              key={k.id}
              className={
                gt === 'hero-magazin' && i === 0
                  ? 'md:col-span-2 md:row-span-2'
                  : gt === 'turuncu-spot' && i === 0
                    ? 'ring-2 ring-orange-400 rounded-lg'
                    : gt === 'kompakt-magazin'
                      ? 'text-sm'
                      : ''
              }
            >
              <HaberKartGovde
                kart={k}
                g={g}
                kartStili={kartStiliBelirle(k, i)}
                gorselKonumu={gt === 'hero-magazin' && i === 0 ? 'ust' : g.gorselKonumu}
              />
            </div>
          ))}
        </div>
      </div>
    </WidgetKabuk>
  );
}
