import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetKarsilastirmaPaket, WidgetKarsilastirmaSatiri } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function tabloRenkler(cfg: Cfg, widget: Widget) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || widget.yaziRenk || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || '#7c3aed',
    kenar: g.tabloKenarRengi || '#e2e8f0',
    baslikSatir: g.tabloBaslikArkaPlan || '#f8fafc',
    panel: widget.arkaPlanRenk || '#ffffff',
    radius: g.borderRadius ?? 12,
  };
}

function hucreGoster(deger: string, hucreStili: CSSProperties, vurguRengi: string) {
  const d = deger.trim().toLowerCase();
  if (d === '✓' || d === 'evet' || d === 'var' || d === 'true') {
    return <span className="kt-onay" style={{ color: vurguRengi }}>✓</span>;
  }
  if (d === '✗' || d === 'hayir' || d === 'yok' || d === 'false') {
    return <span className="kt-red">✗</span>;
  }
  return <span className="kt-hucre-metin" style={hucreStili}>{deger}</span>;
}

function TabloBaslikBlok({ widget, cfg, renk }: { widget: Widget; cfg: Cfg; renk: ReturnType<typeof tabloRenkler> }) {
  if (!widget.baslik && !widget.altBaslik && !widget.aciklama) return null;
  return (
    <div className="kt-baslik-blok">
      {widget.altBaslik && (
        <p className="kt-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} kt-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="kt-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function PaketBaslikHucre({ p, renk, koyu }: { p: WidgetKarsilastirmaPaket; renk: ReturnType<typeof tabloRenkler>; koyu?: boolean }) {
  const oneCikan = p.oneCikan;
  return (
    <th
      className="kt-paket-baslik"
      style={
        oneCikan
          ? koyu
            ? { backgroundColor: renk.vurgu, color: '#fff' }
            : { backgroundColor: `${renk.vurgu}14`, boxShadow: `inset 0 -3px 0 ${renk.vurgu}` }
          : koyu
            ? undefined
            : undefined
      }
    >
      <p className="kt-paket-ad" style={{ color: oneCikan && koyu ? '#fff' : renk.baslik }}>
        {p.ad}
      </p>
      {p.fiyat && (
        <p className="kt-paket-fiyat" style={{ color: oneCikan && koyu ? 'rgba(255,255,255,0.9)' : renk.vurgu }}>
          {p.fiyat}
        </p>
      )}
      {oneCikan && <span className="kt-one-cikan-rozet" style={{ backgroundColor: koyu ? 'rgba(255,255,255,0.2)' : renk.vurgu, color: '#fff' }}>Öne çıkan</span>}
    </th>
  );
}

function useMobilEkran() {
  const [mobil, setMobil] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const guncelle = () => setMobil(mq.matches);
    guncelle();
    mq.addEventListener('change', guncelle);
    return () => mq.removeEventListener('change', guncelle);
  }, []);
  return mobil;
}

function MobilKartGrid({
  paketler,
  satirlar,
  renk,
  hucreStili,
  ozellikStili,
}: {
  paketler: WidgetKarsilastirmaPaket[];
  satirlar: WidgetKarsilastirmaSatiri[];
  renk: ReturnType<typeof tabloRenkler>;
  hucreStili: CSSProperties;
  ozellikStili: CSSProperties;
}) {
  return (
    <div className="kt-mobil-grid">
      {paketler.map((p) => (
        <article
          key={p.id}
          className="kt-mobil-kart"
          style={{
            borderRadius: renk.radius,
            borderColor: p.oneCikan ? renk.vurgu : renk.kenar,
            backgroundColor: p.oneCikan ? `${renk.vurgu}08` : renk.panel,
            boxShadow: p.oneCikan ? `0 12px 40px ${renk.vurgu}22` : undefined,
          }}
        >
          <div className="kt-mobil-kart-baslik">
            <h3 style={{ color: renk.baslik }}>{p.ad}</h3>
            {p.oneCikan && (
              <span className="kt-one-cikan-rozet" style={{ backgroundColor: renk.vurgu, color: '#fff' }}>
                Öne çıkan
              </span>
            )}
          </div>
          {p.fiyat && <p className="kt-mobil-fiyat" style={{ color: renk.vurgu }}>{p.fiyat}</p>}
          <ul className="kt-mobil-liste">
            {satirlar.map((s) => {
              const pi = paketler.findIndex((x) => x.id === p.id);
              return (
                <li key={s.id}>
                  <span className="kt-mobil-ozellik" style={ozellikStili}>{s.ozellik}</span>
                  {hucreGoster(s.hucreler[pi] ?? '—', hucreStili, renk.vurgu)}
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function KarsilastirmaTablosuWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const paketler = cfg.karsilastirmaPaketler ?? [];
  const satirlar = cfg.karsilastirmaSatirlari ?? [];
  const gt = widgetGorunumTipiAl(widget);
  const renk = tabloRenkler(cfg, widget);
  const mobilEkran = useMobilEkran();
  if (paketler.length === 0) return null;

  const hucreStili: CSSProperties = { color: renk.metin };
  const ozellikStili: CSSProperties = { color: renk.baslik };
  const kartGorunumu = gt === 'mobil-kart' || mobilEkran;

  if (kartGorunumu) {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslikBlok widget={widget} cfg={cfg} renk={renk} />
        <MobilKartGrid
          paketler={paketler}
          satirlar={satirlar}
          renk={renk}
          hucreStili={hucreStili}
          ozellikStili={ozellikStili}
        />
      </WidgetKabuk>
    );
  }

  if (gt === 'minimal-cizgi') {
    return (
      <WidgetKabuk widget={widget}>
        <TabloBaslikBlok widget={widget} cfg={cfg} renk={renk} />
        <div className="kt-minimal-wrap">
          <table className="kt-minimal-tablo">
            <thead>
              <tr style={{ borderColor: renk.kenar }}>
                <th style={{ color: renk.metin }}>Özellik</th>
                {paketler.map((p) => (
                  <th key={p.id} style={{ color: renk.baslik }}>{p.ad}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map((s) => (
                <tr key={s.id} style={{ borderColor: renk.kenar }}>
                  <td style={ozellikStili}>{s.ozellik}</td>
                  {paketler.map((p, i) => (
                    <td key={p.id} className="kt-hucre-orta">
                      {hucreGoster(s.hucreler[i] ?? '—', hucreStili, renk.vurgu)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WidgetKabuk>
    );
  }

  const koyuBaslik = gt === 'koyu-baslik';
  const vurguluSutun = gt === 'mor-vurgu';
  const onayIsaretli = gt === 'yesil-onay';
  const koyuHeaderBg = koyuBaslik ? (renk.baslikSatir === '#f8fafc' ? '#0f172a' : renk.baslikSatir) : onayIsaretli ? `${renk.vurgu}22` : renk.baslikSatir;

  return (
    <WidgetKabuk widget={widget}>
      <TabloBaslikBlok widget={widget} cfg={cfg} renk={renk} />
      <div
        className="kt-tablo-wrap"
        style={{ borderRadius: renk.radius, border: `1px solid ${renk.kenar}`, backgroundColor: renk.panel }}
      >
        <div className="kt-tablo-scroll" tabIndex={0} role="region" aria-label="Karşılaştırma tablosu — yatay kaydırılabilir">
          <table className="kt-tablo">
            <thead>
              <tr style={{ backgroundColor: koyuHeaderBg, borderBottom: `1px solid ${renk.kenar}` }}>
                <th className="kt-ozellik-baslik" style={{ color: koyuBaslik ? '#94a3b8' : renk.metin }}>
                  Özellik
                </th>
                {paketler.map((p) => (
                  <PaketBaslikHucre key={p.id} p={p} renk={renk} koyu={koyuBaslik} />
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map((s, si) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: `1px solid ${renk.kenar}`,
                    backgroundColor: si % 2 === 1 && !vurguluSutun ? `${renk.kenar}44` : undefined,
                  }}
                >
                  <td className="kt-ozellik-hucre" style={ozellikStili}>{s.ozellik}</td>
                  {paketler.map((p, i) => (
                    <td
                      key={p.id}
                      className="kt-hucre-orta"
                      style={
                        p.oneCikan && (vurguluSutun || onayIsaretli)
                          ? { backgroundColor: `${renk.vurgu}${onayIsaretli ? '10' : '08'}` }
                          : undefined
                      }
                    >
                      {hucreGoster(s.hucreler[i] ?? '—', hucreStili, renk.vurgu)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </WidgetKabuk>
  );
}
