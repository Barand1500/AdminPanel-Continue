import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetFiyatPaketi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || '#7c3aed',
    radius: g.borderRadius ?? 16,
  };
}

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const renk = renkler(cfg);
  if (!widget.baslik && !widget.altBaslik) return null;
  return (
    <div className="fp-baslik">
      {widget.altBaslik && (
        <p className="fp-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} fp-baslik-metin`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
    </div>
  );
}

function OzellikListesi({ paket, renk }: { paket: WidgetFiyatPaketi; renk: string }) {
  return (
    <ul className="fp-ozellikler">
      {(paket.ozellikler ?? []).map((o, i) => (
        <li key={i} className={`fp-ozellik${o.dahil ? '' : ' fp-ozellik-kapali'}`}>
          <span style={{ color: o.dahil ? renk : '#94a3b8' }}>{o.dahil ? '✓' : '✕'}</span>
          <span>{o.metin}</span>
        </li>
      ))}
    </ul>
  );
}

function PaketButon({ paket, vurgu, outline = false }: { paket: WidgetFiyatPaketi; vurgu: string; outline?: boolean }) {
  if (!paket.butonLink) return null;
  const sinif = outline ? 'fp-btn fp-btn-outline' : 'fp-btn';
  const stil = outline ? { borderColor: vurgu, color: vurgu } : { background: vurgu };
  const href = paket.butonLink;
  const children = paket.butonMetni || 'Satın Al';
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={sinif} style={stil}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={sinif} style={stil}>
      {children}
    </a>
  );
}

function PaketKart({
  paket,
  cfg,
  oneCikan = false,
  sinif = '',
}: {
  paket: WidgetFiyatPaketi;
  cfg: WidgetConfig;
  oneCikan?: boolean;
  sinif?: string;
}) {
  const renk = renkler(cfg);
  const v = oneCikan || paket.oneCikan;
  return (
    <article
      className={`fp-paket-kart${v ? ' fp-paket-one-cikan' : ''} ${sinif}`.trim()}
      style={{ borderRadius: `${renk.radius}px`, borderColor: v ? renk.vurgu : undefined }}
    >
      {v && <span className="fp-rozet" style={{ background: renk.vurgu }}>Önerilen</span>}
      <h3 className="fp-paket-ad" style={{ color: renk.baslik }}>{paket.ad}</h3>
      <p className="fp-paket-fiyat" style={{ color: v ? renk.vurgu : renk.baslik }}>{paket.fiyat}</p>
      {paket.aciklama && <p className="fp-paket-aciklama" style={{ color: renk.metin }}>{paket.aciklama}</p>}
      <OzellikListesi paket={paket} renk={renk.vurgu} />
      <PaketButon paket={paket} vurgu={renk.vurgu} outline={!v} />
    </article>
  );
}

function oneCikanIndex(paketler: WidgetFiyatPaketi[]) {
  const i = paketler.findIndex((p) => p.oneCikan);
  return i >= 0 ? i : Math.floor(paketler.length / 2);
}

