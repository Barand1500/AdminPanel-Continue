import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { WidgetBlok } from '@/types/blokOlusturucu';
import {
  blokGorselBoyutStili,
  blokOnizlemeMedyaStili,
  blokOnizlemeWrapperStili,
  olusturucuOku,
} from '@/types/blokOlusturucu';
import type { WidgetConfig } from '@/types/widget';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';
import type { Widget } from '@/types/site';

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

function ButonLink({
  href,
  metin,
  renk,
}: {
  href: string;
  metin: string;
  renk: string;
}) {
  const sinif =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90';
  if (href.startsWith('http')) {
    return (
      <a href={href} className={sinif} style={{ backgroundColor: renk }} target="_blank" rel="noreferrer">
        {metin}
      </a>
    );
  }
  return (
    <Link to={href} className={sinif} style={{ backgroundColor: renk }}>
      {metin}
    </Link>
  );
}

function BlokKabuk({ blok, children }: { blok: WidgetBlok; children: ReactNode }) {
  const wrap = blokOnizlemeWrapperStili(blok);
  const boyutlu =
    blok.blokGenislikPx != null ||
    blok.gorselYukseklikPx != null ||
    (blok.gorselGenislik != null && blok.gorselGenislik !== 'tam');
  if (!boyutlu) return <>{children}</>;
  return <div style={wrap}>{children}</div>;
}

