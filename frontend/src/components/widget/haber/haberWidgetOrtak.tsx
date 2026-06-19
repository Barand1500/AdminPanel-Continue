import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { WidgetGorunumAyarlari } from '@/types/widget';
import type { GorselKonumu, KartStili, SayfalamaStili } from '@/types/haberWidget';
import { medyaUrl } from '../widgetHelpers';

export function haberVurguRengi(g: WidgetGorunumAyarlari, fallback = '#dc2626') {
  return g.vurguRengi || g.baslikRengi || fallback;
}

export function HaberBolumBaslik({
  baslik,
  ikon,
  tumunuMetin,
  tumunuLink,
  g,
}: {
  baslik?: string | null;
  ikon?: string;
  tumunuMetin?: string;
  tumunuLink?: string;
  g: WidgetGorunumAyarlari;
}) {
  if (!baslik) return null;
  const renk = haberVurguRengi(g);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {ikon && (
            <span
              className="flex h-8 w-8 items-center justify-center rounded text-sm text-white"
              style={{ backgroundColor: renk }}
            >
              {ikon}
            </span>
          )}
          <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: renk }}>
            {baslik}
          </h2>
        </div>
        {tumunuMetin && tumunuLink && (
          <Link to={tumunuLink} className="text-xs font-semibold uppercase text-slate-500 hover:underline">
            {tumunuMetin}
          </Link>
        )}
      </div>
      {g.baslikCizgi !== false && (
        <div className="mt-2 h-0.5 w-full bg-slate-200">
          <div className="h-full w-24" style={{ backgroundColor: renk }} />
        </div>
      )}
    </div>
  );
}

export function WidgetSayfalama({
  toplam,
  aktif,
  stil,
  vurguRenk,
  onSec,
  onOnceki,
  onSonraki,
}: {
  toplam: number;
  aktif: number;
  stil?: SayfalamaStili;
  vurguRenk: string;
  onSec: (i: number) => void;
  onOnceki?: () => void;
  onSonraki?: () => void;
}) {
  if (toplam <= 1 || stil === 'yok') return null;

  if (stil === 'ok') {
    return (
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" onClick={onOnceki} className="rounded border px-3 py-1 text-sm">‹</button>
        <button type="button" onClick={onSonraki} className="rounded border px-3 py-1 text-sm">›</button>
      </div>
    );
  }

  if (stil === 'numara') {
    return (
      <div className="mt-3 flex flex-wrap justify-center gap-1 border-t pt-2" style={{ borderColor: `${vurguRenk}33` }}>
        {Array.from({ length: toplam }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSec(i)}
            className="min-w-[2rem] rounded px-2 py-1 text-sm font-semibold transition"
            style={
              i === aktif
                ? { backgroundColor: vurguRenk, color: '#fff' }
                : { backgroundColor: '#f1f5f9', color: '#64748b' }
            }
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }

  if (stil === 'thumbnail') {
    return (
      <div className="mt-3 flex justify-center gap-2">
        {Array.from({ length: toplam }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSec(i)}
            className="h-2 w-8 rounded-full transition"
            style={{ backgroundColor: i === aktif ? vurguRenk : '#cbd5e1' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 flex justify-center gap-2">
      {Array.from({ length: toplam }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSec(i)}
          className="h-2.5 w-2.5 rounded-full transition"
          style={{ backgroundColor: i === aktif ? vurguRenk : '#cbd5e1' }}
        />
      ))}
    </div>
  );
}

export function HaberMeta({ tarih, yorum }: { tarih?: string; yorum?: number }) {
  if (!tarih && yorum == null) return null;
  return (
    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
      {tarih && <span>📅 {tarih}</span>}
      {yorum != null && <span>💬 {yorum}</span>}
    </div>
  );
}

export function HaberKartGovde({
  kart,
  gorselKonumu,
  kartStili,
  g,
}: {
  kart: { baslik: string; ozet?: string; gorselUrl?: string; link?: string; tarih?: string; yorumSayisi?: number; badge?: string };
  gorselKonumu?: GorselKonumu;
  kartStili?: KartStili;
  g: WidgetGorunumAyarlari;
}) {
  const stil = kartStili ?? g.kartStili ?? 'duz';
  const konum = gorselKonumu ?? g.gorselKonumu ?? 'sol';
  const href = kart.link?.trim();
  const sinifOverlay = 'group relative block overflow-hidden rounded-lg';
  const sinifKart = `flex gap-3 overflow-hidden rounded-lg border border-slate-100 bg-white p-2 transition hover:shadow-md ${yataySinif(konum)}`;

  const gorsel = kart.gorselUrl ? (
    <img src={medyaUrl(kart.gorselUrl)} alt="" className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full min-h-[80px] w-full items-center justify-center bg-slate-200 text-slate-400">📷</div>
  );

  if (stil === 'overlay' || konum === 'arkaplan') {
    const icerik = (
      <>
        <div className="aspect-[16/10]">{gorsel}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {kart.badge && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
            {kart.badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="font-bold leading-snug" style={{ color: g.baslikRengi || undefined }}>{kart.baslik}</p>
          <HaberMeta tarih={kart.tarih} yorum={kart.yorumSayisi} />
        </div>
      </>
    );
    return href ? (
      <Link to={href} className={sinifOverlay}>{icerik}</Link>
    ) : (
      <div className={sinifOverlay}>{icerik}</div>
    );
  }

  const yatay = konum === 'sol' || konum === 'sag';
  const flexDir =
    konum === 'sag' ? 'flex-row-reverse' :
    konum === 'alt' ? 'flex-col-reverse' :
    konum === 'ust' ? 'flex-col' :
    'flex-row';

  const govde = (
    <>
      <div className={yatay ? 'h-20 w-28 shrink-0 overflow-hidden rounded-md' : 'aspect-video w-full overflow-hidden rounded-md'}>
        {gorsel}
      </div>
      <div className="min-w-0 flex-1 py-1">
        <p className="font-bold leading-snug text-slate-900" style={{ color: g.baslikRengi || undefined }}>
          {kart.baslik}
        </p>
        {kart.ozet && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{kart.ozet}</p>}
        <HaberMeta tarih={kart.tarih} yorum={kart.yorumSayisi} />
      </div>
    </>
  );

  return href ? (
    <Link to={href} className={sinifKart} style={{ flexDirection: flexDir as CSSProperties['flexDirection'] }}>
      {govde}
    </Link>
  ) : (
    <div className={sinifKart} style={{ flexDirection: flexDir as CSSProperties['flexDirection'] }}>
      {govde}
    </div>
  );
}

function yataySinif(konum: GorselKonumu) {
  const yatay = konum === 'sol' || konum === 'sag';
  return yatay ? 'items-start' : '';
}
