import { useEffect, useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
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

export function KoseYazarlariWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const yazarlar = cfg.koseYazarlari ?? [];
  const konum = g.gorselKonumu ?? 'sol';
  const [sayfa, setSayfa] = useState(0);
  const kolon = g.kolonSayisi ?? 4;
  const sayfaAdet = Math.max(1, Math.ceil(yazarlar.length / kolon));
  const dilim = yazarlar.slice(sayfa * kolon, sayfa * kolon + kolon);

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik
        baslik={widget.baslik}
        ikon={g.baslikIkon ?? '✒️'}
        tumunuMetin={cfg.tumunuGorMetin}
        tumunuLink={cfg.tumunuGorLink}
        g={g}
      />
      <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
        {dilim.map((y) => (
          <article key={y.id} className="rounded-lg border border-slate-100 bg-white p-3">
            <div className={`flex gap-3 ${konum === 'sag' ? 'flex-row-reverse' : ''} ${konum === 'ust' ? 'flex-col' : ''}`}>
              {y.yazarGorsel && (
                <img src={medyaUrl(y.yazarGorsel)} alt="" className="h-16 w-14 shrink-0 rounded object-cover" />
              )}
              <div className="min-w-0">
                <p className="font-bold text-slate-900">{y.yazarAd}</p>
                {y.tarih && <p className="text-xs text-slate-500">{y.tarih}</p>}
              </div>
            </div>
            <h3 className="mt-2 font-bold text-slate-900">{y.baslik}</h3>
            {y.ozet && <p className="mt-1 line-clamp-3 text-sm text-slate-500">{y.ozet}</p>}
          </article>
        ))}
      </div>
      <WidgetSayfalama
        toplam={sayfaAdet}
        aktif={sayfa}
        stil={g.sayfalamaStili ?? 'ok'}
        vurguRenk={haberVurguRengi(g)}
        onSec={setSayfa}
        onOnceki={() => setSayfa((p) => Math.max(0, p - 1))}
        onSonraki={() => setSayfa((p) => Math.min(sayfaAdet - 1, p + 1))}
      />
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

  const kartSinif =
    gt === 'kompakt-kart'
      ? 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
      : gt === 'koyu-iletisim'
        ? 'flex gap-3 rounded-xl bg-slate-800 p-4 text-white'
        : gt === 'mor-kart'
          ? 'flex gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4'
          : gt === 'turuncu-baslik'
            ? 'flex gap-3 rounded-xl border-l-4 border-orange-500 bg-orange-50 p-4'
            : 'flex gap-3 rounded-xl bg-slate-50 p-4';

  const icerik = (
    <>
      {widget.altBaslik && <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">{widget.altBaslik}</p>}
      {widget.baslik && <h2 className="mb-2 text-2xl font-bold text-slate-900">{widget.baslik}</h2>}
      {widget.aciklama && <p className="mb-6 text-slate-600">{widget.aciklama}</p>}
      <div
        className={
          gt === 'bolunmus-panel'
            ? `grid gap-8 lg:grid-cols-2 ${mapSag ? '' : 'lg:[direction:rtl] lg:*:[direction:ltr]'}`
            : gt === 'kompakt-kart'
              ? 'space-y-4'
              : `grid gap-8 lg:grid-cols-2 ${mapSag ? '' : 'lg:[direction:rtl] lg:*:[direction:ltr]'}`
        }
      >
        <div className={gt === 'kompakt-kart' ? 'grid gap-3' : 'grid gap-3 sm:grid-cols-2'}>
          {kartlar.map((k) => (
            <div key={k.id} className={kartSinif}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg">
                {k.ikon || '📍'}
              </span>
              <div>
                <p className="text-xs text-slate-500">{k.etiket}</p>
                <p className="font-bold text-slate-900">{k.deger}</p>
              </div>
            </div>
          ))}
        </div>
        {harita && gt !== 'kompakt-kart' && (
          <iframe title="Harita" src={harita} className="min-h-[320px] w-full rounded-2xl shadow-lg" loading="lazy" />
        )}
      </div>
      {harita && gt === 'kompakt-kart' && (
        <iframe title="Harita" src={harita} className="mt-6 min-h-[280px] w-full rounded-2xl border border-slate-200 shadow-sm" loading="lazy" />
      )}
    </>
  );

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}

export function KategoriHaberListesiWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const kolon = g.kolonSayisi ?? 2;

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '🚗'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
      <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
        {kartlar.map((k) => (
          <HaberKartGovde key={k.id} kart={k} g={g} gorselKonumu={k.kartStili ? undefined : g.gorselKonumu} kartStili={k.kartStili} />
        ))}
      </div>
    </WidgetKabuk>
  );
}

