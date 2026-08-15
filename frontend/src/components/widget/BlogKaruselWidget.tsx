import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetBlogKart, WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import { useSiteDil } from '@/contexts/SiteDilContext';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#111827',
    metin: g.metinRengi || '#4b5563',
    vurgu: g.vurguRengi || '#111827',
    radius: g.borderRadius ?? 16,
  };
}

function BaslikSatir({
  widget,
  cfg,
  tumunuGorLink,
  tumunuGorMetin,
  cevir,
  ek,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  tumunuGorLink?: string;
  tumunuGorMetin?: string;
  cevir: (k: string, f: string) => string;
  ek?: ReactNode;
}) {
  const renk = renkler(cfg);
  const cizgiGoster = cfg.gorunum?.baslikCizgi !== false;
  return (
    <div className="bk-baslik-satir">
      <div className="bk-baslik-grup">
        {widget.altBaslik && (
          <div className="bk-alt-baslik-wrap">
            <p className="bk-alt-baslik" style={{ color: renk.vurgu }}>
              {widget.altBaslik}
            </p>
            {cizgiGoster && <span className="bk-baslik-cizgi" style={{ backgroundColor: renk.vurgu }} aria-hidden />}
          </div>
        )}
        {widget.baslik && (
          <h2 className={`${baslikSinifi(cfg)} bk-baslik`} style={{ color: renk.baslik }}>
            {widget.baslik}
          </h2>
        )}
      </div>
      <div className="bk-baslik-sag">
        {ek}
        {tumunuGorLink && (
          <a href={tumunuGorLink} className="bk-tumunu-gor" style={{ background: renk.vurgu }}>
            {tumunuGorMetin ?? cevir('site.tumunuGor', 'Tümünü Gör')}
          </a>
        )}
      </div>
    </div>
  );
}

function KartLink({
  href,
  className,
  style,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  );
}

function kategorileriTopla(kartlar: WidgetBlogKart[], filtreler?: string[]) {
  const kartKat = [...new Set(kartlar.map((k) => k.kategori?.trim()).filter(Boolean))] as string[];
  if (filtreler?.length) {
    const sirali = filtreler.filter((f) => kartKat.includes(f) || kartlar.some((k) => k.kategori === f));
    const ek = kartKat.filter((k) => !sirali.includes(k));
    return [...sirali, ...ek];
  }
  return kartKat;
}

