import type { BlokHucre, BlokOlusturucuConfig, WidgetBlok } from '@/types/blokOlusturucu';

interface WidgetGridTuvalProps {
  olusturucu: BlokOlusturucuConfig;
  aktifHucreId: string | null;
  seciliBlokId: string | null;
  onHucreSec: (hucreId: string) => void;
  onBlokSec: (hucreId: string, blokId: string) => void;
  onBlokSil: (hucreId: string, blokId: string) => void;
}

function BlokOnizleme({ blok }: { blok: WidgetBlok }) {
  switch (blok.tip) {
    case 'baslik':
      return <strong className="block text-sm">{blok.metin || 'Başlık'}</strong>;
    case 'metin':
      return <span className="block text-xs text-slate-500 line-clamp-2">{blok.metin || 'Metin'}</span>;
    case 'gorsel':
      return blok.gorselUrl ? (
        <img src={blok.gorselUrl} alt="" className="h-16 w-full rounded object-cover" />
      ) : (
        <div className="flex h-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">Görsel</div>
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
        <div className="rounded border border-slate-200 p-1.5 text-xs">
          <strong className="block">{blok.kartBaslik || 'Kart'}</strong>
          <span className="text-slate-500 line-clamp-1">{blok.kartMetin || ''}</span>
        </div>
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
}: WidgetGridTuvalProps) {
  const gridYok = !olusturucu.parcaSayisi;

  const gridClass =
    olusturucu.duzen === 'alt_alta'
      ? 'ap-olusturucu-grid ap-olusturucu-grid-dikey'
      : `ap-olusturucu-grid ap-olusturucu-grid-yatay ap-olusturucu-kolon-${olusturucu.parcaSayisi}`;

  return (
    <div className="ap-olusturucu-tuval">
      {gridYok ? (
        <div className="ap-olusturucu-bos">
          <p className="ap-muted text-sm">Boş widget</p>
          <p className="ap-muted mt-1 text-xs">Alttan parça sayısı ve yerleşim seçin.</p>
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
}: {
  hucre: BlokHucre;
  index: number;
  aktif: boolean;
  seciliBlokId: string | null;
  onHucreSec: () => void;
  onBlokSec: (blokId: string) => void;
  onBlokSil: (blokId: string) => void;
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
          {hucre.bloklar.map((blok) => (
            <div
              key={blok.id}
              className={`ap-olusturucu-blok${seciliBlokId === blok.id ? ' secili' : ''}`}
              onClick={() => onBlokSec(blok.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onBlokSec(blok.id);
              }}
            >
              <BlokOnizleme blok={blok} />
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
          ))}
        </div>
      )}
    </button>
  );
}
