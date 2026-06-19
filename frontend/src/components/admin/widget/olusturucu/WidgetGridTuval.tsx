import type { BlokHucre, BlokOlusturucuConfig, WidgetBlok } from '@/types/blokOlusturucu';
import { blokOnizlemeMedyaStili } from '@/types/blokOlusturucu';
import { BlokBoyutSurukle } from './BlokBoyutSurukle';

interface WidgetGridTuvalProps {
  olusturucu: BlokOlusturucuConfig;
  aktifHucreId: string | null;
  seciliBlokId: string | null;
  onHucreSec: (hucreId: string) => void;
  onBlokSec: (hucreId: string, blokId: string) => void;
  onBlokSil: (hucreId: string, blokId: string) => void;
  onBlokGuncelle?: (blok: WidgetBlok) => void;
}

function BlokOnizleme({ blok }: { blok: WidgetBlok }) {
  const imgStil = blokOnizlemeMedyaStili(blok);

  switch (blok.tip) {
    case 'baslik':
      return <strong className="block text-sm">{blok.metin || 'Başlık'}</strong>;
    case 'metin':
      return <span className="block text-xs text-slate-500 line-clamp-2">{blok.metin || 'Metin'}</span>;
    case 'gorsel':
      return blok.gorselUrl ? (
        <img src={blok.gorselUrl} alt="" className="ap-blok-gorsel-img rounded object-cover" style={imgStil} />
      ) : (
        <div
          className="flex items-center justify-center rounded bg-slate-100 text-xs text-slate-400"
          style={{ height: imgStil.height, width: '100%' }}
        >
          Görsel
        </div>
      );
    case 'video':
      return blok.videoKapakUrl ? (
        <img src={blok.videoKapakUrl} alt="" className="ap-blok-gorsel-img rounded object-cover" style={imgStil} />
      ) : (
        <div
          className="flex items-center justify-center rounded bg-slate-800 text-xs text-white"
          style={{ height: imgStil.height, width: '100%' }}
        >
          Video kapak
        </div>
      );
    case 'tarih':
      return <span className="text-xs text-slate-500">{blok.tarih || 'Tarih'}</span>;
    case 'buton':
      return (
        <span className="inline-block rounded bg-blue-600 px-2 py-1 text-xs text-white">
          {blok.butonMetni || 'Buton'}
        </span>
      );
    case 'bosluk':
      return <span className="text-xs text-slate-400">Boşluk {blok.boslukPx ?? 16}px</span>;
    case 'yildiz':
      return <span className="text-amber-400 text-sm">{'★'.repeat(Math.min(5, blok.yildiz ?? 5))}</span>;
    case 'ikon_grup':
      return (
        <div className="flex flex-wrap gap-1">
          {(blok.ikonlar ?? []).slice(0, 4).map((o) => (
            <span key={o.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
              {o.ikon} {o.etiket}
            </span>
          ))}
        </div>
      );
    case 'combobox':
      return (
        <span className="block text-xs text-slate-500">
          ▾ {blok.comboboxEtiket || 'Combobox'} ({(blok.secenekler ?? []).length} seçenek)
        </span>
      );
    case 'toggle':
      return (
        <span className="text-xs text-slate-500">
          ◉ {blok.toggleEtiket || 'Toggle'} {blok.toggleAcik ? '(açık)' : '(kapalı)'}
        </span>
      );
    case 'kart':
      return (
        <div className="rounded border border-slate-200 p-1 text-xs">
          {blok.kartGorselUrl ? (
            <img src={blok.kartGorselUrl} alt="" className="w-full rounded object-cover" style={{ height: imgStil.height }} />
          ) : (
            <div
              className="flex items-center justify-center rounded bg-slate-100 text-slate-400"
              style={{ height: imgStil.height }}
            >
              Kart görseli
            </div>
          )}
          <strong className="mt-1 block">{blok.kartBaslik || 'Kart'}</strong>
          <span className="text-slate-500 line-clamp-1">{blok.kartMetin || ''}</span>
        </div>
      );
    case 'sayac':
      return (
        <span className="text-xs">
          <strong>{blok.sayacDeger ?? 0}{blok.sayacSonEk}</strong> {blok.sayacEtiket}
        </span>
      );
    case 'fiyat':
      return (
        <span className="text-xs">
          {blok.paketAd} — <strong>{blok.fiyatMetin}</strong>
        </span>
      );
    case 'yorum_tek':
      return (
        <span className="block text-xs text-slate-500 line-clamp-2">
          ★ {blok.yorumMetin?.slice(0, 60) || 'Yorum'}
        </span>
      );
    case 'link_satir':
      return (
        <span className="text-xs">
          {blok.linkIkon} {blok.linkMetin}
        </span>
      );
    case 'badge':
      return (
        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
          {blok.badgeMetin || 'Rozet'}
        </span>
      );
    case 'ayirici':
      return <hr className="my-1 border-slate-200" />;
    case 'liste':
      return (
        <ul className="list-inside list-disc text-xs text-slate-500">
          {(blok.listeSatirlari ?? []).slice(0, 3).map((s) => (
            <li key={s} className="truncate">
              {s}
            </li>
          ))}
        </ul>
      );
    case 'cta_serit':
      return (
        <span className="text-xs text-slate-500">
          {blok.ctaMetin?.slice(0, 40)} → {blok.butonMetni}
        </span>
      );
    default:
      return null;
  }
}

export function WidgetGridTuval({
  olusturucu,
  aktifHucreId,
  seciliBlokId,
  onHucreSec,
  onBlokSec,
  onBlokSil,
  onBlokGuncelle,
}: WidgetGridTuvalProps) {
  const gridYok = !olusturucu.parcaSayisi;

  const gridClass =
    olusturucu.duzen === 'alt_alta'
      ? 'ap-olusturucu-grid ap-olusturucu-grid-dikey'
      : `ap-olusturucu-grid ap-olusturucu-grid-yatay ap-olusturucu-kolon-${olusturucu.parcaSayisi}`;

  return (
    <div className="ap-olusturucu-tuval ap-scroll">
      {gridYok ? (
        <div className="ap-olusturucu-bos">
          <p className="ap-muted text-sm">Boş widget</p>
          <p className="ap-muted mt-1 text-xs">Sağ panelden parça sayısı seçin.</p>
        </div>
      ) : (
        <div className={gridClass}>
          {olusturucu.hucreler.map((hucre, index) => (
            <HucreKutu
              key={hucre.id}
              hucre={hucre}
              index={index}
              aktif={aktifHucreId === hucre.id}
              seciliBlokId={seciliBlokId}
              onHucreSec={() => onHucreSec(hucre.id)}
              onBlokSec={(blokId) => onBlokSec(hucre.id, blokId)}
              onBlokSil={(blokId) => onBlokSil(hucre.id, blokId)}
              onBlokGuncelle={onBlokGuncelle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HucreKutu({
  hucre,
  index,
  aktif,
  seciliBlokId,
  onHucreSec,
  onBlokSec,
  onBlokSil,
  onBlokGuncelle,
}: {
  hucre: BlokHucre;
  index: number;
  aktif: boolean;
  seciliBlokId: string | null;
  onHucreSec: () => void;
  onBlokSec: (blokId: string) => void;
  onBlokSil: (blokId: string) => void;
  onBlokGuncelle?: (blok: WidgetBlok) => void;
}) {
  return (
    <button
      type="button"
      className={`ap-olusturucu-hucre${aktif ? ' aktif' : ''}${hucre.bloklar.length === 0 ? ' bos' : ''}`}
      onClick={onHucreSec}
    >
      <span className="ap-olusturucu-hucre-no">Parça {index + 1}</span>
      {hucre.bloklar.length === 0 ? (
        <span className="ap-muted text-xs">Parça eklemek için seçin</span>
      ) : (
        <div className="ap-olusturucu-blok-liste" onClick={(e) => e.stopPropagation()}>
          {hucre.bloklar.map((blok) => {
            const secili = seciliBlokId === blok.id;
            return (
              <div
                key={blok.id}
                className={`ap-olusturucu-blok${secili ? ' secili' : ''}`}
                onClick={() => onBlokSec(blok.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onBlokSec(blok.id);
                }}
              >
                <BlokBoyutSurukle
                  blok={blok}
                  secili={secili}
                  onBoyutDegistir={(g, y) => {
                    if (!onBlokGuncelle) return;
                    const patch: Partial<WidgetBlok> = {};
                    if (g != null) patch.blokGenislikPx = g;
                    if (y != null) patch.gorselYukseklikPx = y;
                    onBlokGuncelle({ ...blok, ...patch });
                  }}
                >
                  <BlokOnizleme blok={blok} />
                </BlokBoyutSurukle>
                <button
                  type="button"
                  className="ap-olusturucu-blok-sil"
                  aria-label="Parçayı sil"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlokSil(blok.id);
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </button>
  );
}
