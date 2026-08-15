import { useState, type CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetYorum } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#111827',
    metin: g.metinRengi || '#4b5563',
    vurgu: g.vurguRengi || '#111827',
    radius: g.borderRadius ?? 16,
  };
}

function Baslik({ widget, cfg }: { widget: Widget; cfg: WidgetConfig }) {
  const renk = renkler(cfg);
  const cizgiGoster = cfg.gorunum?.baslikCizgi !== false;
  if (!widget.baslik && !widget.altBaslik) return null;

  return (
    <div className="yk-baslik">
      {widget.altBaslik && (
        <div className="yk-alt-baslik-wrap">
          <p className="yk-alt-baslik" style={{ color: renk.vurgu }}>
            {widget.altBaslik}
          </p>
          {cizgiGoster && <span className="yk-baslik-cizgi" style={{ backgroundColor: renk.vurgu }} aria-hidden />}
        </div>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} yk-baslik-metin`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
    </div>
  );
}

function YazarBilgi({ y, cfg, koyu = false }: { y: WidgetYorum; cfg: WidgetConfig; koyu?: boolean }) {
  const renk = renkler(cfg);
  const adRengi = koyu ? (cfg.gorunum?.baslikRengi || '#ffffff') : renk.baslik;
  const firmaRengi = koyu ? (cfg.gorunum?.metinRengi || 'rgba(255, 255, 255, 0.68)') : renk.metin;

  return (
    <div className="yk-yazar">
      {y.gorselUrl ? (
        <img src={medyaUrl(y.gorselUrl)} alt={y.ad} className="yk-yazar-avatar" />
      ) : (
        <span className="yk-yazar-avatar yk-yazar-avatar-bos" style={{ borderColor: renk.vurgu, color: renk.vurgu }} aria-hidden>
          {y.ad.charAt(0) || '?'}
        </span>
      )}
      <div className="yk-yazar-metin">
        <p style={{ color: adRengi }}>{y.ad}</p>
        {y.firma && <p style={{ color: firmaRengi }}>{y.firma}</p>}
      </div>
    </div>
  );
}

function Yildizlar({ puan, renk }: { puan: number; renk: string }) {
  const deger = Math.min(5, Math.max(0, Math.round(puan)));
  return (
    <div className="yk-yildizlar" aria-label={`${deger} / 5 yıldız`}>
      {Array.from({ length: 5 }, (_, indeks) => (
        <span key={indeks} style={{ color: indeks < deger ? renk : '#dbe2ea' }} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

function KartKarusel({
  widget,
  cfg,
  yorumlar,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  yorumlar: WidgetYorum[];
}) {
  const [baslangic, setBaslangic] = useState(0);
  const renk = renkler(cfg);
  const gorunenAdet = Math.min(3, yorumlar.length);
  const gorunenYorumlar = Array.from({ length: gorunenAdet }, (_, sira) => yorumlar[(baslangic + sira) % yorumlar.length]);

  function kaydir(yon: 'onceki' | 'sonraki') {
    setBaslangic((mevcut) =>
      yon === 'onceki' ? (mevcut - 1 + yorumlar.length) % yorumlar.length : (mevcut + 1) % yorumlar.length,
    );
  }

  return (
    <>
      <div className="yk-baslik-satir">
        <Baslik widget={widget} cfg={cfg} />
        {yorumlar.length > gorunenAdet && (
          <div className="yk-gezinme" aria-label="Müşteri yorumları gezinme">
            <button type="button" onClick={() => kaydir('onceki')} aria-label="Önceki yorumlar">
              ‹
            </button>
            <button type="button" onClick={() => kaydir('sonraki')} aria-label="Sonraki yorumlar">
              ›
            </button>
          </div>
        )}
      </div>
      <div className="yk-kart-grid" style={{ '--yk-vurgu': renk.vurgu } as CSSProperties}>
        {gorunenYorumlar.map((yorum, indeks) => (
          <article key={`${yorum.id}-${baslangic}-${indeks}`} className="yk-kart" style={{ borderRadius: `${renk.radius}px` }}>
            <div className="yk-kart-icerik">
              <Yildizlar puan={yorum.yildiz ?? 5} renk={renk.vurgu} />
              <p className="yk-yorum-metin" style={{ color: renk.metin }}>
                “{yorum.metin}”
              </p>
            </div>
            <footer className="yk-kart-alt">
              <YazarBilgi y={yorum} cfg={cfg} />
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}

function TekAlinti({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const yorum = yorumlar[aktif];
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <blockquote className="yk-tek-alinti">
        <Yildizlar puan={yorum.yildiz ?? 5} renk={renk.vurgu} />
        <p style={{ color: renk.metin }}>“{yorum.metin}”</p>
        <footer>
          <YazarBilgi y={yorum} cfg={cfg} />
        </footer>
      </blockquote>
      {yorumlar.length > 1 && (
        <div className="yk-gezinme yk-gezinme-orta" aria-label="Müşteri yorumları gezinme">
          <button type="button" onClick={() => setAktif((mevcut) => (mevcut - 1 + yorumlar.length) % yorumlar.length)} aria-label="Önceki yorum">
            ‹
          </button>
          <button type="button" onClick={() => setAktif((mevcut) => (mevcut + 1) % yorumlar.length)} aria-label="Sonraki yorum">
            ›
          </button>
        </div>
      )}
    </>
  );
}

function KompaktYildiz({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="yk-kompakt-grid">
        {yorumlar.map((yorum) => (
          <article key={yorum.id} className="yk-kompakt-kart" style={{ borderColor: `${renk.vurgu}24`, borderRadius: `${renk.radius}px` }}>
            <Yildizlar puan={yorum.yildiz ?? 5} renk={renk.vurgu} />
            <p style={{ color: renk.metin }}>“{yorum.metin}”</p>
            <YazarBilgi y={yorum} cfg={cfg} />
          </article>
        ))}
      </div>
    </>
  );
}

function KoyuPanel({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const yorum = yorumlar[aktif];
  const renk = renkler(cfg);

  return (
    <div
      className="yk-koyu-panel"
      style={{
        borderRadius: `${renk.radius}px`,
        '--yk-koyu-metin': renk.metin,
      } as CSSProperties}
    >
      <div className="yk-koyu-baslik">
        {widget.altBaslik && <p style={{ color: renk.vurgu }}>{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={baslikSinifi(cfg)} style={{ color: renk.baslik }}>{widget.baslik}</h2>}
      </div>
      <div className="yk-koyu-icerik">
        <Yildizlar puan={yorum.yildiz ?? 5} renk={renk.vurgu} />
        <p>“{yorum.metin}”</p>
        <YazarBilgi y={yorum} cfg={cfg} koyu />
      </div>
      {yorumlar.length > 1 && (
        <div className="yk-gezinme yk-gezinme-orta" aria-label="Müşteri yorumları gezinme">
          <button type="button" onClick={() => setAktif((mevcut) => (mevcut - 1 + yorumlar.length) % yorumlar.length)} aria-label="Önceki yorum">
            ‹
          </button>
          <button type="button" onClick={() => setAktif((mevcut) => (mevcut + 1) % yorumlar.length)} aria-label="Sonraki yorum">
            ›
          </button>
        </div>
      )}
    </div>
  );
}

function OkyanusKart({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const [aktif, setAktif] = useState(0);
  const yorum = yorumlar[aktif];
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <article className="yk-okyanus-kart" style={{ borderColor: `${renk.vurgu}38`, borderRadius: `${renk.radius}px` }}>
        <Yildizlar puan={yorum.yildiz ?? 5} renk={renk.vurgu} />
        <p style={{ color: renk.metin }}>“{yorum.metin}”</p>
        <YazarBilgi y={yorum} cfg={cfg} />
      </article>
      {yorumlar.length > 1 && (
        <div className="yk-gezinme yk-gezinme-orta" aria-label="Müşteri yorumları gezinme">
          <button type="button" onClick={() => setAktif((mevcut) => (mevcut - 1 + yorumlar.length) % yorumlar.length)} aria-label="Önceki yorum">
            ‹
          </button>
          <button type="button" onClick={() => setAktif((mevcut) => (mevcut + 1) % yorumlar.length)} aria-label="Sonraki yorum">
            ›
          </button>
        </div>
      )}
    </>
  );
}

function MintMinimal({ widget, cfg, yorumlar }: { widget: Widget; cfg: WidgetConfig; yorumlar: WidgetYorum[] }) {
  const renk = renkler(cfg);
  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="yk-minimal-liste">
        {yorumlar.map((yorum) => (
          <article key={yorum.id} className="yk-minimal-yorum" style={{ borderLeftColor: renk.vurgu }}>
            <p style={{ color: renk.metin }}>“{yorum.metin}”</p>
            <YazarBilgi y={yorum} cfg={cfg} />
          </article>
        ))}
      </div>
    </>
  );
}

export function YorumKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const yorumlar = cfg.yorumlar ?? [];
  const gorunumTipi = widgetGorunumTipiAl(widget);

  if (yorumlar.length === 0) return null;

  const ortak = { widget, cfg, yorumlar };

  return (
    <WidgetKabuk widget={widget}>
      {gorunumTipi === 'tek-alinti' && <TekAlinti {...ortak} />}
      {gorunumTipi === 'kompakt-yildiz' && <KompaktYildiz {...ortak} />}
      {gorunumTipi === 'koyu-panel' && <KoyuPanel {...ortak} />}
      {gorunumTipi === 'okyanus-kart' && <OkyanusKart {...ortak} />}
      {gorunumTipi === 'mint-minimal' && <MintMinimal {...ortak} />}
      {(gorunumTipi === 'kart-karusel' || !gorunumTipi) && <KartKarusel {...ortak} />}
    </WidgetKabuk>
  );
}
