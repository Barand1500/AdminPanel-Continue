import type { BlokDuzen, ParcaGorunum } from '@/types/blokOlusturucu';

interface WidgetGridAltBarProps {
  parcaSayisi: 0 | 1 | 2 | 3 | 4;
  duzen: BlokDuzen;
  parcaGorunum: ParcaGorunum;
  onParcaSayisi: (sayi: 1 | 2 | 3 | 4) => void;
  onDuzen: (duzen: BlokDuzen) => void;
  onParcaGorunum: (gorunum: ParcaGorunum) => void;
  kompakt?: boolean;
}

const PARCA_SECENEKLERI: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

function satirSutunOzeti(parcaSayisi: number, duzen: BlokDuzen): string {
  if (parcaSayisi < 1) return '';
  if (duzen === 'yan_yana') return `1 satır × ${parcaSayisi} sütun`;
  return `${parcaSayisi} satır × 1 sütun`;
}

export function WidgetGridAltBar({
  parcaSayisi,
  duzen,
  parcaGorunum,
  onParcaSayisi,
  onDuzen,
  onParcaGorunum,
  kompakt = false,
}: WidgetGridAltBarProps) {
  return (
    <div className={`ap-olusturucu-alt-bar${kompakt ? ' ap-olusturucu-alt-bar-kompakt' : ''}`}>
      <div className="ap-olusturucu-alt-grup">
        <span className="ap-olusturucu-alt-etiket">
          Satır × Sütun
          {parcaSayisi > 0 && (
            <span className="ap-olusturucu-alt-ozet"> ({satirSutunOzeti(parcaSayisi, duzen)})</span>
          )}
        </span>
        <div className="ap-olusturucu-segment">
          {PARCA_SECENEKLERI.map((n) => (
            <button
              key={n}
              type="button"
              className={`ap-olusturucu-segment-btn${parcaSayisi === n ? ' aktif' : ''}`}
              onClick={() => onParcaSayisi(n)}
              title={satirSutunOzeti(n, duzen)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="ap-olusturucu-alt-grup">
        <span className="ap-olusturucu-alt-etiket">Yerleşim</span>
        <div className="ap-olusturucu-segment">
          <button
            type="button"
            className={`ap-olusturucu-segment-btn${duzen === 'yan_yana' ? ' aktif' : ''}`}
            onClick={() => onDuzen('yan_yana')}
          >
            Yan yana
          </button>
          <button
            type="button"
            className={`ap-olusturucu-segment-btn${duzen === 'alt_alta' ? ' aktif' : ''}`}
            onClick={() => onDuzen('alt_alta')}
          >
            Alt alta
          </button>
        </div>
      </div>
      <div className="ap-olusturucu-alt-grup">
        <span className="ap-olusturucu-alt-etiket">Parça kutusu</span>
        <div className="ap-olusturucu-segment">
          <button
            type="button"
            className={`ap-olusturucu-segment-btn${parcaGorunum === 'birlesik' ? ' aktif' : ''}`}
            onClick={() => onParcaGorunum('birlesik')}
          >
            Birleşik
          </button>
          <button
            type="button"
            className={`ap-olusturucu-segment-btn${parcaGorunum === 'ayri' ? ' aktif' : ''}`}
            onClick={() => onParcaGorunum('ayri')}
          >
            Ayrı
          </button>
        </div>
      </div>
    </div>
  );
}
