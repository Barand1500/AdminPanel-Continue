import { FormEvent, useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetIkonKart } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { publicFormGonder } from '@/features/site/formApi';

interface FormVeri {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  firma: string;
  rol: string;
}

const BOS_FORM: FormVeri = { ad: '', soyad: '', email: '', telefon: '', firma: '', rol: '' };

function renkler(cfg: WidgetConfig) {
  const g = cfg.gorunum ?? {};
  return {
    baslik: g.baslikRengi || '#0f172a',
    metin: g.metinRengi || '#64748b',
    vurgu: g.vurguRengi || g.baslikRengi || '#7c3aed',
    radius: g.borderRadius ?? 16,
  };
}

function OzellikGrid({
  ozellikler,
  vurgu,
  sinif = '',
}: {
  ozellikler: WidgetIkonKart[];
  vurgu: string;
  sinif?: string;
}) {
  if (ozellikler.length === 0) return null;
  return (
    <ul className={`ud-ozellik-grid ${sinif}`.trim()}>
      {ozellikler.map((o) => (
        <li key={o.id} className="ud-ozellik">
          <span className="ud-ozellik-ikon" style={{ color: vurgu, background: `${vurgu}14` }}>
            {o.ikon || '✓'}
          </span>
          <span className="ud-ozellik-metin">{o.metin}</span>
        </li>
      ))}
    </ul>
  );
}

function MetinBolumu({
  widget,
  renk,
  ortala = false,
  beyaz = false,
}: {
  widget: Widget;
  renk: ReturnType<typeof renkler>;
  ortala?: boolean;
  beyaz?: boolean;
}) {
  return (
    <div className={ortala ? 'ud-metin-ortala' : ''}>
      {widget.baslik && (
        <h2 className="ud-baslik" style={{ color: beyaz ? '#fff' : renk.baslik }}>
          {widget.baslik}
        </h2>
      )}
      {widget.aciklama && (
        <p className="ud-aciklama" style={{ color: beyaz ? 'rgba(255,255,255,0.88)' : renk.metin }}>
          {widget.aciklama}
        </p>
      )}
    </div>
  );
}

