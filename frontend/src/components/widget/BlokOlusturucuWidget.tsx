import { Link } from 'react-router-dom';
import type { WidgetBlok } from '@/types/blokOlusturucu';
import type { WidgetConfig } from '@/types/widget';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';
import type { Widget } from '@/types/site';
import { olusturucuOku } from '@/types/blokOlusturucu';

function yildizGoster(puan: number, renk: string) {
  const p = Math.min(5, Math.max(0, Math.round(puan)));
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-base leading-none" style={{ color: i < p ? renk : '#e2e8f0' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function tarihFormatla(tarih?: string) {
  if (!tarih) return '';
  try {
    return new Date(tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return tarih;
  }
}

function BlokRender({ blok, cfg }: { blok: WidgetBlok; cfg: WidgetConfig }) {
  const g = cfg.gorunum ?? {};
  const metinRenk = g.metinRengi ?? undefined;
  const baslikRenk = g.baslikRengi ?? undefined;
  const vurguRenk = g.vurguRengi ?? '#2563eb';

  switch (blok.tip) {
    case 'baslik':
      return (
        <h3 className={baslikSinifi(cfg)} style={{ color: baslikRenk }}>
          {blok.metin || 'Başlık'}
        </h3>
      );
    case 'metin':
      return (
        <p className="text-sm leading-relaxed" style={{ color: metinRenk }}>
          {blok.metin || ''}
        </p>
      );
    case 'gorsel': {
      const url = medyaUrl(blok.gorselUrl);
      if (!url) {
        return (
          <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
            Görsel
          </div>
        );
      }
      return <img src={url} alt={blok.metin || ''} className={gorselSinifi(cfg)} />;
    }
    case 'tarih':
      return (
        <time className="text-xs font-medium uppercase tracking-wide text-slate-500" dateTime={blok.tarih}>
          {tarihFormatla(blok.tarih)}
        </time>
      );
    case 'buton': {
      const href = blok.butonLink || '#';
      const dis = href.startsWith('http');
      const sinif =
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90';
      if (dis) {
        return (
          <a href={href} className={sinif} style={{ backgroundColor: vurguRenk }} target="_blank" rel="noreferrer">
            {blok.butonMetni || 'Buton'}
          </a>
        );
      }
      return (
        <Link to={href} className={sinif} style={{ backgroundColor: vurguRenk }}>
          {blok.butonMetni || 'Buton'}
        </Link>
      );
    }
    case 'bosluk':
      return <div style={{ height: blok.boslukPx ?? 16 }} aria-hidden />;
    case 'yildiz':
      return yildizGoster(blok.yildiz ?? 5, g.yildizRengi ?? '#facc15');
    case 'ikon_grup':
      return (
        <div className="flex flex-wrap gap-3">
          {(blok.ikonlar ?? []).map((o) => (
            <div key={o.id} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl leading-none" aria-hidden>
                {o.ikon}
              </span>
              <span className="text-xs font-medium" style={{ color: metinRenk }}>
                {o.etiket}
              </span>
            </div>
          ))}
        </div>
      );
    case 'combobox':
      return (
        <label className="block w-full max-w-xs">
          {blok.comboboxEtiket && (
            <span className="mb-1 block text-xs font-medium" style={{ color: metinRenk }}>
              {blok.comboboxEtiket}
            </span>
          )}
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            defaultValue={blok.seciliSecenek ?? blok.secenekler?.[0]}
          >
            {(blok.secenekler ?? []).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      );
    case 'toggle':
      return (
        <label className="inline-flex cursor-pointer items-center gap-3">
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${blok.toggleAcik ? 'bg-blue-600' : 'bg-slate-300'}`}
            aria-hidden
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${blok.toggleAcik ? 'left-[1.35rem]' : 'left-0.5'}`}
            />
          </span>
          <span className="text-sm font-medium" style={{ color: metinRenk }}>
            {blok.toggleEtiket || 'Toggle'}
          </span>
        </label>
      );
    case 'kart': {
      const href = blok.kartLink || '#';
      const dis = href.startsWith('http');
      const icerik = (
        <div
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          style={{ borderRadius: g.borderRadius ?? 12 }}
        >
          {blok.kartGorselUrl ? (
            <img src={medyaUrl(blok.kartGorselUrl)} alt="" className="h-36 w-full object-cover" />
          ) : (
            <div className="flex h-24 items-center justify-center bg-slate-100 text-sm text-slate-400">Kart görseli</div>
          )}
          <div className="p-4">
            <h4 className="font-semibold" style={{ color: baslikRenk }}>
              {blok.kartBaslik || 'Kart'}
            </h4>
            {blok.kartMetin && (
              <p className="mt-1 text-sm leading-relaxed" style={{ color: metinRenk }}>
                {blok.kartMetin}
              </p>
            )}
          </div>
        </div>
      );
      if (dis) {
        return (
          <a href={href} target="_blank" rel="noreferrer" className="block no-underline">
            {icerik}
          </a>
        );
      }
      return (
        <Link to={href} className="block no-underline">
          {icerik}
        </Link>
      );
    }
    default:
      return null;
  }
}

export function BlokOlusturucuWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const olusturucu = olusturucuOku(cfg);
  if (!olusturucu.parcaSayisi || olusturucu.hucreler.length === 0) return null;

  const g = cfg.gorunum ?? {};
  const gap = g.kartAraligi === 'dar' ? '1rem' : g.kartAraligi === 'genis' ? '2rem' : '1.5rem';
  const radius = g.borderRadius ?? 12;
  const gridStyle =
    olusturucu.duzen === 'alt_alta'
      ? { display: 'grid', gridTemplateColumns: '1fr', gap }
      : { display: 'grid', gridTemplateColumns: `repeat(${olusturucu.parcaSayisi}, minmax(0, 1fr))`, gap };

  return (
    <WidgetKabuk widget={widget}>
      <div style={gridStyle}>
        {olusturucu.hucreler.map((hucre) => (
          <div
            key={hucre.id}
            className="flex flex-col gap-3 p-4"
            style={{
              borderRadius: radius,
              backgroundColor: g.kartFooterArkaPlan ?? '#f8fafc',
              boxShadow: g.kartGolge !== false ? '0 1px 3px rgba(15,23,42,0.08)' : undefined,
            }}
          >
            {hucre.bloklar.length === 0 ? null : hucre.bloklar.map((blok) => (
              <BlokRender key={blok.id} blok={blok} cfg={cfg} />
            ))}
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