function SekmeliToggle({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const [aktif, setAktif] = useState(oneCikanIndex(paketler));
  const renk = renkler(cfg);
  const secili = paketler[aktif] ?? paketler[0];

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="fp-sekme-wrap">
        <div className="fp-sekme-liste">
          {paketler.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`fp-sekme${i === aktif ? ' fp-sekme-aktif' : ''}`}
              style={i === aktif ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` } : undefined}
              onClick={() => setAktif(i)}
            >
              {p.ad}
            </button>
          ))}
        </div>
        <div className="fp-sekme-detay" style={{ borderRadius: `${renk.radius}px` }}>
          <PaketKart paket={secili} cfg={cfg} oneCikan={secili.oneCikan} sinif="fp-paket-sekme" />
        </div>
      </div>
    </>
  );
}

function KarsilastirmaTablo({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const renk = renkler(cfg);
  const satirlar = new Map<string, boolean[]>();
  paketler.forEach((p, pi) => {
    (p.ozellikler ?? []).forEach((o) => {
      const mevcut = satirlar.get(o.metin) ?? Array(paketler.length).fill(false);
      mevcut[pi] = o.dahil;
      satirlar.set(o.metin, mevcut);
    });
  });

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="fp-tablo-wrap" style={{ borderRadius: `${renk.radius}px` }}>
        <table className="fp-tablo">
          <thead>
            <tr>
              <th>Özellik</th>
              {paketler.map((p) => (
                <th key={p.id}>
                  <span className="fp-tablo-paket-ad">{p.ad}</span>
                  <span className="fp-tablo-fiyat" style={{ color: renk.vurgu }}>{p.fiyat}</span>
                  <PaketButon paket={p} vurgu={renk.vurgu} outline={!p.oneCikan} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(satirlar.entries()).map(([metin, dahiller]) => (
              <tr key={metin}>
                <td>{metin}</td>
                {dahiller.map((d, i) => (
                  <td key={i} className="fp-tablo-hucre">
                    <span style={{ color: d ? renk.vurgu : '#cbd5e1' }}>{d ? '✓' : '✕'}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SpotlightMerkez({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const merkez = oneCikanIndex(paketler);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="fp-spotlight">
        {paketler.map((p, i) => (
          <div
            key={p.id}
            className={`fp-spotlight-kolon${i === merkez ? ' fp-spotlight-merkez' : ''}`}
            style={i === merkez ? { transform: 'scale(1.05)', zIndex: 2 } : undefined}
          >
            <PaketKart paket={p} cfg={cfg} oneCikan={i === merkez} />
          </div>
        ))}
      </div>
    </>
  );
}

function YataySerit({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function kaydir(yon: 'sol' | 'sag') {
    scrollRef.current?.scrollBy({ left: yon === 'sol' ? -300 : 300, behavior: 'smooth' });
  }

  return (
    <>
      <div className="fp-serit-baslik">
        <Baslik widget={widget} cfg={cfg} />
        {paketler.length > 1 && (
          <div className="fp-serit-nav">
            <button type="button" className="fp-serit-ok" onClick={() => kaydir('sol')} aria-label="Önceki">‹</button>
            <button type="button" className="fp-serit-ok" onClick={() => kaydir('sag')} aria-label="Sonraki">›</button>
          </div>
        )}
      </div>
      <div className="fp-serit-scroll" ref={scrollRef}>
        {paketler.map((p) => (
          <PaketKart key={p.id} paket={p} cfg={cfg} sinif="fp-paket-serit" />
        ))}
      </div>
    </>
  );
}

function SplitHero({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const [aktif, setAktif] = useState(oneCikanIndex(paketler));
  const renk = renkler(cfg);
  const buyuk = paketler[aktif] ?? paketler[0];
  const diger = paketler.filter((_, i) => i !== aktif);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="fp-split">
        <PaketKart paket={buyuk} cfg={cfg} oneCikan sinif="fp-paket-buyuk" />
        <div className="fp-split-liste">
          {diger.map((p) => {
            const idx = paketler.indexOf(p);
            return (
              <button
                key={p.id}
                type="button"
                className="fp-split-tus"
                style={{ borderRadius: `${Math.max(8, renk.radius - 4)}px` }}
                onClick={() => setAktif(idx)}
              >
                <span className="fp-split-tus-ad" style={{ color: renk.baslik }}>{p.ad}</span>
                <span className="fp-split-tus-fiyat" style={{ color: renk.vurgu }}>{p.fiyat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function KartDestesi({ widget, cfg, paketler }: { widget: Widget; cfg: WidgetConfig; paketler: WidgetFiyatPaketi[] }) {
  const renk = renkler(cfg);
  const n = paketler.length;

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="fp-deste-wrap">
        <div className="fp-deste" style={{ '--fp-deste-n': n } as CSSProperties}>
          {paketler.map((p, i) => (
            <article
              key={p.id}
              className="fp-deste-kart"
              style={
                {
                  '--fp-deste-i': i,
                  borderRadius: `${renk.radius}px`,
                  borderColor: p.oneCikan ? renk.vurgu : '#e2e8f0',
                } as CSSProperties
              }
            >
              <h3 className="fp-paket-ad" style={{ color: renk.baslik }}>{p.ad}</h3>
              <p className="fp-paket-fiyat" style={{ color: renk.vurgu }}>{p.fiyat}</p>
              <OzellikListesi paket={p} renk={renk.vurgu} />
              <PaketButon paket={p} vurgu={renk.vurgu} outline={!p.oneCikan} />
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export function FiyatlandirmaWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const paketler = cfg.paketler ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (paketler.length === 0) return null;

  const ortak = { widget, cfg, paketler };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'karsilastirma-tablo' && <KarsilastirmaTablo {...ortak} />}
      {gt === 'spotlight-merkez' && <SpotlightMerkez {...ortak} />}
      {gt === 'yatay-serit' && <YataySerit {...ortak} />}
      {gt === 'split-hero' && <SplitHero {...ortak} />}
      {gt === 'kart-destesi' && <KartDestesi {...ortak} />}
      {(gt === 'sekmeli-toggle' || !gt) && <SekmeliToggle {...ortak} />}
    </WidgetKabuk>
  );
}