function DenemeFormu({
  cfg,
  widget,
  renk,
  veri,
  setVeri,
  gonder,
  gonderiliyor,
  hata,
  basari,
  sinif = '',
}: {
  cfg: WidgetConfig;
  widget: Widget;
  renk: ReturnType<typeof renkler>;
  veri: FormVeri;
  setVeri: (v: FormVeri) => void;
  gonder: (e: FormEvent) => void;
  gonderiliyor: boolean;
  hata: string;
  basari: boolean;
  sinif?: string;
}) {
  const roller = cfg.rolSecenekleri ?? [];

  return (
    <form onSubmit={gonder} className={`ud-form ${sinif}`.trim()} style={{ borderRadius: renk.radius }}>
      <div className="ud-form-satir">
        <input
          type="text"
          required
          placeholder="Adınız"
          value={veri.ad}
          onChange={(e) => setVeri({ ...veri, ad: e.target.value })}
          className="ud-input"
        />
        <input
          type="text"
          required
          placeholder="Soyadınız"
          value={veri.soyad}
          onChange={(e) => setVeri({ ...veri, soyad: e.target.value })}
          className="ud-input"
        />
      </div>
      <input
        type="email"
        required
        placeholder="E-mail Adresiniz"
        value={veri.email}
        onChange={(e) => setVeri({ ...veri, email: e.target.value })}
        className="ud-input"
      />
      <input
        type="tel"
        required
        placeholder="İş / Cep Telefonunuz"
        value={veri.telefon}
        onChange={(e) => setVeri({ ...veri, telefon: e.target.value })}
        className="ud-input"
      />
      <input
        type="text"
        placeholder="Firma/Kurum Adınız (Yoksa boş bırakınız)"
        value={veri.firma}
        onChange={(e) => setVeri({ ...veri, firma: e.target.value })}
        className="ud-input"
      />
      {roller.length > 0 && (
        <select
          required
          value={veri.rol}
          onChange={(e) => setVeri({ ...veri, rol: e.target.value })}
          className="ud-input ud-select"
        >
          <option value="">İşinizdeki rolünüz nedir?</option>
          {roller.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      )}
      <button
        type="submit"
        disabled={gonderiliyor}
        className="ud-submit"
        style={{ backgroundColor: renk.vurgu, borderRadius: 9999 }}
      >
        {widget.butonMetni || 'Şimdi Ücretsiz Deneyin'}
      </button>
      {cfg.bultenKvkk && <p className="ud-kvkk">{cfg.bultenKvkk}</p>}
      {hata && <p className="ud-hata">{hata}</p>}
      {basari && <p className="ud-basari">Teşekkürler! Talebiniz alındı, en kısa sürede sizinle iletişime geçeceğiz.</p>}
    </form>
  );
}

type OrtakProps = {
  widget: Widget;
  cfg: WidgetConfig;
  renk: ReturnType<typeof renkler>;
  ozellikler: WidgetIkonKart[];
  ozellikGoster: boolean;
  veri: FormVeri;
  setVeri: (v: FormVeri) => void;
  gonder: (e: FormEvent) => void;
  gonderiliyor: boolean;
  hata: string;
  basari: boolean;
};

function SplitFormSol(p: OrtakProps) {
  return (
    <div className="ud-split" style={{ borderRadius: p.renk.radius }}>
      <div className="ud-split-grid">
        <div className="ud-split-sol">
          <MetinBolumu widget={p.widget} renk={p.renk} />
          {p.ozellikGoster && <OzellikGrid ozellikler={p.ozellikler} vurgu={p.renk.vurgu} />}
        </div>
        <div className="ud-split-sag">
          <DenemeFormu {...p} cfg={p.cfg} widget={p.widget} renk={p.renk} sinif="ud-form--kart" />
        </div>
      </div>
    </div>
  );
}

function SplitFormTers(p: OrtakProps) {
  return (
    <div className="ud-split" style={{ borderRadius: p.renk.radius }}>
      <div className="ud-split-grid ud-split-grid--ters">
        <div className="ud-split-sol">
          <DenemeFormu {...p} cfg={p.cfg} widget={p.widget} renk={p.renk} sinif="ud-form--kart" />
        </div>
        <div className="ud-split-sag">
          <MetinBolumu widget={p.widget} renk={p.renk} />
          {p.ozellikGoster && <OzellikGrid ozellikler={p.ozellikler} vurgu={p.renk.vurgu} />}
        </div>
      </div>
    </div>
  );
}

function DikeyOrtali(p: OrtakProps) {
  return (
    <div className="ud-dikey" style={{ borderRadius: p.renk.radius }}>
      <MetinBolumu widget={p.widget} renk={p.renk} ortala />
      {p.ozellikGoster && <OzellikGrid ozellikler={p.ozellikler} vurgu={p.renk.vurgu} sinif="ud-ozellik-grid--ortala" />}
      <div className="ud-dikey-form">
        <DenemeFormu {...p} cfg={p.cfg} widget={p.widget} renk={p.renk} sinif="ud-form--kart ud-form--dar" />
      </div>
    </div>
  );
}

function MinimalOrtali(p: OrtakProps) {
  return (
    <div className="ud-minimal" style={{ borderRadius: p.renk.radius }}>
      <MetinBolumu widget={p.widget} renk={p.renk} ortala />
      <div className="ud-dikey-form">
        <DenemeFormu {...p} cfg={p.cfg} widget={p.widget} renk={p.renk} sinif="ud-form--kart ud-form--dar" />
      </div>
    </div>
  );
}

function BlobArkaplan(p: OrtakProps) {
  return (
    <div className="ud-blob-wrap">
      <div className="ud-blob ud-blob--sol" style={{ background: `${p.renk.vurgu}18` }} aria-hidden />
      <div className="ud-blob ud-blob--sag" style={{ background: `${p.renk.vurgu}10` }} aria-hidden />
      <div className="ud-blob-kart" style={{ borderRadius: p.renk.radius }}>
        <div className="ud-split-grid">
          <div className="ud-split-sol">
            <MetinBolumu widget={p.widget} renk={p.renk} />
            {p.ozellikGoster && <OzellikGrid ozellikler={p.ozellikler} vurgu={p.renk.vurgu} />}
          </div>
          <div className="ud-split-sag">
            <DenemeFormu {...p} cfg={p.cfg} widget={p.widget} renk={p.renk} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KartGolge(p: OrtakProps) {
  return (
    <div className="ud-kart-golge" style={{ borderRadius: p.renk.radius }}>
      <div className="ud-kart-golge-ic" style={{ borderRadius: p.renk.radius }}>
        <div className="ud-split-grid">
          <div className="ud-split-sol">
            <MetinBolumu widget={p.widget} renk={p.renk} />
            {p.ozellikGoster && <OzellikGrid ozellikler={p.ozellikler} vurgu={p.renk.vurgu} />}
          </div>
          <div className="ud-split-sag">
            <DenemeFormu {...p} cfg={p.cfg} widget={p.widget} renk={p.renk} sinif="ud-form--duz" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function UcretsizDenemeWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const gt = widgetGorunumTipiAl(widget);
  const renk = renkler(cfg);
  const ozellikler = cfg.ikonKartlar ?? [];
  const ozellikGoster = gt !== 'minimal-ortali';

  const [veri, setVeri] = useState<FormVeri>(BOS_FORM);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [basari, setBasari] = useState(false);
  const [hata, setHata] = useState('');

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true);
    setHata('');
    try {
      await publicFormGonder(cfg.formSlug ?? 'ucretsiz-deneme', { ...veri });
      setBasari(true);
      setVeri(BOS_FORM);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setGonderiliyor(false);
    }
  }

  const ortak: OrtakProps = {
    widget,
    cfg,
    renk,
    ozellikler,
    ozellikGoster,
    veri,
    setVeri,
    gonder,
    gonderiliyor,
    hata,
    basari,
  };

  let govde;
  switch (gt) {
    case 'split-form-ters':
      govde = <SplitFormTers {...ortak} />;
      break;
    case 'dikey-ortali':
      govde = <DikeyOrtali {...ortak} />;
      break;
    case 'minimal-ortali':
      govde = <MinimalOrtali {...ortak} />;
      break;
    case 'blob-arkaplan':
      govde = <BlobArkaplan {...ortak} />;
      break;
    case 'kart-golge':
      govde = <KartGolge {...ortak} />;
      break;
    default:
      govde = <SplitFormSol {...ortak} />;
  }

  return <WidgetKabuk widget={widget}>{govde}</WidgetKabuk>;
}
