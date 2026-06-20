import { useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetEkipUyesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  return (
    <div className="mb-8 text-center">
      {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>}
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
    </div>
  );
}

function Navigasyon({
  baslangic,
  gorunen,
  toplam,
  sayfaSayisi,
  setBaslangic,
}: {
  baslangic: number;
  gorunen: number;
  toplam: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  if (sayfaSayisi <= 1) return null;
  return (
    <div className="mt-6 flex justify-center gap-3">
      <button
        type="button"
        className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
        onClick={() => setBaslangic((b) => Math.max(0, b - gorunen))}
        disabled={baslangic === 0}
      >
        ←
      </button>
      <button
        type="button"
        className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
        onClick={() => setBaslangic((b) => Math.min(toplam - gorunen, b + gorunen))}
        disabled={baslangic + gorunen >= toplam}
      >
        →
      </button>
    </div>
  );
}

function YuvarlakFoto({
  widget,
  cfg,
  uyeler,
  baslangic,
  gorunen,
  sayfaSayisi,
  setBaslangic,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
  baslangic: number;
  gorunen: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="text-center">
            {u.gorselUrl && (
              <img
                src={medyaUrl(u.gorselUrl)}
                alt={u.ad}
                className="mx-auto h-32 w-32 rounded-full object-cover shadow-md"
              />
            )}
            <h3 className="mt-4 text-lg font-bold text-slate-900">{u.ad}</h3>
            <p className="text-sm text-slate-500">{u.unvan}</p>
          </article>
        ))}
      </div>
      <Navigasyon baslangic={baslangic} gorunen={gorunen} toplam={uyeler.length} sayfaSayisi={sayfaSayisi} setBaslangic={setBaslangic} />
    </>
  );
}

function KareKart({
  widget,
  cfg,
  uyeler,
  baslangic,
  gorunen,
  sayfaSayisi,
  setBaslangic,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
  baslangic: number;
  gorunen: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/30 shadow-sm">
            {u.gorselUrl && (
              <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className={`aspect-square w-full ${gorselSinifi(cfg)}`} />
            )}
            <div className="p-4 text-center">
              <h3 className="font-bold text-slate-900">{u.ad}</h3>
              <p className="text-sm text-violet-700">{u.unvan}</p>
            </div>
          </article>
        ))}
      </div>
      <Navigasyon baslangic={baslangic} gorunen={gorunen} toplam={uyeler.length} sayfaSayisi={sayfaSayisi} setBaslangic={setBaslangic} />
    </>
  );
}

function SadeIsim({
  widget,
  cfg,
  uyeler,
  baslangic,
  gorunen,
  sayfaSayisi,
  setBaslangic,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
  baslangic: number;
  gorunen: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="flex flex-wrap justify-center gap-6">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="w-28 text-center">
            {u.gorselUrl && (
              <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className="mx-auto h-20 w-20 rounded-full object-cover" />
            )}
            <h3 className="mt-2 text-sm font-semibold text-slate-900">{u.ad}</h3>
          </article>
        ))}
      </div>
      <Navigasyon baslangic={baslangic} gorunen={gorunen} toplam={uyeler.length} sayfaSayisi={sayfaSayisi} setBaslangic={setBaslangic} />
    </>
  );
}

function KoyuProfil({
  widget,
  cfg,
  uyeler,
  baslangic,
  gorunen,
  sayfaSayisi,
  setBaslangic,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
  baslangic: number;
  gorunen: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 px-6 py-12">
      <div className="mb-8 text-center">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-white`}>{widget.baslik}</h2>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="rounded-xl bg-slate-800 p-4 text-center">
            {u.gorselUrl && (
              <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className="mx-auto h-28 w-28 rounded-full object-cover ring-2 ring-slate-600" />
            )}
            <h3 className="mt-3 font-bold text-white">{u.ad}</h3>
            <p className="text-sm text-slate-400">{u.unvan}</p>
          </article>
        ))}
      </div>
      <Navigasyon baslangic={baslangic} gorunen={gorunen} toplam={uyeler.length} sayfaSayisi={sayfaSayisi} setBaslangic={setBaslangic} />
    </div>
  );
}

function MorUnvan({
  widget,
  cfg,
  uyeler,
  baslangic,
  gorunen,
  sayfaSayisi,
  setBaslangic,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
  baslangic: number;
  gorunen: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="text-center">
            {u.gorselUrl && (
              <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className={`mx-auto aspect-[3/4] w-full max-w-[200px] ${gorselSinifi(cfg)}`} />
            )}
            <h3 className="mt-3 font-bold text-slate-900">{u.ad}</h3>
            <p className="text-sm font-semibold text-violet-600">{u.unvan}</p>
          </article>
        ))}
      </div>
      <Navigasyon baslangic={baslangic} gorunen={gorunen} toplam={uyeler.length} sayfaSayisi={sayfaSayisi} setBaslangic={setBaslangic} />
    </>
  );
}

function TuruncuCerceve({
  widget,
  cfg,
  uyeler,
  baslangic,
  gorunen,
  sayfaSayisi,
  setBaslangic,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
  baslangic: number;
  gorunen: number;
  sayfaSayisi: number;
  setBaslangic: (fn: (b: number) => number) => void;
}) {
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {uyeler.slice(baslangic, baslangic + gorunen).map((u) => (
          <article key={u.id} className="group relative overflow-hidden rounded-xl border-4 border-orange-400">
            {u.gorselUrl && (
              <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className={`aspect-[3/4] w-full ${gorselSinifi(cfg)}`} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orange-900/90 to-transparent p-4">
              <h3 className="text-lg font-bold text-white">{u.ad}</h3>
              <p className="text-sm text-orange-100">{u.unvan}</p>
            </div>
          </article>
        ))}
      </div>
      <Navigasyon baslangic={baslangic} gorunen={gorunen} toplam={uyeler.length} sayfaSayisi={sayfaSayisi} setBaslangic={setBaslangic} />
    </>
  );
}

export function EkipKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const uyeler = cfg.uyeler ?? [];
  const [baslangic, setBaslangic] = useState(0);
  const gorunen = 4;
  const gt = widgetGorunumTipiAl(widget);

  if (uyeler.length === 0) return null;

  const sayfaSayisi = Math.ceil(uyeler.length / gorunen);
  const ortak = { widget, cfg, uyeler, baslangic, gorunen, sayfaSayisi, setBaslangic };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'kare-kart' && <KareKart {...ortak} />}
      {gt === 'sade-isim' && <SadeIsim {...ortak} />}
      {gt === 'koyu-profil' && <KoyuProfil {...ortak} />}
      {gt === 'mor-unvan' && <MorUnvan {...ortak} />}
      {gt === 'turuncu-cerceve' && <TuruncuCerceve {...ortak} />}
      {gt === 'yuvarlak-foto' && <YuvarlakFoto {...ortak} />}
    </WidgetKabuk>
  );
}