export function KategoriHaberOverlayWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const kolon = g.kolonSayisi ?? 3;

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📶'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
      <div className="grid gap-3" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
        {kartlar.map((k) => (
          <HaberKartGovde key={k.id} kart={k} g={g} kartStili="overlay" />
        ))}
      </div>
    </WidgetKabuk>
  );
}

export function VideoGalerisiWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const videolar = cfg.videoKartlari ?? [];
  const [sayfa, setSayfa] = useState(0);
  const kolon = g.kolonSayisi ?? 4;
  const sayfaAdet = Math.max(1, Math.ceil(videolar.length / kolon));
  const dilim = videolar.slice(sayfa * kolon, sayfa * kolon + kolon);

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '▶️'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
      <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
        {dilim.map((v) => (
          <a key={v.id} href={v.link || v.videoLink || '#'} className="group block">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
              {v.gorselUrl && <img src={medyaUrl(v.gorselUrl)} alt="" className="h-full w-full object-cover opacity-80" />}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-2xl text-white">▶</span>
              </span>
            </div>
            <p className="mt-2 text-center text-sm font-bold text-slate-900">{v.baslik}</p>
          </a>
        ))}
      </div>
      <WidgetSayfalama toplam={sayfaAdet} aktif={sayfa} stil={g.sayfalamaStili ?? 'ok'} vurguRenk={haberVurguRengi(g)} onSec={setSayfa} onOnceki={() => setSayfa((p) => Math.max(0, p - 1))} onSonraki={() => setSayfa((p) => Math.min(sayfaAdet - 1, p + 1))} />
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
  const pillMod = gt === 'pill-sekme';

  return (
    <WidgetKabuk widget={widget}>
      <div className={`mb-4 flex flex-wrap gap-2 ${pillMod ? '' : 'border-b border-slate-200'}`}>
        {sekmeler.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setAktif(i)}
            className={
              pillMod
                ? `rounded-full px-4 py-2 text-sm font-semibold transition ${i === aktif ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`
                : `border-b-2 px-4 py-2 text-sm font-semibold transition ${i === aktif ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`
            }
          >
            {s.baslik}
          </button>
        ))}
      </div>
      {sekme && (
        <div className="grid gap-6 lg:grid-cols-2">
          {oneCikan && (
            <div>
              <HaberKartGovde kart={oneCikan} g={g} kartStili="duz" gorselKonumu="ust" />
              {oneCikan.ozet && <p className="mt-3 text-sm text-slate-600">{oneCikan.ozet}</p>}
            </div>
          )}
          <div className="space-y-3">
            {liste.map((k) => (
              <HaberKartGovde key={k.id} kart={k} g={g} gorselKonumu="sol" kartStili="yatay" />
            ))}
          </div>
        </div>
      )}
    </WidgetKabuk>
  );
}

