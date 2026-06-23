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
  const gt = widgetGorunumTipiAl(widget);
  const vurgu = haberVurguRengi(g);
  const baslikRenk = g.baslikRengi || '#0f172a';
  const metinRenk = g.metinRengi || '#64748b';
  const radius = g.borderRadius ?? 16;

  const HaritaFrame = ({ sinif }: { sinif?: string }) =>
    harita ? (
      <iframe title="Harita" src={harita} className={sinif ?? 'ib-harita'} loading="lazy" />
    ) : null;

  const IletisimKart = ({ k, kompakt = false }: { k: (typeof kartlar)[number]; kompakt?: boolean }) => (
    <div className={kompakt ? 'ib-kart ib-kart--kompakt' : 'ib-kart'} style={{ borderRadius: radius }}>
      <span className="ib-kart-ikon" style={{ backgroundColor: `${vurgu}22`, color: vurgu }}>
        {k.ikon || '📍'}
      </span>
      <div>
        <p className="ib-kart-etiket" style={{ color: metinRenk }}>
          {k.etiket}
        </p>
        <p className="ib-kart-deger" style={{ color: baslikRenk }}>
          {k.deger}
        </p>
      </div>
    </div>
  );

  const BaslikAlani = () => (
    <>
      {widget.altBaslik && (
        <p className="ib-alt-baslik" style={{ color: vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className="ib-baslik" style={{ color: baslikRenk }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="ib-aciklama" style={{ color: metinRenk }}>
          {widget.aciklama}
        </p>
      )}
    </>
  );

  const CtaButon = () => {
    if (!widget.butonMetni?.trim()) return null;
    const link = widget.butonLink?.trim();
    const sinif = 'ib-cta';
    const stil = { backgroundColor: vurgu, borderRadius: radius };
    if (link) {
      return (
        <a href={link.startsWith('http') ? link : `https://${link}`} className={sinif} style={stil}>
          {widget.butonMetni}
        </a>
      );
    }
    return (
      <span className={sinif} style={stil}>
        {widget.butonMetni}
      </span>
    );
  };

  if (gt === 'harita-ust-kart-alt') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ib-ust-harita">
          <BaslikAlani />
          <HaritaFrame sinif="ib-harita ib-harita--ust" />
          <div className="ib-kart-grid">
            {kartlar.map((k) => (
              <IletisimKart key={k.id} k={k} />
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'overlay-yuzen-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ib-overlay-wrap">
          <HaritaFrame sinif="ib-harita ib-harita--overlay" />
          <div className="ib-yuzen-kart" style={{ borderRadius: radius }}>
            <BaslikAlani />
            <div className="ib-yuzen-liste">
              {kartlar.map((k) => (
                <IletisimKart key={k.id} k={k} kompakt />
              ))}
            </div>
            <CtaButon />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'ikon-serit-harita') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ib-ikon-serit">
          <BaslikAlani />
          <div className="ib-serit">
            {kartlar.map((k) => (
              <div key={k.id} className="ib-serit-oge" style={{ borderRadius: radius }}>
                <span className="ib-serit-ikon" style={{ color: vurgu }}>
                  {k.ikon || '📍'}
                </span>
                <div>
                  <p className="ib-serit-etiket" style={{ color: metinRenk }}>
                    {k.etiket}
                  </p>
                  <p className="ib-serit-deger" style={{ color: baslikRenk }}>
                    {k.deger}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <HaritaFrame sinif="ib-harita ib-harita--genis" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cam-panel-harita') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ib-cam-grid">
          <div className="ib-cam-panel" style={{ borderRadius: radius }}>
            <BaslikAlani />
            <div className="ib-cam-liste">
              {kartlar.map((k) => (
                <IletisimKart key={k.id} k={k} kompakt />
              ))}
            </div>
            <CtaButon />
          </div>
          <HaritaFrame sinif="ib-harita ib-harita--cam" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'sidebar-liste-harita') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="ib-sidebar-grid">
          <aside className="ib-sidebar" style={{ borderRadius: radius }}>
            <BaslikAlani />
            <div className="ib-sidebar-liste">
              {kartlar.map((k) => (
                <div key={k.id} className="ib-sidebar-satir">
                  <span style={{ color: vurgu }}>{k.ikon || '📍'}</span>
                  <div>
                    <p className="ib-sidebar-etiket" style={{ color: metinRenk }}>
                      {k.etiket}
                    </p>
                    <p className="ib-sidebar-deger" style={{ color: baslikRenk }}>
                      {k.deger}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <HaritaFrame sinif="ib-harita ib-harita--sidebar" />
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="ib-split-grid">
        <div className="ib-split-sol">
          <BaslikAlani />
          <div className="ib-kart-grid ib-kart-grid--2">
            {kartlar.map((k) => (
              <IletisimKart key={k.id} k={k} />
            ))}
          </div>
        </div>
        <HaritaFrame sinif="ib-harita ib-harita--split" />
      </div>
    </WidgetKabuk>
  );
}

export function KategoriHaberListesiWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const vurgu = haberVurguRengi(g);
  const [sayfa, setSayfa] = useState(0);
  const sayfaBoyut = g.kolonSayisi ?? 3;
  const sayfaAdet = Math.max(1, Math.ceil(kartlar.length / sayfaBoyut));
  const dilim = kartlar.slice(sayfa * sayfaBoyut, sayfa * sayfaBoyut + sayfaBoyut);

  const heroMetin = (cfg.gorunum?.tipEk?.heroBannerMetin as string) || widget.aciklama;

  if (gt === 'magazin-asimetrik') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '🚗'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="khl-magazin">
          {kartlar.map((k, i) => (
            <div key={k.id} className={i === 0 ? 'khl-magazin-hero' : 'khl-magazin-kart'}>
              <HaberKartGovde
                kart={k}
                g={g}
                kartStili={i === 0 ? 'overlay' : 'duz'}
                gorselKonumu={i === 0 ? 'ust' : 'sol'}
              />
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'snap-yatay-serit') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '🚗'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="khl-snap">
          {kartlar.map((k) => (
            <article key={k.id} className="khl-snap-kart">
              <HaberKartGovde kart={k} g={g} kartStili="duz" gorselKonumu="ust" />
            </article>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'numarali-haber') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.altBaslik && (
          <p className="khl-numara-etiket" style={{ color: vurgu }}>
            {widget.altBaslik}
          </p>
        )}
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '🚗'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="khl-numara-liste">
          {kartlar.map((k, i) => (
            <article key={k.id} className="khl-numara-satir">
              <span className="khl-numara" style={{ color: vurgu }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <HaberKartGovde kart={k} g={g} kartStili="yatay" gorselKonumu="sol" />
            </article>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'timeline-tarih') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '🚗'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        {widget.aciklama && <p className="khl-timeline-aciklama">{widget.aciklama}</p>}
        <div className="khl-timeline">
          {kartlar.map((k) => (
            <article key={k.id} className="khl-timeline-oge">
              <div className="khl-timeline-tarih" style={{ borderColor: vurgu, color: vurgu }}>
                {k.tarih || '—'}
              </div>
              <div className="khl-timeline-cizgi" style={{ backgroundColor: vurgu }} />
              <div className="khl-timeline-icerik">
                <HaberKartGovde kart={k} g={g} kartStili="yatay" gorselKonumu="sol" />
              </div>
            </article>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'karusel-sayfali') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '🚗'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="khl-karusel" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: sayfaBoyut } })}>
          {dilim.map((k) => (
            <HaberKartGovde key={k.id} kart={k} g={g} kartStili="duz" gorselKonumu="ust" />
          ))}
        </div>
        <WidgetSayfalama
          toplam={sayfaAdet}
          aktif={sayfa}
          stil={g.sayfalamaStili ?? 'nokta'}
          vurguRenk={vurgu}
          onSec={setSayfa}
          onOnceki={() => setSayfa((p) => Math.max(0, p - 1))}
          onSonraki={() => setSayfa((p) => Math.min(sayfaAdet - 1, p + 1))}
        />
      </WidgetKabuk>
    );
  }

  const hero = kartlar[0];
  const liste = kartlar.slice(1);

  return (
    <WidgetKabuk widget={widget}>
      {widget.altBaslik && (
        <p className="khl-hero-etiket" style={{ color: vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '🚗'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      <div className="khl-hero-liste">
        {hero && (
          <div className="khl-hero-ana">
            <HaberKartGovde kart={hero} g={g} kartStili="overlay" gorselKonumu="ust" />
            {heroMetin && <p className="khl-hero-metin">{heroMetin}</p>}
          </div>
        )}
        <div className="khl-hero-alt">
          {liste.map((k) => (
            <HaberKartGovde key={k.id} kart={k} g={g} kartStili="yatay" gorselKonumu="sol" />
          ))}
        </div>
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
  const [acikAccordion, setAcikAccordion] = useState<number | null>(0);
  const sekme = sekmeler[aktif];
  const oneCikan = sekme?.kartlar[0];
  const liste = sekme?.kartlar.slice(1) ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const vurgu = haberVurguRengi(g);
  const filtreler = cfg.filtreler ?? sekmeler.map((s) => s.baslik);

  const HeroListeIcerik = () =>
    sekme ? (
      <div className="sh-hero-grid">
        {oneCikan && (
          <div className="sh-hero-sol">
            <HaberKartGovde kart={oneCikan} g={g} kartStili="duz" gorselKonumu="ust" />
            {oneCikan.ozet && <p className="sh-hero-ozet">{oneCikan.ozet}</p>}
          </div>
        )}
        <div className="sh-hero-sag">
          {liste.map((k) => (
            <HaberKartGovde key={k.id} kart={k} g={g} gorselKonumu="sol" kartStili="yatay" />
          ))}
        </div>
      </div>
    ) : null;

  if (gt === 'dikey-sekme-panel') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="sh-dikey-grid">
          <aside className="sh-dikey-sol">
            {cfg.solBaslik && <h3 className="sh-dikey-baslik" style={{ color: vurgu }}>{cfg.solBaslik}</h3>}
            {cfg.solAciklama && <p className="sh-dikey-aciklama">{cfg.solAciklama}</p>}
            <nav className="sh-dikey-nav">
              {sekmeler.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={i === aktif ? 'sh-dikey-btn sh-dikey-btn--aktif' : 'sh-dikey-btn'}
                  style={i === aktif ? { borderColor: vurgu, color: vurgu } : undefined}
                  onClick={() => setAktif(i)}
                >
                  {s.baslik}
                </button>
              ))}
            </nav>
          </aside>
          <div className="sh-dikey-icerik">
            {widget.baslik && <h2 className="sh-bolum-baslik" style={{ color: g.baslikRengi || '#0f172a' }}>{widget.baslik}</h2>}
            <HeroListeIcerik />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'grid-kart-sekme') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '📰'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="sh-sekme-satir sh-sekme-satir--cizgi">
          {sekmeler.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === aktif ? 'sh-sekme-btn sh-sekme-btn--aktif' : 'sh-sekme-btn'}
              style={i === aktif ? { borderColor: vurgu, color: vurgu } : undefined}
              onClick={() => setAktif(i)}
            >
              {s.baslik}
            </button>
          ))}
        </div>
        <div className="sh-grid" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: g.kolonSayisi ?? 3 } })}>
          {sekme?.kartlar.map((k) => (
            <HaberKartGovde key={k.id} kart={k} g={g} kartStili="duz" gorselKonumu="ust" />
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'chip-ust-filtre') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📰'} g={g} />
        <div className="sh-chip-satir">
          {filtreler.map((f, i) => (
            <button
              key={f}
              type="button"
              className={i === aktif ? 'sh-chip sh-chip--aktif' : 'sh-chip'}
              style={i === aktif ? { backgroundColor: vurgu } : undefined}
              onClick={() => setAktif(i)}
            >
              {f}
            </button>
          ))}
        </div>
        <HeroListeIcerik />
      </WidgetKabuk>
    );
  }

  if (gt === 'accordion-sekme') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.baslik && <h2 className="sh-bolum-baslik" style={{ color: g.baslikRengi || '#0f172a' }}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="sh-accordion-aciklama">{widget.aciklama}</p>}
        <div className="sh-accordion">
          {sekmeler.map((s, i) => {
            const acik = acikAccordion === i;
            return (
              <div key={s.id} className="sh-accordion-oge">
                <button
                  type="button"
                  className="sh-accordion-baslik"
                  style={acik ? { color: vurgu } : undefined}
                  onClick={() => setAcikAccordion(acik ? null : i)}
                >
                  <span>{s.baslik}</span>
                  <span className="sh-accordion-ok">{acik ? '−' : '+'}</span>
                </button>
                {acik && (
                  <div className="sh-accordion-icerik">
                    {s.kartlar.map((k) => (
                      <HaberKartGovde key={k.id} kart={k} g={g} gorselKonumu="sol" kartStili="yatay" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'pill-sekmeli') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik
          baslik={widget.baslik}
          ikon={g.baslikIkon ?? '📰'}
          tumunuMetin={cfg.tumunuGorMetin}
          tumunuLink={cfg.tumunuGorLink}
          g={g}
        />
        <div className="sh-pill-satir">
          {sekmeler.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === aktif ? 'sh-pill sh-pill--aktif' : 'sh-pill'}
              style={i === aktif ? { backgroundColor: vurgu } : undefined}
              onClick={() => setAktif(i)}
            >
              {s.baslik}
            </button>
          ))}
        </div>
        <HeroListeIcerik />
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '📰'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      <div className="sh-sekme-satir sh-sekme-satir--cizgi">
        {sekmeler.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === aktif ? 'sh-sekme-btn sh-sekme-btn--aktif' : 'sh-sekme-btn'}
            style={i === aktif ? { borderColor: vurgu, color: vurgu } : undefined}
            onClick={() => setAktif(i)}
          >
            {s.baslik}
          </button>
        ))}
      </div>
      <HeroListeIcerik />
    </WidgetKabuk>
  );
}

export function HavaDurumuWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const sehir = cfg.havaSehir ?? 'İstanbul';
  const ilce = cfg.havaIlce ?? '';
  const apiMod = cfg.havaKaynak !== 'manuel';
  const gt = widgetGorunumTipiAl(widget);
  const [apiVeri, setApiVeri] = useState<HavaDurumuYanit | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const vurgu = haberVurguRengi(g, '#0ea5e9');
  const baslikRenk = g.baslikRengi || '#0f172a';
  const metinRenk = g.metinRengi || '#64748b';
  const arkaPlan = widget.arkaPlanRenk || '#0f172a';
  const radius = g.borderRadius ?? 16;

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

  const KonumEtiket = () => (
    <div className="hd-konum">
      <span className="hd-konum-badge">{gosterSehir}</span>
      {gosterIlce && <span className="hd-konum-badge hd-konum-badge--ilce">{gosterIlce}</span>}
    </div>
  );

  const HataMesaj = () =>
    hata && !yukleniyor ? <p className="hd-hata">{hata}</p> : null;

  const TahminGrid = ({ sinif = '' }: { sinif?: string }) => (
    <div className={`hd-tahmin-grid ${sinif}`}>
      {gunler.map((gun) => (
        <div key={gun.id} className="hd-tahmin-kutu" style={{ borderRadius: radius }}>
          <p className="hd-tahmin-gun">{gun.gun}</p>
          <p className="hd-tahmin-ikon">{gun.ikon ?? '☀️'}</p>
          <p className="hd-tahmin-durum">{gun.durum}</p>
          <p className="hd-tahmin-sicaklik">
            {gun.max} / {gun.min}
          </p>
        </div>
      ))}
    </div>
  );

  const DetayIstatistik = () => (
    <div className="hd-istatistik">
      <div className="hd-istatistik-kutu" style={{ borderRadius: radius }}>
        <p className="hd-istatistik-etiket">Hissedilen</p>
        <p className="hd-istatistik-deger">{anlik.hissedilen}</p>
      </div>
      <div className="hd-istatistik-kutu" style={{ borderRadius: radius }}>
        <p className="hd-istatistik-etiket">Nem</p>
        <p className="hd-istatistik-deger">{anlik.nem}</p>
      </div>
      <div className="hd-istatistik-kutu" style={{ borderRadius: radius }}>
        <p className="hd-istatistik-etiket">Rüzgar</p>
        <p className="hd-istatistik-deger">{anlik.ruzgar}</p>
      </div>
    </div>
  );

  if (gt === 'kompakt-serit') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="hd-serit" style={{ borderRadius: radius, borderColor: `${vurgu}33` }}>
          <div className="hd-serit-sol">
            {widget.altBaslik && (
              <p className="hd-serit-etiket" style={{ color: vurgu }}>
                {widget.altBaslik}
              </p>
            )}
            {widget.baslik && (
              <p className="hd-serit-baslik" style={{ color: baslikRenk }}>
                {widget.baslik}
              </p>
            )}
            <KonumEtiket />
          </div>
          <div className="hd-serit-orta">
            <p className="hd-serit-sicaklik" style={{ color: vurgu }}>
              {anlik.sicaklik}
            </p>
            <p className="hd-serit-durum" style={{ color: metinRenk }}>
              {anlik.durum}
            </p>
          </div>
          <span className="hd-serit-ikon">⛅</span>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'tam-genis-banner') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="hd-banner" style={{ background: `linear-gradient(135deg, ${arkaPlan}, ${vurgu}88)` }}>
          <div className="hd-banner-icerik">
            {widget.altBaslik && <p className="hd-banner-etiket">{widget.altBaslik}</p>}
            {widget.baslik && <h2 className="hd-banner-baslik">{widget.baslik}</h2>}
            {widget.aciklama && <p className="hd-banner-aciklama">{widget.aciklama}</p>}
            <KonumEtiket />
            <HataMesaj />
            <div className="hd-banner-ana">
              <div>
                <p className="hd-banner-sicaklik">{anlik.sicaklik}</p>
                <p className="hd-banner-durum">{anlik.durum}</p>
              </div>
              <span className="hd-banner-ikon">🌤️</span>
            </div>
            <TahminGrid sinif="hd-tahmin-grid--banner" />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'split-buyuk-tahmin') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="hd-split" style={{ borderRadius: radius }}>
          {widget.baslik && (
            <h2 className="hd-split-baslik" style={{ color: baslikRenk }}>
              {widget.baslik}
            </h2>
          )}
          <div className="hd-split-grid">
            <div className="hd-split-sol" style={{ backgroundColor: `${vurgu}15` }}>
              <KonumEtiket />
              <HataMesaj />
              <p className="hd-split-sicaklik" style={{ color: vurgu }}>
                {anlik.sicaklik}
              </p>
              <p className="hd-split-durum" style={{ color: metinRenk }}>
                {anlik.durum}
              </p>
              <span className="hd-split-ikon">☀️</span>
              <DetayIstatistik />
            </div>
            <div className="hd-split-sag">
              <p className="hd-split-tahmin-baslik" style={{ color: baslikRenk }}>
                5 Günlük Tahmin
              </p>
              <div className="hd-split-liste">
                {gunler.map((gun) => (
                  <div key={gun.id} className="hd-split-satir">
                    <span className="hd-split-gun">{gun.gun}</span>
                    <span>{gun.ikon ?? '☀️'}</span>
                    <span className="hd-split-durum-kisa">{gun.durum}</span>
                    <span className="hd-split-max-min" style={{ color: vurgu }}>
                      {gun.max} / {gun.min}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cam-hava-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="hd-cam-wrap">
          <div className="hd-cam-arkaplan" style={{ background: `linear-gradient(160deg, ${vurgu}44, ${arkaPlan}99)` }} />
          <div className="hd-cam-kart" style={{ borderRadius: radius }}>
            {widget.baslik && (
              <h2 className="hd-cam-baslik" style={{ color: baslikRenk }}>
                {widget.baslik}
              </h2>
            )}
            {widget.aciklama && (
              <p className="hd-cam-aciklama" style={{ color: metinRenk }}>
                {widget.aciklama}
              </p>
            )}
            <KonumEtiket />
            <HataMesaj />
            <div className="hd-cam-ana">
              <p className="hd-cam-sicaklik" style={{ color: vurgu }}>
                {anlik.sicaklik}
              </p>
              <p className="hd-cam-durum">{anlik.durum}</p>
            </div>
            <DetayIstatistik />
            <TahminGrid sinif="hd-tahmin-grid--cam" />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'ikon-tahmin-grid') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="hd-ikon-grid-wrap" style={{ borderRadius: radius }}>
          {widget.altBaslik && (
            <p className="hd-ikon-etiket" style={{ color: vurgu }}>
              {widget.altBaslik}
            </p>
          )}
          {widget.baslik && (
            <h2 className="hd-ikon-baslik" style={{ color: baslikRenk }}>
              {widget.baslik}
            </h2>
          )}
          <KonumEtiket />
          <HataMesaj />
          <div className="hd-ikon-ust">
            <span className="hd-ikon-buyuk">⛅</span>
            <div>
              <p className="hd-ikon-sicaklik" style={{ color: vurgu }}>
                {anlik.sicaklik}
              </p>
              <p className="hd-ikon-durum" style={{ color: metinRenk }}>
                {anlik.durum}
              </p>
            </div>
          </div>
          <div className="hd-ikon-tahmin">
            {gunler.map((gun) => (
              <div key={gun.id} className="hd-ikon-kutu" style={{ borderRadius: radius, borderColor: `${vurgu}33` }}>
                <p className="hd-ikon-kutu-gun">{gun.gun}</p>
                <p className="hd-ikon-kutu-ikon">{gun.ikon ?? '☀️'}</p>
                <p className="hd-ikon-kutu-sicaklik" style={{ color: vurgu }}>
                  {gun.max}
                </p>
                <p className="hd-ikon-kutu-min">{gun.min}</p>
              </div>
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="hd-detayli" style={{ borderRadius: radius, backgroundColor: arkaPlan }}>
        {widget.baslik && <h2 className="hd-detayli-baslik">{widget.baslik}</h2>}
        <KonumEtiket />
        <HataMesaj />
        <div className="hd-detayli-ana">
          <div>
            <p className="hd-detayli-sicaklik">{anlik.sicaklik}</p>
            <p className="hd-detayli-durum">{anlik.durum}</p>
          </div>
          <span className="hd-detayli-ikon">⛅</span>
        </div>
        <DetayIstatistik />
        <TahminGrid sinif="hd-tahmin-grid--detayli" />
      </div>
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

  const vurgu = haberVurguRengi(g);
  const baslikRenk = g.baslikRengi || '#0f172a';
  const metinRenk = g.metinRengi || '#64748b';
  const radius = g.borderRadius ?? 12;

  useEffect(() => {
    if (!apiMod) return;
    let iptal = false;
    const yukle = () => {
      setYukleniyor(true);
      void kriptoListesiGetir(limit, semboller.length ? semboller : undefined)
        .then((veri) => { if (!iptal) setApiListe(veri); })
        .finally(() => { if (!iptal) setYukleniyor(false); });
    };
    yukle();
    const timer = window.setInterval(yukle, 5 * 60 * 1000);
    return () => { iptal = true; window.clearInterval(timer); };
  }, [apiMod, limit, semboller.join(',')]);

  const liste = apiMod
    ? apiListe.map((k) => ({ id: k.id, sembol: k.sembol, ad: k.ad, fiyat: k.fiyat, degisim: k.degisim, ikonUrl: k.ikonUrl }))
    : (cfg.kriptoParalar ?? []);

  const negMi = (d: string) => d.trim().startsWith('-');
  const DegisimBadge = ({ degisim }: { degisim: string }) => (
    <span className={`kr-degisim ${negMi(degisim) ? 'kr-degisim--neg' : 'kr-degisim--pos'}`} style={{ borderRadius: radius }}>
      {degisim}
    </span>
  );

  const TumunuLink = () =>
    cfg.tumunuGorLink ? (
      <a href={cfg.tumunuGorLink} className="kr-tumunu" style={{ backgroundColor: vurgu, borderRadius: radius }}>
        {cfg.tumunuGorMetin ?? 'Tümünü Göster →'}
      </a>
    ) : null;

  if (yukleniyor && liste.length === 0) {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} g={g} />
        <p className="kr-yukleniyor">Kripto verileri yükleniyor...</p>
      </WidgetKabuk>
    );
  }

  if (gt === 'kart-grid') {
    return (
      <WidgetKabuk widget={widget}>
        {widget.altBaslik && <p className="kr-alt-baslik" style={{ color: vurgu }}>{widget.altBaslik}</p>}
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} g={g} />
        <div className="kr-kart-grid">
          {liste.map((k) => (
            <div key={k.id} className="kr-kart" style={{ borderRadius: radius, borderColor: `${vurgu}33` }}>
              <div className="kr-kart-ust">
                <span className="kr-kart-sembol" style={{ color: baslikRenk }}>{k.sembol}</span>
                <DegisimBadge degisim={k.degisim} />
              </div>
              <p className="kr-kart-ad" style={{ color: metinRenk }}>{k.ad}</p>
              <p className="kr-kart-fiyat" style={{ color: vurgu }}>{k.fiyat}</p>
            </div>
          ))}
        </div>
        <TumunuLink />
      </WidgetKabuk>
    );
  }

  if (gt === 'ticker-kaydir') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} g={g} />
        <div className="kr-ticker">
          {liste.map((k) => (
            <div key={k.id} className="kr-ticker-oge" style={{ borderRadius: radius }}>
              <p className="kr-ticker-sembol" style={{ color: vurgu }}>{k.sembol}</p>
              <p className="kr-ticker-fiyat" style={{ color: baslikRenk }}>{k.fiyat}</p>
              <DegisimBadge degisim={k.degisim} />
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'lider-podyum') {
    const podyum = liste.slice(0, 3);
    const geriKalan = liste.slice(3);
    const podyumSinif = ['kr-podyum-2', 'kr-podyum-1', 'kr-podyum-3'];
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} g={g} />
        <div className="kr-podyum">
          {[podyum[1], podyum[0], podyum[2]].filter(Boolean).map((k, i) => (
            <div key={k!.id} className={`kr-podyum-kart ${podyumSinif[i]}`} style={{ borderRadius: radius, borderColor: vurgu }}>
              <span className="kr-podyum-sira" style={{ backgroundColor: vurgu }}>{i === 0 ? 2 : i === 1 ? 1 : 3}</span>
              <p className="kr-podyum-sembol">{k!.sembol}</p>
              <p className="kr-podyum-fiyat">{k!.fiyat}</p>
              <DegisimBadge degisim={k!.degisim} />
            </div>
          ))}
        </div>
        {geriKalan.length > 0 && (
          <div className="kr-podyum-liste">
            {geriKalan.map((k, i) => (
              <div key={k.id} className="kr-podyum-satir">
                <span className="kr-podyum-no" style={{ color: vurgu }}>{i + 4}</span>
                <span className="kr-podyum-ad">{k.sembol}</span>
                <span className="kr-podyum-fiyat-kucuk">{k.fiyat}</span>
                <DegisimBadge degisim={k.degisim} />
              </div>
            ))}
          </div>
        )}
        <TumunuLink />
      </WidgetKabuk>
    );
  }

  if (gt === 'kompakt-satir') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <div className="kr-kompakt">
          {liste.map((k) => (
            <div key={k.id} className="kr-kompakt-satir">
              <span className="kr-kompakt-sembol" style={{ color: vurgu }}>{k.sembol}</span>
              <span className="kr-kompakt-ad" style={{ color: metinRenk }}>{k.ad}</span>
              <span className="kr-kompakt-fiyat" style={{ color: baslikRenk }}>{k.fiyat}</span>
              <DegisimBadge degisim={k.degisim} />
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'split-ozet-panel') {
    const pozitif = liste.filter((k) => !negMi(k.degisim)).length;
    const negatif = liste.length - pozitif;
    return (
      <WidgetKabuk widget={widget}>
        <div className="kr-split">
          <aside className="kr-split-sol" style={{ borderRadius: radius, backgroundColor: `${vurgu}12` }}>
            {widget.altBaslik && <p className="kr-alt-baslik" style={{ color: vurgu }}>{widget.altBaslik}</p>}
            {widget.baslik && <h2 className="kr-split-baslik" style={{ color: baslikRenk }}>{widget.baslik}</h2>}
            {widget.aciklama && <p className="kr-split-aciklama" style={{ color: metinRenk }}>{widget.aciklama}</p>}
            <div className="kr-split-istat">
              <div><p className="kr-split-etiket">Toplam</p><p className="kr-split-deger" style={{ color: vurgu }}>{liste.length}</p></div>
              <div><p className="kr-split-etiket">Artış</p><p className="kr-split-deger kr-degisim--pos">{pozitif}</p></div>
              <div><p className="kr-split-etiket">Düşüş</p><p className="kr-split-deger kr-degisim--neg">{negatif}</p></div>
            </div>
            <TumunuLink />
          </aside>
          <div className="kr-split-sag">
            {liste.map((k) => (
              <div key={k.id} className="kr-split-satir">
                <span className="kr-split-sembol" style={{ color: vurgu }}>{k.sembol}</span>
                <span className="kr-split-fiyat">{k.fiyat}</span>
                <DegisimBadge degisim={k.degisim} />
              </div>
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
      <div className="kr-tablo" style={{ borderRadius: radius }}>
        <div className="kr-tablo-baslik" style={{ backgroundColor: `${vurgu}15` }}>
          <span>Coin</span><span>Fiyat</span><span>24s</span>
        </div>
        {liste.map((k) => (
          <div key={k.id} className="kr-tablo-satir">
            <div className="kr-tablo-coin">
              <span className="kr-tablo-sembol" style={{ color: vurgu }}>{k.sembol}</span>
              <span className="kr-tablo-ad" style={{ color: metinRenk }}>{k.ad}</span>
            </div>
            <span className="kr-tablo-fiyat" style={{ color: baslikRenk }}>{k.fiyat}</span>
            <DegisimBadge degisim={k.degisim} />
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}

export function GuncelKonularWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const vurgu = haberVurguRengi(g);
  const baslikRenk = g.baslikRengi || '#0f172a';
  const metinRenk = g.metinRengi || '#64748b';
  const filtreler = cfg.filtreler ?? [];
  const [aktifFiltre, setAktifFiltre] = useState(0);

  const Numara = ({ n, buyuk = false }: { n: number; buyuk?: boolean }) => (
    <span className={buyuk ? 'gk-numara gk-numara--buyuk' : 'gk-numara'} style={{ backgroundColor: vurgu }}>
      {n}
    </span>
  );

  if (gt === 'hero-alt-liste' && kartlar[0]) {
    const hero = kartlar[0];
    const liste = kartlar.slice(1);
    return (
      <WidgetKabuk widget={widget}>
        {widget.altBaslik && <p className="gk-etiket" style={{ color: vurgu }}>{widget.altBaslik}</p>}
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <a href={hero.link || '#'} className="gk-hero">
          {hero.gorselUrl && <img src={medyaUrl(hero.gorselUrl)} alt="" className="gk-hero-img" />}
          <div className="gk-hero-govde">
            <p className="gk-hero-baslik" style={{ color: baslikRenk }}>{hero.baslik}</p>
            {hero.ozet && <p className="gk-hero-ozet" style={{ color: metinRenk }}>{hero.ozet}</p>}
          </div>
        </a>
        <ol className="gk-liste">
          {liste.map((k, i) => (
            <li key={k.id}>
              <a href={k.link || '#'} className="gk-liste-satir">
                <Numara n={i + 2} />
                <span className="gk-liste-metin" style={{ color: baslikRenk }}>{k.baslik}</span>
              </a>
            </li>
          ))}
        </ol>
      </WidgetKabuk>
    );
  }

  if (gt === 'yan-gorsel-liste') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <ol className="gk-gorsel-liste">
          {kartlar.map((k, i) => (
            <li key={k.id}>
              <a href={k.link || '#'} className="gk-gorsel-satir">
                {k.gorselUrl ? (
                  <img src={medyaUrl(k.gorselUrl)} alt="" className="gk-gorsel-thumb" />
                ) : (
                  <Numara n={i + 1} />
                )}
                <div>
                  <p className="gk-gorsel-baslik" style={{ color: baslikRenk }}>{k.baslik}</p>
                  {k.tarih && <p className="gk-gorsel-tarih" style={{ color: metinRenk }}>{k.tarih}</p>}
                </div>
              </a>
            </li>
          ))}
        </ol>
      </WidgetKabuk>
    );
  }

  if (gt === 'chip-konu-filtre') {
    const chips = filtreler.length ? filtreler : kartlar.map((k) => k.badge || k.baslik.slice(0, 12)).slice(0, 6);
    const gosterilen = filtreler.length
      ? kartlar.filter((k) => !k.badge || k.badge === chips[aktifFiltre])
      : kartlar;
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} g={g} />
        <div className="gk-chip-satir">
          {chips.map((c, i) => (
            <button
              key={c}
              type="button"
              className={i === aktifFiltre ? 'gk-chip gk-chip--aktif' : 'gk-chip'}
              style={i === aktifFiltre ? { backgroundColor: vurgu } : undefined}
              onClick={() => setAktifFiltre(i)}
            >
              {c}
            </button>
          ))}
        </div>
        <ol className="gk-liste">
          {gosterilen.map((k, i) => (
            <li key={k.id}>
              <a href={k.link || '#'} className="gk-liste-satir">
                <Numara n={i + 1} />
                <span className="gk-liste-metin" style={{ color: baslikRenk }}>{k.baslik}</span>
              </a>
            </li>
          ))}
        </ol>
      </WidgetKabuk>
    );
  }

  if (gt === 'timeline-konu') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} g={g} />
        {widget.aciklama && <p className="gk-timeline-aciklama" style={{ color: metinRenk }}>{widget.aciklama}</p>}
        <div className="gk-timeline">
          {kartlar.map((k) => (
            <a key={k.id} href={k.link || '#'} className="gk-timeline-oge">
              <div className="gk-timeline-tarih" style={{ color: vurgu, borderColor: vurgu }}>{k.tarih || '—'}</div>
              <div className="gk-timeline-cizgi" style={{ backgroundColor: vurgu }} />
              <p className="gk-timeline-baslik" style={{ color: baslikRenk }}>{k.baslik}</p>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'snap-yatay-kart') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <div className="gk-snap">
          {kartlar.map((k, i) => (
            <a key={k.id} href={k.link || '#'} className="gk-snap-kart">
              {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt="" className="gk-snap-img" />}
              <div className="gk-snap-govde">
                <Numara n={i + 1} />
                <p className="gk-snap-baslik" style={{ color: baslikRenk }}>{k.baslik}</p>
              </div>
            </a>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      {widget.altBaslik && <p className="gk-etiket" style={{ color: vurgu }}>{widget.altBaslik}</p>}
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} g={g} />
      <ol className="gk-buyuk-liste">
        {kartlar.map((k, i) => (
          <li key={k.id}>
            <a href={k.link || '#'} className="gk-buyuk-satir">
              <Numara n={i + 1} buyuk />
              <div>
                <p className="gk-buyuk-baslik" style={{ color: baslikRenk }}>{k.baslik}</p>
                {k.ozet && <p className="gk-buyuk-ozet" style={{ color: metinRenk }}>{k.ozet}</p>}
              </div>
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
  const vurgu = haberVurguRengi(g, '#2563eb');
  const baslikRenk = g.baslikRengi || '#0f172a';
  const metinRenk = g.metinRengi || '#64748b';
  const arkaPlan = widget.arkaPlanRenk || '#0f172a';
  const radius = g.borderRadius ?? 14;

  if (!v) return null;

  const gunler = [
    { ad: 'Hafta İçi', acilis: v.haftaIciAcilis, kapanis: v.haftaIciKapanis },
    { ad: 'Cumartesi', acilis: v.cumartesiAcilis, kapanis: v.cumartesiKapanis },
    { ad: 'Pazar', acilis: v.pazarAcilis, kapanis: v.pazarKapanis },
  ];

  const KonumBaslik = ({ koyu = false }: { koyu?: boolean }) => (
    <>
      {widget.altBaslik && (
        <p className="sg-etiket" style={{ color: koyu ? 'rgba(255,255,255,.8)' : vurgu }}>{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className="sg-baslik" style={{ color: koyu ? '#fff' : baslikRenk }}>{widget.baslik}</h2>
      )}
      {widget.aciklama && (
        <p className="sg-aciklama" style={{ color: koyu ? 'rgba(255,255,255,.75)' : metinRenk }}>{widget.aciklama}</p>
      )}
      <p className="sg-konum" style={{ color: koyu ? '#fff' : baslikRenk }}>🏢 {cfg.sirketKonum ?? 'Merkez Ofis'}</p>
    </>
  );

  const AnlikBilgi = ({ koyu = false }: { koyu?: boolean }) => (
    <div className="sg-anlik-grid">
      {cfg.sirketAnlikSaat && (
        <div>
          <p className="sg-anlik-etiket" style={{ color: koyu ? 'rgba(255,255,255,.65)' : metinRenk }}>Anlık saat</p>
          <p className="sg-anlik-deger" style={{ color: koyu ? '#fff' : vurgu }}>🕐 {cfg.sirketAnlikSaat}</p>
        </div>
      )}
      {cfg.kapanisaKalan && (
        <div>
          <p className="sg-anlik-etiket" style={{ color: koyu ? 'rgba(255,255,255,.65)' : metinRenk }}>Kapanışa kalan</p>
          <p className="sg-anlik-deger" style={{ color: koyu ? '#fff' : vurgu }}>{cfg.kapanisaKalan}</p>
        </div>
      )}
    </div>
  );

  const GunKart = ({ gun, kompakt = false }: { gun: (typeof gunler)[number]; kompakt?: boolean }) => (
    <div className={kompakt ? 'sg-gun-kart sg-gun-kart--kompakt' : 'sg-gun-kart'} style={{ borderRadius: radius }}>
      <p className="sg-gun-ad" style={{ color: vurgu }}>{gun.ad}</p>
      <div className="sg-gun-saatler">
        <div className="sg-saat-kutu" style={{ borderRadius: radius }}>
          <p className="sg-saat-etiket">Açılış</p>
          <p className="sg-saat-deger">{gun.acilis || '—'}</p>
        </div>
        <div className="sg-saat-kutu" style={{ borderRadius: radius }}>
          <p className="sg-saat-etiket">Kapanış</p>
          <p className="sg-saat-deger">{gun.kapanis || '—'}</p>
        </div>
      </div>
    </div>
  );

  if (gt === 'canli-genis-band') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="sg-band" style={{ background: `linear-gradient(135deg, ${arkaPlan}, ${vurgu})` }}>
          <div className="sg-band-icerik">
            <KonumBaslik koyu />
            <AnlikBilgi koyu />
            <div className="sg-band-gunler">
              {gunler.map((gun) => (
                <div key={gun.ad} className="sg-band-gun">
                  <p className="sg-band-gun-ad">{gun.ad}</p>
                  <p className="sg-band-gun-saat">{gun.acilis} – {gun.kapanis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'kart-grid-gun') {
    return (
      <WidgetKabuk widget={widget}>
        <KonumBaslik />
        <AnlikBilgi />
        <div className="sg-gun-grid">
          {gunler.map((gun) => (
            <GunKart key={gun.ad} gun={gun} />
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'dikey-timeline-saat') {
    return (
      <WidgetKabuk widget={widget}>
        <KonumBaslik />
        {widget.aciklama && <p className="sg-aciklama" style={{ color: metinRenk }}>{widget.aciklama}</p>}
        <AnlikBilgi />
        <div className="sg-timeline">
          {gunler.map((gun) => (
            <div key={gun.ad} className="sg-timeline-oge">
              <div className="sg-timeline-nokta" style={{ backgroundColor: vurgu, borderColor: vurgu }} />
              <div className="sg-timeline-icerik">
                <p className="sg-timeline-gun" style={{ color: vurgu }}>{gun.ad}</p>
                <div className="sg-timeline-saatler">
                  <span>Açılış <strong>{gun.acilis || '—'}</strong></span>
                  <span>Kapanış <strong>{gun.kapanis || '—'}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'durum-rozet-panel') {
    const acikMi = Boolean(cfg.sirketAnlikSaat);
    return (
      <WidgetKabuk widget={widget}>
        <div className="sg-rozet-panel" style={{ borderRadius: radius, borderColor: `${vurgu}33` }}>
          <div className="sg-rozet-ust">
            <KonumBaslik />
            <span className={`sg-rozet ${acikMi ? 'sg-rozet--acik' : 'sg-rozet--kapali'}`} style={acikMi ? { backgroundColor: vurgu } : undefined}>
              {acikMi ? '● Açık' : '○ Kapalı'}
            </span>
          </div>
          <AnlikBilgi />
          <div className="sg-rozet-gunler">
            {gunler.map((gun) => (
              <div key={gun.ad} className="sg-rozet-satir">
                <span className="sg-rozet-gun-ad">{gun.ad}</span>
                <span className="sg-rozet-saat">{gun.acilis} – {gun.kapanis}</span>
              </div>
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'cam-saat-panel') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="sg-cam-wrap">
          <div className="sg-cam-arkaplan" style={{ background: `linear-gradient(160deg, ${vurgu}55, ${arkaPlan}cc)` }} />
          <div className="sg-cam-panel" style={{ borderRadius: radius }}>
            <KonumBaslik koyu />
            {widget.aciklama && <p className="sg-aciklama" style={{ color: 'rgba(255,255,255,.75)' }}>{widget.aciklama}</p>}
            <AnlikBilgi koyu />
            <div className="sg-cam-gunler">
              {gunler.map((gun) => (
                <GunKart key={gun.ad} gun={gun} kompakt />
              ))}
            </div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="sg-tablo" style={{ borderRadius: radius, borderColor: `${vurgu}33` }}>
        <div className="sg-tablo-baslik" style={{ backgroundColor: `${vurgu}12` }}>
          <KonumBaslik />
          <AnlikBilgi />
        </div>
        <table className="sg-tablo-tablo">
          <thead>
            <tr>
              <th>Gün</th><th>Açılış</th><th>Kapanış</th>
            </tr>
          </thead>
          <tbody>
            {gunler.map((gun) => (
              <tr key={gun.ad}>
                <td style={{ color: vurgu, fontWeight: 700 }}>{gun.ad}</td>
                <td>{gun.acilis || '—'}</td>
                <td>{gun.kapanis || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetKabuk>
  );
}

export function HaberMagazinWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const vurgu = haberVurguRengi(g);
  const heroMetin = (cfg.gorunum?.tipEk?.heroBannerMetin as string) || widget.aciklama;

  if (gt === 'hero-kucuk-grid') {
    const hero = kartlar[0];
    const kucuk = kartlar.slice(1);
    return (
      <WidgetKabuk widget={widget}>
        {widget.altBaslik && <p className="hm-etiket" style={{ color: vurgu }}>{widget.altBaslik}</p>}
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <div className="hm-hero-grid">
          {hero && (
            <div className="hm-hero-ana">
              <HaberKartGovde kart={hero} g={g} kartStili="overlay" gorselKonumu="ust" />
              {heroMetin && <p className="hm-hero-metin">{heroMetin}</p>}
            </div>
          )}
          <div className="hm-hero-kucuk" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: 2 } })}>
            {kucuk.map((k) => (
              <HaberKartGovde key={k.id} kart={k} g={g} kartStili="duz" gorselKonumu="ust" />
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'overlay-editorial') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <div className="hm-overlay-grid">
          {kartlar.map((k, i) => (
            <div key={k.id} className={i === 0 ? 'hm-overlay-hero' : 'hm-overlay-kart'}>
              <HaberKartGovde kart={k} g={g} kartStili="overlay" />
            </div>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'iki-sutun-akis') {
    const sol = kartlar.filter((_, i) => i % 2 === 0);
    const sag = kartlar.filter((_, i) => i % 2 === 1);
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        {widget.aciklama && <p className="hm-akis-aciklama">{widget.aciklama}</p>}
        <div className="hm-iki-sutun">
          <div className="hm-sutun">
            {sol.map((k) => (
              <HaberKartGovde key={k.id} kart={k} g={g} kartStili="yatay" gorselKonumu="sol" />
            ))}
          </div>
          <div className="hm-sutun">
            {sag.map((k) => (
              <HaberKartGovde key={k.id} kart={k} g={g} kartStili="yatay" gorselKonumu="sol" />
            ))}
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'snap-yatay-serit') {
    return (
      <WidgetKabuk widget={widget}>
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        <div className="hm-snap">
          {kartlar.map((k) => (
            <article key={k.id} className="hm-snap-kart">
              <HaberKartGovde kart={k} g={g} kartStili="duz" gorselKonumu="ust" />
            </article>
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'spotlight-liste') {
    const hero = kartlar[0];
    const liste = kartlar.slice(1);
    return (
      <WidgetKabuk widget={widget}>
        {widget.altBaslik && <p className="hm-etiket" style={{ color: vurgu }}>{widget.altBaslik}</p>}
        <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
        {hero && (
          <div className="hm-spotlight">
            <HaberKartGovde kart={hero} g={g} kartStili="overlay" gorselKonumu="ust" />
          </div>
        )}
        <div className="hm-spotlight-liste">
          {liste.map((k) => (
            <HaberKartGovde key={k.id} kart={k} g={g} kartStili="yatay" gorselKonumu="sol" />
          ))}
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
      <div className="hm-asimetrik">
        {kartlar.map((k, i) => (
          <div key={k.id} className={i === 0 ? 'hm-asimetrik-hero' : i === 1 ? 'hm-asimetrik-buyuk' : 'hm-asimetrik-kart'}>
            <HaberKartGovde
              kart={k}
              g={g}
              kartStili={i === 0 ? 'overlay' : 'duz'}
              gorselKonumu={i <= 1 ? 'ust' : 'sol'}
            />
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
