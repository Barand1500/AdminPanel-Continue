import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetEkipUyesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || '#7c3aed',
    radius: g.borderRadius ?? 16,
  };
}

function Baslik({ widget, cfg, ortala = true }: { widget: Widget; cfg: WidgetConfig; ortala?: boolean }) {
  const renk = renkler(cfg);
  if (!widget.baslik && !widget.altBaslik) return null;
  return (
    <div className={`ek-baslik${ortala ? ' ek-baslik-orta' : ''}`}>
      {widget.altBaslik && (
        <p className="ek-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} ek-baslik-metin`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
    </div>
  );
}

function UyeAvatar({ u, boyut = 'md' }: { u: WidgetEkipUyesi; boyut?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sinif = `ek-avatar ek-avatar-${boyut}`;
  if (u.gorselUrl) {
    return <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className={sinif} />;
  }
  return (
    <div className={`${sinif} ek-avatar-bos`}>
      {u.ad.charAt(0) || '?'}
    </div>
  );
}

function departmanlariTopla(uyeler: WidgetEkipUyesi[], filtreler?: string[]) {
  const deps = [...new Set(uyeler.map((u) => u.departman?.trim()).filter(Boolean))] as string[];
  if (filtreler?.length) {
    const sirali = filtreler.filter((f) => deps.includes(f));
    const ek = deps.filter((d) => !sirali.includes(d));
    return [...sirali, ...ek];
  }
  return deps;
}

function SosyalLink({ href, children, className }: { href: string; className?: string; children: ReactNode }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function HeroMerkez({
  widget,
  cfg,
  uyeler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
}) {
  const [hero, ...mini] = uyeler;
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="ek-hero-mini">
        {hero && (
          <article className="ek-hero-kart" style={{ borderRadius: `${renk.radius}px` }}>
            <UyeAvatar u={hero} boyut="xl" />
            <div className="ek-hero-icerik">
              <h3 className="ek-uye-ad" style={{ color: renk.baslik }}>
                {hero.ad}
              </h3>
              <p className="ek-uye-unvan" style={{ color: renk.vurgu }}>
                {hero.unvan}
              </p>
              {hero.departman && <p className="ek-uye-dep">{hero.departman}</p>}
              {hero.aciklama && (
                <p className="ek-uye-aciklama" style={{ color: renk.metin }}>
                  {hero.aciklama}
                </p>
              )}
            </div>
          </article>
        )}
        <div className="ek-mini-grid">
          {mini.slice(0, 6).map((u) => (
            <article key={u.id} className="ek-mini-kart" style={{ borderRadius: `${Math.max(10, renk.radius - 4)}px` }}>
              <UyeAvatar u={u} boyut="sm" />
              <div>
                <h4 className="ek-mini-ad" style={{ color: renk.baslik }}>
                  {u.ad}
                </h4>
                <p className="ek-mini-unvan" style={{ color: renk.metin }}>
                  {u.unvan}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function KartDestesi({
  widget,
  cfg,
  uyeler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
}) {
  const renk = renkler(cfg);
  const n = uyeler.length;

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="ek-deste-wrap">
        <div className="ek-deste" style={{ '--ek-deste-n': n } as CSSProperties}>
          {uyeler.map((u, i) => (
            <article
              key={u.id}
              className="ek-deste-kart"
              style={
                {
                  '--ek-deste-i': i,
                  borderRadius: `${renk.radius}px`,
                  borderColor: `${renk.vurgu}33`,
                } as CSSProperties
              }
            >
              <UyeAvatar u={u} boyut="md" />
              <h3 className="ek-uye-ad" style={{ color: renk.baslik }}>
                {u.ad}
              </h3>
              <p className="ek-uye-unvan" style={{ color: renk.vurgu }}>
                {u.unvan}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function SekmeliDepartman({
  widget,
  cfg,
  uyeler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
}) {
  const departmanlar = departmanlariTopla(uyeler, cfg.filtreler);
  const [aktif, setAktif] = useState('__tumu__');
  const renk = renkler(cfg);
  const filtreli =
    aktif === '__tumu__' ? uyeler : uyeler.filter((u) => (u.departman ?? '').trim() === aktif);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      {departmanlar.length > 0 && (
        <div className="ek-sekme-liste">
          <button
            type="button"
            className={`ek-sekme${aktif === '__tumu__' ? ' ek-sekme-aktif' : ''}`}
            style={aktif === '__tumu__' ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` } : undefined}
            onClick={() => setAktif('__tumu__')}
          >
            Tümü
          </button>
          {departmanlar.map((d) => (
            <button
              key={d}
              type="button"
              className={`ek-sekme${aktif === d ? ' ek-sekme-aktif' : ''}`}
              style={aktif === d ? { borderColor: renk.vurgu, color: renk.vurgu, background: `${renk.vurgu}12` } : undefined}
              onClick={() => setAktif(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}
      <div className="ek-sekme-grid">
        {filtreli.map((u) => (
          <article key={u.id} className="ek-sekme-kart" style={{ borderRadius: `${renk.radius}px` }}>
            <UyeAvatar u={u} boyut="lg" />
            <h3 className="ek-uye-ad" style={{ color: renk.baslik }}>
              {u.ad}
            </h3>
            <p className="ek-uye-unvan" style={{ color: renk.vurgu }}>
              {u.unvan}
            </p>
            {u.departman && <p className="ek-uye-dep">{u.departman}</p>}
          </article>
        ))}
      </div>
    </>
  );
}

function OrbitDuzen({
  widget,
  cfg,
  uyeler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
}) {
  const renk = renkler(cfg);
  const n = uyeler.length;

  return (
    <>
      <div className="ek-orbit-alan">
        <div className="ek-orbit-halka" style={{ '--ek-orbit-n': n } as CSSProperties}>
          <div className="ek-orbit-merkez">
            <Baslik widget={widget} cfg={cfg} ortala />
          </div>
          {uyeler.map((u, i) => (
            <article
              key={u.id}
              className="ek-orbit-oge"
              style={{ '--ek-orbit-i': i } as CSSProperties}
            >
              <div className="ek-orbit-kart" style={{ borderColor: `${renk.vurgu}44`, borderRadius: `${renk.radius}px` }}>
                <UyeAvatar u={u} boyut="sm" />
                <h3 className="ek-orbit-ad" style={{ color: renk.baslik }}>
                  {u.ad}
                </h3>
                <p className="ek-orbit-unvan" style={{ color: renk.metin }}>
                  {u.unvan}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="ek-orbit-mobil">
          <Baslik widget={widget} cfg={cfg} />
          <div className="ek-sekme-grid">
            {uyeler.map((u) => (
              <article key={u.id} className="ek-sekme-kart" style={{ borderRadius: `${renk.radius}px` }}>
                <UyeAvatar u={u} boyut="md" />
                <h3 className="ek-uye-ad" style={{ color: renk.baslik }}>
                  {u.ad}
                </h3>
                <p className="ek-uye-unvan" style={{ color: renk.vurgu }}>
                  {u.unvan}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function HoverFlip({
  widget,
  cfg,
  uyeler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
}) {
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      <div className="ek-flip-grid">
        {uyeler.map((u) => (
          <div key={u.id} className="ek-flip-kapsul" style={{ borderRadius: `${renk.radius}px` }}>
            <div className="ek-flip-inner">
              <div className="ek-flip-on" style={{ borderRadius: `${renk.radius}px` }}>
                {u.gorselUrl ? (
                  <img src={medyaUrl(u.gorselUrl)} alt={u.ad} className="ek-flip-gorsel" />
                ) : (
                  <div className="ek-flip-gorsel ek-avatar-bos ek-avatar-xl">{u.ad.charAt(0)}</div>
                )}
                <div className="ek-flip-on-alt">
                  <h3 className="ek-uye-ad">{u.ad}</h3>
                  <p className="ek-uye-unvan">{u.unvan}</p>
                </div>
              </div>
              <div className="ek-flip-arka" style={{ borderRadius: `${renk.radius}px`, background: renk.vurgu }}>
                <h3 className="ek-flip-arka-ad">{u.ad}</h3>
                <p className="ek-flip-arka-unvan">{u.unvan}</p>
                {u.aciklama && <p className="ek-flip-arka-aciklama">{u.aciklama}</p>}
                {u.linkedin && (
                  <SosyalLink href={u.linkedin} className="ek-flip-link">
                    LinkedIn →
                  </SosyalLink>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MarqueeSpotlight({
  widget,
  cfg,
  uyeler,
}: {
  widget: Widget;
  cfg: WidgetConfig;
  uyeler: WidgetEkipUyesi[];
}) {
  const [aktif, setAktif] = useState(0);
  const secili = uyeler[aktif] ?? uyeler[0];
  const ticker = uyeler.slice(0, 10);
  const cift = [...ticker, ...ticker];
  const renk = renkler(cfg);

  return (
    <>
      <Baslik widget={widget} cfg={cfg} />
      {ticker.length > 1 && (
        <div className="ek-ticker-alan">
          <div className="ek-ticker-iz">
            {cift.map((u, i) => (
              <button
                key={`${u.id}-${i}`}
                type="button"
                className="ek-ticker-tus"
                onClick={() => setAktif(i % uyeler.length)}
              >
                <span className="ek-ticker-nokta" style={{ background: renk.vurgu }} />
                {u.ad}
              </button>
            ))}
          </div>
        </div>
      )}
      {secili && (
        <article className="ek-spotlight" style={{ borderRadius: `${renk.radius}px` }}>
          <div className="ek-spotlight-gorsel">
            <UyeAvatar u={secili} boyut="xl" />
          </div>
          <div className="ek-spotlight-icerik">
            <h3 className="ek-spotlight-ad" style={{ color: renk.baslik }}>
              {secili.ad}
            </h3>
            <p className="ek-uye-unvan" style={{ color: renk.vurgu }}>
              {secili.unvan}
            </p>
            {secili.departman && <p className="ek-uye-dep">{secili.departman}</p>}
            {secili.aciklama && (
              <p className="ek-uye-aciklama" style={{ color: renk.metin }}>
                {secili.aciklama}
              </p>
            )}
            {uyeler.length > 1 && (
              <div className="ek-spotlight-secici">
                {uyeler.map((u, i) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`ek-spotlight-nokta${i === aktif ? ' ek-spotlight-nokta-aktif' : ''}`}
                    style={i === aktif ? { borderColor: renk.vurgu } : undefined}
                    onClick={() => setAktif(i)}
                    aria-label={u.ad}
                  >
                    <UyeAvatar u={u} boyut="sm" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </article>
      )}
    </>
  );
}

export function EkipKaruselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const uyeler = cfg.uyeler ?? [];
  const gt = widgetGorunumTipiAl(widget);

  if (uyeler.length === 0) return null;

  const ortak = { widget, cfg, uyeler };

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'kart-destesi' && <KartDestesi {...ortak} />}
      {gt === 'sekmeli-departman' && <SekmeliDepartman {...ortak} />}
      {gt === 'orbit-duzen' && <OrbitDuzen {...ortak} />}
      {gt === 'hover-flip' && <HoverFlip {...ortak} />}
      {gt === 'marquee-spotlight' && <MarqueeSpotlight {...ortak} />}
      {(gt === 'hero-merkez' || !gt) && <HeroMerkez {...ortak} />}
    </WidgetKabuk>
  );
}