function BlokRender({ blok, cfg }: { blok: WidgetBlok; cfg: WidgetConfig }) {
  const g = cfg.gorunum ?? {};
  const metinRenk = g.metinRengi ?? undefined;
  const baslikRenk = g.baslikRengi ?? undefined;
  const vurguRenk = g.vurguRengi ?? '#2563eb';
  const imgStil = blokOnizlemeMedyaStili(blok);
  const gorselStil = blokGorselBoyutStili(blok);

  const icerik = (() => {
  switch (blok.tip) {
    case 'baslik':
      return (
        <h3 className={baslikSinifi(cfg)} style={{ color: baslikRenk }}>
          {blok.metin || 'Başlık'}
        </h3>
      );
    case 'metin':
      return (
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: metinRenk }}>
          {blok.metin || ''}
        </p>
      );
    case 'gorsel': {
      const url = medyaUrl(blok.gorselUrl);
      if (!url) {
        return (
          <div className="flex items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400" style={{ height: imgStil.height, width: gorselStil.width }}>
            Görsel
          </div>
        );
      }
      return <img src={url} alt={blok.metin || ''} className="rounded-lg" style={gorselStil} />;
    }
    case 'video': {
      const kapak = medyaUrl(blok.videoKapakUrl);
      const href = blok.videoUrl || '#';
      return (
        <a href={href} target="_blank" rel="noreferrer" className="relative block overflow-hidden rounded-lg" style={{ width: gorselStil.width, maxWidth: '100%' }}>
          {kapak ? (
            <img src={kapak} alt={blok.metin || 'Video'} className="w-full rounded-lg object-cover" style={{ height: imgStil.height }} />
          ) : (
            <div className="flex w-full items-center justify-center rounded-lg bg-slate-800 text-white" style={{ height: imgStil.height }}>
              Video
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-4xl text-white">▶</span>
        </a>
      );
    }
    case 'tarih':
      return (
        <time className="text-xs font-medium uppercase tracking-wide text-slate-500" dateTime={blok.tarih}>
          {tarihFormatla(blok.tarih)}
        </time>
      );
    case 'buton':
      return <ButonLink href={blok.butonLink || '#'} metin={blok.butonMetni || 'Buton'} renk={vurguRenk} />;
    case 'bosluk':
      return <div style={{ height: blok.boslukPx ?? 16 }} aria-hidden />;
    case 'yildiz':
      return yildizGoster(blok.yildiz ?? 5, g.yildizRengi ?? '#facc15');
    case 'ikon_grup':
      return (
        <div className="flex flex-wrap gap-4">
          {(blok.ikonlar ?? []).map((o) => (
            <div key={o.id} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl leading-none">{o.ikon}</span>
              <span className="text-xs font-medium" style={{ color: metinRenk }}>{o.etiket}</span>
            </div>
          ))}
        </div>
      );
    case 'combobox':
      return (
        <label className="block w-full max-w-xs">
          {blok.comboboxEtiket && (
            <span className="mb-1 block text-xs font-medium" style={{ color: metinRenk }}>{blok.comboboxEtiket}</span>
          )}
          <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" defaultValue={blok.seciliSecenek ?? blok.secenekler?.[0]}>
            {(blok.secenekler ?? []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      );
    case 'toggle':
      return (
        <label className="inline-flex cursor-pointer items-center gap-3">
          <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full ${blok.toggleAcik ? 'bg-blue-600' : 'bg-slate-300'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${blok.toggleAcik ? 'left-[1.35rem]' : 'left-0.5'}`} />
          </span>
          <span className="text-sm font-medium" style={{ color: metinRenk }}>{blok.toggleEtiket || 'Toggle'}</span>
        </label>
      );
    case 'kart': {
      const href = blok.kartLink || '#';
      const dis = href.startsWith('http');
      const icerik = (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ borderRadius: g.borderRadius ?? 12 }}>
          {blok.kartGorselUrl ? (
            <img src={medyaUrl(blok.kartGorselUrl)} alt="" className="w-full rounded-t-xl object-cover" style={{ height: imgStil.height }} />
          ) : (
            <div className="flex items-center justify-center bg-slate-100 text-sm text-slate-400" style={{ height: imgStil.height }}>Kart görseli</div>
          )}
          <div className="p-4">
            <h4 className="font-semibold" style={{ color: baslikRenk }}>{blok.kartBaslik || 'Kart'}</h4>
            {blok.kartMetin && <p className="mt-1 text-sm leading-relaxed" style={{ color: metinRenk }}>{blok.kartMetin}</p>}
          </div>
        </div>
      );
      return dis ? (
        <a href={href} target="_blank" rel="noreferrer" className="block no-underline">{icerik}</a>
      ) : (
        <Link to={href} className="block no-underline">{icerik}</Link>
      );
    }
    case 'sayac':
      return (
        <div className="text-center">
          <p className="text-3xl font-bold" style={{ color: baslikRenk }}>
            {blok.sayacDeger ?? 0}{blok.sayacSonEk}
          </p>
          <p className="text-sm" style={{ color: metinRenk }}>{blok.sayacEtiket}</p>
        </div>
      );
    case 'fiyat':
      return (
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="font-semibold" style={{ color: baslikRenk }}>{blok.paketAd}</p>
          <p className="text-2xl font-bold" style={{ color: vurguRenk }}>{blok.fiyatMetin}</p>
          <ul className="mt-2 space-y-1 text-sm" style={{ color: metinRenk }}>
            {(blok.ozellikler ?? []).map((o) => (
              <li key={o}>✓ {o}</li>
            ))}
          </ul>
          {blok.butonMetni && (
            <div className="mt-3">
              <ButonLink href={blok.butonLink || '#'} metin={blok.butonMetni} renk={vurguRenk} />
            </div>
          )}
        </div>
      );
    case 'yorum_tek':
      return (
        <blockquote className="text-sm italic" style={{ color: metinRenk }}>
          {yildizGoster(blok.yildiz ?? 5, g.yildizRengi ?? '#facc15')}
          <p className="mt-2">{blok.yorumMetin}</p>
          <footer className="mt-2 text-xs not-italic font-semibold" style={{ color: baslikRenk }}>
            {blok.yorumAd}{blok.yorumFirma ? ` · ${blok.yorumFirma}` : ''}
          </footer>
        </blockquote>
      );
    case 'link_satir': {
      const href = blok.linkUrl || '#';
      const dis = href.startsWith('http');
      const sinif = 'inline-flex items-center gap-2 text-sm font-medium hover:underline';
      const icerik = (
        <>
          <span>{blok.linkIkon}</span>
          <span>{blok.linkMetin}</span>
        </>
      );
      return dis ? (
        <a href={href} className={sinif} style={{ color: vurguRenk }} target="_blank" rel="noreferrer">{icerik}</a>
      ) : (
        <Link to={href} className={sinif} style={{ color: vurguRenk }}>{icerik}</Link>
      );
    }
    case 'badge':
      return (
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          {blok.badgeMetin || 'Rozet'}
        </span>
      );
    case 'ayirici':
      return <hr className="border-slate-200" />;
    case 'liste':
      return (
        <ul className="list-inside list-disc space-y-1 text-sm" style={{ color: metinRenk }}>
          {(blok.listeSatirlari ?? []).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      );
    case 'cta_serit':
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium" style={{ color: metinRenk }}>{blok.ctaMetin}</p>
          <ButonLink href={blok.butonLink || '#'} metin={blok.butonMetni || 'Buton'} renk={vurguRenk} />
        </div>
      );
    default:
      return null;
  }
  })();

  return <BlokKabuk blok={blok}>{icerik}</BlokKabuk>;
}

export function BlokOlusturucuWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const olusturucu = olusturucuOku(cfg);
  if (!olusturucu.parcaSayisi || olusturucu.hucreler.length === 0) return null;

  const g = cfg.gorunum ?? {};
  const gap = g.kartAraligi === 'dar' ? '1rem' : g.kartAraligi === 'genis' ? '2rem' : '1.5rem';
  const radius = g.borderRadius ?? 12;
  const hizalama = g.hizalama ?? 'sol';
  const alignClass = hizalama === 'orta' ? 'text-center' : hizalama === 'sag' ? 'text-right' : 'text-left';
  const gridStyle =
    olusturucu.duzen === 'alt_alta'
      ? { display: 'grid', gridTemplateColumns: '1fr', gap }
      : { display: 'grid', gridTemplateColumns: `repeat(${olusturucu.parcaSayisi}, minmax(0, 1fr))`, gap };

  return (
    <WidgetKabuk widget={widget}>
      {(widget.baslik || widget.altBaslik || widget.aciklama) && (
        <div className={`mx-auto mb-10 max-w-2xl ${alignClass}`}>
          {widget.altBaslik && (
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
          )}
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: g.baslikRengi }}>
              {widget.baslik}
            </h2>
          )}
          {widget.aciklama && (
            <p className="mt-3 text-slate-600 whitespace-pre-line">{widget.aciklama}</p>
          )}
        </div>
      )}
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
            {hucre.bloklar.map((blok) => (
              <BlokRender key={blok.id} blok={blok} cfg={cfg} />
            ))}
          </div>
        ))}
      </div>
    </WidgetKabuk>
  );
}