function SnapSerit({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [aktif, setAktif] = useState(0);
  const renk = renkler(cfg);

  function kaydir(yon: 'sol' | 'sag') {
    const el = scrollRef.current;
    if (!el) return;
    const kart = el.querySelector<HTMLElement>('.bk-snap-kart');
    const genislik = kart ? kart.offsetWidth + 16 : 320;
    el.scrollBy({ left: yon === 'sol' ? -genislik : genislik, behavior: 'smooth' });
  }

  function scrollIzle() {
    const el = scrollRef.current;
    if (!el) return;
    const kart = el.querySelector<HTMLElement>('.bk-snap-kart');
    const genislik = kart ? kart.offsetWidth + 16 : 1;
    setAktif(Math.round(el.scrollLeft / genislik));
  }

  return (
    <>
      <BaslikSatir
        widget={widget}
        cfg={cfg}
        tumunuGorLink={cfg.tumunuGorLink}
        tumunuGorMetin={cfg.tumunuGorMetin}
        cevir={cevir}
        ek={
          kartlar.length > 1 ? (
            <div className="bk-serit-nav">
              <button type="button" className="bk-serit-ok" onClick={() => kaydir('sol')} aria-label="Önceki">
                ‹
              </button>
              <button type="button" className="bk-serit-ok" onClick={() => kaydir('sag')} aria-label="Sonraki">
                ›
              </button>
            </div>
          ) : null
        }
      />
      <div className="bk-snap-scroll" ref={scrollRef} onScroll={scrollIzle}>
        {kartlar.map((k) => (
          <article
            key={k.id}
            className="bk-snap-kart"
            style={{ borderRadius: `${renk.radius}px` }}
          >
            {k.gorselUrl && (
              <img src={medyaUrl(k.gorselUrl)} alt="" className="bk-snap-gorsel" />
            )}
            <div className="bk-snap-icerik">
              <KartMeta kart={k} renk={renk} />
              <h3 className="bk-kart-baslik" style={{ color: renk.baslik }}>
                {k.baslik}
              </h3>
              {k.ozet && <p className="bk-kart-ozet" style={{ color: renk.metin }}>{k.ozet}</p>}
              {k.link && (
                <KartLink href={k.link} className="bk-kart-link" style={{ color: renk.vurgu }}>
                  {k.butonMetni || cevir('site.dahaFazlaOku', 'Daha Fazla Oku')} →
                </KartLink>
              )}
            </div>
          </article>
        ))}
      </div>
      {kartlar.length > 1 && (
        <div className="bk-progress">
          {kartlar.map((k, i) => (
            <span
              key={k.id}
              className={`bk-progress-nokta${i === aktif ? ' bk-progress-aktif' : ''}`}
              style={i === aktif ? { background: renk.vurgu } : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}

function HeroMiniGrid({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const [hero, ...mini] = kartlar;
  const renk = renkler(cfg);

  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="bk-hero-mini">
        {hero && (
          <article className="bk-hero-buyuk" style={{ borderRadius: `${renk.radius}px` }}>
            {hero.gorselUrl && (
              <img src={medyaUrl(hero.gorselUrl)} alt="" className="bk-hero-buyuk-gorsel" />
            )}
            <div className="bk-hero-buyuk-icerik">
              <KartMeta kart={hero} renk={renk} />
              <h3 className="bk-hero-buyuk-baslik" style={{ color: renk.baslik }}>
                {hero.baslik}
              </h3>
              {hero.ozet && <p className="bk-kart-ozet" style={{ color: renk.metin }}>{hero.ozet}</p>}
              {hero.link && (
                <KartLink href={hero.link} className="bk-btn" style={{ background: renk.vurgu }}>
                  {hero.butonMetni || cevir('site.dahaFazlaOku', 'Daha Fazla Oku')}
                </KartLink>
              )}
            </div>
          </article>
        )}
        <div className="bk-mini-grid">
          {mini.slice(0, 4).map((k) => (
            <KartLink
              key={k.id}
              href={k.link || '#'}
              className="bk-mini-kart"
              style={{ borderRadius: `${Math.max(10, renk.radius - 4)}px` }}
            >
              {k.gorselUrl && (
                <img src={medyaUrl(k.gorselUrl)} alt="" className="bk-mini-gorsel" />
              )}
              <div className="bk-mini-icerik">
                <KartMeta kart={k} renk={renk} />
                <h4 className="bk-mini-baslik" style={{ color: renk.baslik }}>
                  {k.baslik}
                </h4>
              </div>
            </KartLink>
          ))}
        </div>
      </div>
    </>
  );
}

function KartDestesi({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const renk = renkler(cfg);
  const n = kartlar.length;

  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      <div className="bk-deste-wrap">
        <div className="bk-deste" style={{ '--bk-deste-n': n } as CSSProperties}>
          {kartlar.map((k, i) => (
            <article
              key={k.id}
              className="bk-deste-kart"
              style={
                {
                  '--bk-deste-i': i,
                  borderRadius: `${renk.radius}px`,
                } as CSSProperties
              }
            >
              {k.gorselUrl && (
                <img src={medyaUrl(k.gorselUrl)} alt="" className="bk-deste-gorsel" />
              )}
              <KartMeta kart={k} renk={renk} />
              <h3 className="bk-kart-baslik" style={{ color: renk.baslik }}>
                {k.baslik}
              </h3>
              {k.link && (
                <KartLink href={k.link} className="bk-kart-link" style={{ color: renk.vurgu }}>
                  {k.butonMetni || cevir('site.dahaFazlaOku', 'Oku')} →
                </KartLink>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function SekmeliKategori({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const kategoriler = kategorileriTopla(kartlar, cfg.filtreler);
  const [aktifKat, setAktifKat] = useState<string>('__tumu__');
  const renk = renkler(cfg);
  const filtreli =
    aktifKat === '__tumu__' ? kartlar : kartlar.filter((k) => (k.kategori ?? '').trim() === aktifKat);

  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      {kategoriler.length > 0 && (
        <div className="bk-sekme-liste">
          <button
            type="button"
            className={`bk-sekme${aktifKat === '__tumu__' ? ' bk-sekme-aktif' : ''}`}
            style={aktifKat === '__tumu__' ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` } : undefined}
            onClick={() => setAktifKat('__tumu__')}
          >
            Tümü
          </button>
          {kategoriler.map((kat) => (
            <button
              key={kat}
              type="button"
              className={`bk-sekme${aktifKat === kat ? ' bk-sekme-aktif' : ''}`}
              style={aktifKat === kat ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` } : undefined}
              onClick={() => setAktifKat(kat)}
            >
              {kat}
            </button>
          ))}
        </div>
      )}
      <div className="bk-sekme-grid">
        {filtreli.map((k) => (
          <article key={k.id} className="bk-sekme-kart" style={{ borderRadius: `${renk.radius}px` }}>
            {k.gorselUrl && <img src={medyaUrl(k.gorselUrl)} alt="" className="bk-sekme-gorsel" />}
            <div className="bk-sekme-icerik">
              <KartMeta kart={k} renk={renk} />
              <h3 className="bk-kart-baslik" style={{ color: renk.baslik }}>{k.baslik}</h3>
              {k.link && (
                <KartLink href={k.link} className="bk-kart-link" style={{ color: renk.vurgu }}>
                  {k.butonMetni || cevir('site.dahaFazlaOku', 'Oku')} →
                </KartLink>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function KurumsalHaberKartlari({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const renk = renkler(cfg);
  const gorunenKartlar = kartlar.slice(0, 4);

  return (
    <>
      <BaslikSatir
        widget={widget}
        cfg={cfg}
        tumunuGorLink={cfg.tumunuGorLink}
        tumunuGorMetin={cfg.tumunuGorMetin}
        cevir={cevir}
      />
      <div className="bk-kurumsal-grid">
        {gorunenKartlar.map((k) => (
          <article
            key={k.id}
            className="bk-kurumsal-kart"
            style={{ borderRadius: `${renk.radius}px` }}
          >
            <div className="bk-kurumsal-gorsel-alan">
              {k.gorselUrl ? (
                <img src={medyaUrl(k.gorselUrl)} alt="" className="bk-kurumsal-gorsel" />
              ) : (
                <div className="bk-kurumsal-gorsel-bos" aria-hidden />
              )}
            </div>
            <div className="bk-kurumsal-icerik">
              <KartMeta kart={k} renk={renk} />
              <h3 className="bk-kurumsal-baslik" style={{ color: renk.baslik }}>
                {k.baslik}
              </h3>
              {k.ozet && <p className="bk-kurumsal-ozet" style={{ color: renk.metin }}>{k.ozet}</p>}
              {k.link && (
                <KartLink href={k.link} className="bk-kurumsal-cta" style={{ color: renk.vurgu }}>
                  {k.butonMetni || cevir('site.dahaFazlaOku', 'Devamını Oku')} <span aria-hidden>→</span>
                </KartLink>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function KartMeta({ kart, renk }: { kart: WidgetBlogKart; renk: ReturnType<typeof renkler> }) {
  if (!kart.kategori && !kart.tarih) return null;
  return (
    <div className="bk-kart-meta">
      {kart.kategori && (
        <span className="bk-kategori-etiket" style={{ color: renk.vurgu }}>
          {kart.kategori}
        </span>
      )}
      {kart.tarih && (
        <time className="bk-kart-tarih" style={{ color: renk.metin }}>
          {kart.tarih}
        </time>
      )}
    </div>
  );
}

function TickerHero({
  widget,
  cfg,
  kartlar,
  cevir,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  kartlar: WidgetBlogKart[];
  cevir: (k: string, f: string) => string;
}) {
  const hero = kartlar[0];
  const ticker = kartlar.slice(0, 8);
  const cift = [...ticker, ...ticker];
  const renk = renkler(cfg);

  return (
    <>
      <BaslikSatir widget={widget} cfg={cfg} tumunuGorLink={cfg.tumunuGorLink} tumunuGorMetin={cfg.tumunuGorMetin} cevir={cevir} />
      {ticker.length > 0 && (
        <div className="bk-ticker-alan">
          <div className="bk-ticker-iz">
            {cift.map((k, i) => (
              <a key={`${k.id}-${i}`} href={k.link || '#'} className="bk-ticker-oge">
                <span className="bk-ticker-nokta" style={{ background: renk.vurgu }} />
                {k.baslik}
              </a>
            ))}
          </div>
        </div>
      )}
      {hero && (
        <article className="bk-ticker-hero" style={{ borderRadius: `${renk.radius}px` }}>
          {hero.gorselUrl && (
            <img src={medyaUrl(hero.gorselUrl)} alt="" className="bk-ticker-hero-gorsel" />
          )}
          <div className="bk-ticker-hero-icerik">
            <KartMeta kart={hero} renk={renk} />
            <h3 className="bk-ticker-hero-baslik" style={{ color: renk.baslik }}>
              {hero.baslik}
            </h3>
            {hero.ozet && <p className="bk-kart-ozet" style={{ color: renk.metin }}>{hero.ozet}</p>}
            {hero.link && (
              <KartLink href={hero.link} className="bk-btn" style={{ background: renk.vurgu }}>
                {hero.butonMetni || cevir('site.dahaFazlaOku', 'Daha Fazla Oku')}
              </KartLink>
            )}
          </div>
        </article>
      )}
    </>
  );
}

export function BlogKaruselWidget({ widget }: { widget: Widget }) {
  const { cevir } = useSiteDil();
  const cfg = configOkuFromWidget(widget);
  const kartlar = cfg.blogKartlari ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (kartlar.length === 0) return null;

  const ortak = { widget, cfg, kartlar, cevir };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'hero-mini-grid' && <HeroMiniGrid {...ortak} />}
      {gt === 'kart-destesi' && <KartDestesi {...ortak} />}
      {gt === 'sekmeli-kategori' && <SekmeliKategori {...ortak} />}
      {gt === 'overlay-sinematik' && <KurumsalHaberKartlari {...ortak} />}
      {gt === 'ticker-hero' && <TickerHero {...ortak} />}
      {(gt === 'snap-serit' || !gt) && <SnapSerit {...ortak} />}
    </WidgetKabuk>
  );
}
