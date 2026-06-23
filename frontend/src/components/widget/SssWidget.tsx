import { useMemo, useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetSssOgesi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

type Cfg = ReturnType<typeof configOkuFromWidget>;

function renkler(cfg: WidgetConfig, widget: Widget) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || widget.yaziRenk || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || '#7c3aed',
    radius: g.borderRadius ?? 12,
    panel: widget.arkaPlanRenk || '#ffffff',
  };
}

function soruFiltrele(sorular: WidgetSssOgesi[], filtreler: string[], secili: number) {
  if (filtreler.length === 0 || secili === 0) return sorular;
  const kat = filtreler[secili];
  return sorular.filter((s) => !s.kategori || s.kategori === kat);
}

function BolumBaslik({ widget, cfg }: { widget: Widget; cfg: Cfg }) {
  const renk = renkler(cfg, widget);
  if (!widget.baslik && !widget.altBaslik && !widget.aciklama) return null;
  return (
    <div className="sss-bolum-baslik">
      {widget.altBaslik && (
        <p className="sss-alt-baslik" style={{ color: renk.vurgu }}>
          {widget.altBaslik}
        </p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} sss-baslik`} style={{ color: renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="sss-aciklama" style={{ color: renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function AccordionOge({
  s,
  acik,
  onToggle,
  renk,
  tekAcik,
}: {
  s: WidgetSssOgesi;
  acik: boolean;
  onToggle: () => void;
  renk: ReturnType<typeof renkler>;
  tekAcik?: boolean;
}) {
  return (
    <div
      className={`sss-accordion-oge ${acik ? 'sss-accordion-oge-acik' : ''} ${tekAcik && acik ? 'sss-accordion-odak' : ''}`}
      style={{
        borderRadius: renk.radius,
        backgroundColor: renk.panel,
        borderColor: acik ? renk.vurgu : 'rgba(15, 23, 42, 0.1)',
        boxShadow: tekAcik && acik ? `0 8px 28px ${renk.vurgu}22` : undefined,
      }}
    >
      <button type="button" className="sss-accordion-tus" onClick={onToggle} style={{ color: renk.baslik }}>
        <span>{s.soru}</span>
        <span className="sss-accordion-ikon" style={{ color: renk.vurgu }}>
          {acik ? '−' : '+'}
        </span>
      </button>
      {acik && (
        <div className="sss-accordion-cevap" style={{ color: renk.metin, borderColor: `${renk.vurgu}22` }}>
          {s.cevap}
        </div>
      )}
    </div>
  );
}

function IkiKolonGrid({ widget, cfg, sorular }: { widget: Widget; cfg: Cfg; sorular: WidgetSssOgesi[] }) {
  const renk = renkler(cfg, widget);
  const [aciklar, setAciklar] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setAciklar((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="sss-iki-kolon-grid">
        {sorular.map((s) => (
          <AccordionOge key={s.id} s={s} acik={!!aciklar[s.id]} onToggle={() => toggle(s.id)} renk={renk} />
        ))}
      </div>
    </>
  );
}

function SekmeliKategori({ widget, cfg, sorular, filtreler }: { widget: Widget; cfg: Cfg; sorular: WidgetSssOgesi[]; filtreler: string[] }) {
  const renk = renkler(cfg, widget);
  const [secili, setSecili] = useState(0);
  const [acik, setAcik] = useState<string | null>(null);
  const gorunen = soruFiltrele(sorular, filtreler, secili);

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      {filtreler.length > 0 && (
        <div className="sss-sekme-liste">
          {filtreler.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`sss-sekme ${i === secili ? 'sss-sekme-aktif' : ''}`}
              style={i === secili ? { backgroundColor: renk.vurgu, borderColor: renk.vurgu } : undefined}
              onClick={() => { setSecili(i); setAcik(null); }}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <div className="sss-sekme-liste-icerik">
        {gorunen.map((s) => (
          <AccordionOge
            key={s.id}
            s={s}
            acik={acik === s.id}
            onToggle={() => setAcik(acik === s.id ? null : s.id)}
            renk={renk}
          />
        ))}
      </div>
    </>
  );
}

function AramaFiltre({ widget, cfg, sorular }: { widget: Widget; cfg: Cfg; sorular: WidgetSssOgesi[] }) {
  const renk = renkler(cfg, widget);
  const [arama, setArama] = useState('');
  const [acik, setAcik] = useState<string | null>(null);
  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return sorular;
    return sorular.filter((s) => s.soru.toLowerCase().includes(q) || s.cevap.toLowerCase().includes(q));
  }, [arama, sorular]);

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="sss-arama-wrap">
        <input
          type="search"
          className="sss-arama-input"
          placeholder="Soru veya cevap ara…"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          style={{ borderRadius: renk.radius, borderColor: `${renk.vurgu}44` }}
        />
      </div>
      {filtreli.length === 0 ? (
        <p className="sss-arama-bos" style={{ color: renk.metin }}>Sonuç bulunamadı.</p>
      ) : (
        <div className="sss-arama-liste">
          {filtreli.map((s) => (
            <AccordionOge
              key={s.id}
              s={s}
              acik={acik === s.id}
              onToggle={() => setAcik(acik === s.id ? null : s.id)}
              renk={renk}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TekAcikOdak({ widget, cfg, sorular }: { widget: Widget; cfg: Cfg; sorular: WidgetSssOgesi[] }) {
  const renk = renkler(cfg, widget);
  const [acik, setAcik] = useState<string | null>(sorular[0]?.id ?? null);

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="sss-tek-odak-liste">
        {sorular.map((s) => (
          <AccordionOge
            key={s.id}
            s={s}
            acik={acik === s.id}
            onToggle={() => setAcik(acik === s.id ? null : s.id)}
            renk={renk}
            tekAcik
          />
        ))}
      </div>
    </>
  );
}

function KartDestesi({ widget, cfg, sorular }: { widget: Widget; cfg: Cfg; sorular: WidgetSssOgesi[] }) {
  const renk = renkler(cfg, widget);
  const [acik, setAcik] = useState<string | null>(null);

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      <div className="sss-kart-destesi">
        {sorular.map((s) => (
          <div
            key={s.id}
            className={`sss-kart ${acik === s.id ? 'sss-kart-acik' : ''}`}
            style={{ borderRadius: renk.radius, backgroundColor: renk.panel }}
          >
            <button type="button" className="sss-kart-tus" onClick={() => setAcik(acik === s.id ? null : s.id)} style={{ color: renk.baslik }}>
              {s.soru}
              <span style={{ color: renk.vurgu }}>{acik === s.id ? '−' : '+'}</span>
            </button>
            {acik === s.id && <p className="sss-kart-cevap" style={{ color: renk.metin }}>{s.cevap}</p>}
          </div>
        ))}
      </div>
    </>
  );
}

function YanMenuIcerik({ widget, cfg, sorular }: { widget: Widget; cfg: Cfg; sorular: WidgetSssOgesi[] }) {
  const renk = renkler(cfg, widget);
  const [secili, setSecili] = useState(sorular[0]?.id ?? '');
  const aktif = sorular.find((s) => s.id === secili) ?? sorular[0];

  return (
    <>
      <BolumBaslik widget={widget} cfg={cfg} />
      {cfg.solBaslik && (
        <p className="sss-sol-baslik" style={{ color: renk.vurgu }}>
          {cfg.solBaslik}
        </p>
      )}
      <div className="sss-yan-wrap">
        <nav className="sss-yan-menu">
          {sorular.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`sss-yan-menu-oge ${secili === s.id ? 'sss-yan-menu-aktif' : ''}`}
              style={{
                borderRadius: renk.radius,
                color: secili === s.id ? '#fff' : renk.baslik,
                backgroundColor: secili === s.id ? renk.vurgu : renk.panel,
                borderColor: secili === s.id ? renk.vurgu : 'rgba(15, 23, 42, 0.1)',
              }}
              onClick={() => setSecili(s.id)}
            >
              {s.soru}
            </button>
          ))}
        </nav>
        {aktif && (
          <div className="sss-yan-icerik" style={{ borderRadius: renk.radius, backgroundColor: renk.panel, borderColor: `${renk.vurgu}22` }}>
            <h3 style={{ color: renk.baslik }}>{aktif.soru}</h3>
            <p style={{ color: renk.metin }}>{aktif.cevap}</p>
          </div>
        )}
      </div>
    </>
  );
}

export function SssWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const sorular = cfg.sorular ?? [];
  const filtreler = cfg.filtreler ?? [];
  const gt = widgetGorunumTipiAl(widget);
  if (sorular.length === 0) return null;

  let icerik;
  switch (gt) {
    case 'iki-kolon-grid':
      icerik = <IkiKolonGrid widget={widget} cfg={cfg} sorular={sorular} />;
      break;
    case 'sekmeli-kategori':
      icerik = <SekmeliKategori widget={widget} cfg={cfg} sorular={sorular} filtreler={filtreler} />;
      break;
    case 'arama-filtre':
      icerik = <AramaFiltre widget={widget} cfg={cfg} sorular={sorular} />;
      break;
    case 'kart-destesi':
      icerik = <KartDestesi widget={widget} cfg={cfg} sorular={sorular} />;
      break;
    case 'yan-menu-icerik':
      icerik = <YanMenuIcerik widget={widget} cfg={cfg} sorular={sorular} />;
      break;
    default:
      icerik = <TekAcikOdak widget={widget} cfg={cfg} sorular={sorular} />;
  }

  return <WidgetKabuk widget={widget}>{icerik}</WidgetKabuk>;
}