export function HavaDurumuWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const sehir = cfg.havaSehir ?? 'İstanbul';
  const ilce = cfg.havaIlce ?? '';
  const apiMod = cfg.havaKaynak !== 'manuel';
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

  return (
    <WidgetKabuk widget={widget}>
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
        <div className="mb-4 flex gap-2">
          <span className="rounded-lg bg-white/10 px-3 py-1 text-sm">{gosterSehir}</span>
          {gosterIlce && <span className="rounded-lg bg-white/10 px-3 py-1 text-sm">{gosterIlce}</span>}
        </div>
        {hata && !yukleniyor && (
          <p className="mb-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm">{hata}</p>
        )}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold">{anlik.sicaklik}</p>
            <p className="text-sm text-white/70">{anlik.durum}</p>
          </div>
          <span className="text-6xl">⛅</span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-white/10 p-2"><p className="text-white/60">Hissedilen</p><p className="font-bold">{anlik.hissedilen}</p></div>
          <div className="rounded-lg bg-white/10 p-2"><p className="text-white/60">Nem</p><p className="font-bold">{anlik.nem}</p></div>
          <div className="rounded-lg bg-white/10 p-2"><p className="text-white/60">Rüzgar</p><p className="font-bold">{anlik.ruzgar}</p></div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {gunler.map((gun) => (
            <div key={gun.id} className="rounded-lg bg-white/10 p-2 text-center text-xs">
              <p className="font-semibold">{gun.gun}</p>
              <p className="my-1 text-lg">{gun.ikon ?? '☀️'}</p>
              <p className="text-white/70">{gun.durum}</p>
              <p className="mt-1 font-bold">{gun.max} / {gun.min}</p>
            </div>
          ))}
        </div>
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

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📈'} g={g} />
      {yukleniyor && liste.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-500">Kripto verileri yükleniyor...</p>
      )}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
        {liste.map((k, i) => {
          const neg = k.degisim.trim().startsWith('-');
          return (
            <div key={k.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
              <span className="w-10 text-center font-bold text-slate-700">{k.ikonUrl ? '🪙' : k.sembol.slice(0, 1)}</span>
              <span className="w-14 font-bold">{k.sembol}</span>
              <span className="flex-1 text-slate-700">{k.fiyat}</span>
              <span className={`rounded px-2 py-0.5 text-xs font-bold text-white ${neg ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {k.degisim}
              </span>
            </div>
          );
        })}
      </div>
      {cfg.tumunuGorLink && (
        <a href={cfg.tumunuGorLink} className="mt-3 block rounded-lg py-3 text-center text-sm font-bold text-white" style={{ backgroundColor: renk }}>
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
  const renk = haberVurguRengi(g);

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '☰'} g={g} />
      <ol className="space-y-0 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
        {kartlar.map((k, i) => (
          <li key={k.id}>
            <a href={k.link || '#'} className="flex gap-3 p-3 transition hover:bg-slate-50">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold text-white" style={{ backgroundColor: renk }}>
                {i + 1}
              </span>
              <span className="text-sm font-medium leading-snug text-slate-800">{k.baslik}</span>
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
  const renk = g.vurguRengi ?? '#2563eb';

  if (!v) return null;

  const gunler = [
    { ad: 'Hafta İçi', acilis: v.haftaIciAcilis, kapanis: v.haftaIciKapanis },
    { ad: 'Cumartesi', acilis: v.cumartesiAcilis, kapanis: v.cumartesiKapanis },
    { ad: 'Pazar', acilis: v.pazarAcilis, kapanis: v.pazarKapanis },
  ];

  return (
    <WidgetKabuk widget={widget}>
      <div className="overflow-hidden rounded-2xl text-white" style={{ backgroundColor: renk }}>
        <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
          <span className="font-bold">🏢 Şirket Açılış / Kapanış</span>
        </div>
        <div className="p-4">
          <p className="text-xl font-bold">{cfg.sirketKonum ?? 'Merkez Ofis'}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {cfg.sirketAnlikSaat && (
              <div>
                <p className="text-xs text-white/70">Anlık saat</p>
                <p className="text-lg font-bold">{cfg.sirketAnlikSaat}</p>
              </div>
            )}
            {cfg.kapanisaKalan && (
              <div>
                <p className="text-xs text-white/70">Kapanışa kalan</p>
                <p className="text-lg font-bold">{cfg.kapanisaKalan}</p>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {gunler.map((gun) => (
              <div key={gun.ad} className="rounded-lg bg-white/10 p-2">
                <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide text-white/80">{gun.ad}</p>
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
      </div>
    </WidgetKabuk>
  );
}

export function HaberMagazinWidget({ widget }: { widget: Widget }) {
  const cfg = cfgOku(widget);
  const g = gOku(cfg);
  const kartlar = cfg.haberKartlari ?? [];
  const kolon = g.kolonSayisi ?? 3;

  return (
    <WidgetKabuk widget={widget}>
      <HaberBolumBaslik baslik={widget.baslik} ikon={g.baslikIkon ?? '📊'} tumunuMetin={cfg.tumunuGorMetin} tumunuLink={cfg.tumunuGorLink} g={g} />
      <div className="grid gap-4" style={gridStyle({ ...cfg, gorunum: { ...g, kolonSayisi: kolon } })}>
        {kartlar.map((k) => (
          <HaberKartGovde
            key={k.id}
            kart={k}
            g={g}
            kartStili={k.kartStili ?? (k.badge ? 'overlay' : 'duz')}
            gorselKonumu={g.gorselKonumu}
          />
        ))}
      </div>
    </WidgetKabuk>
  );
}
