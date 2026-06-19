import type { BlokDuzen } from '@/types/blokOlusturucu';

interface WidgetGridAltBarProps {
  parcaSayisi: 0 | 1 | 2 | 3 | 4;
  duzen: BlokDuzen;
  onParcaSayisi: (sayi: 1 | 2 | 3 | 4) => void;
  onDuzen: (duzen: BlokDuzen) => void;
}

const PARCA_SECENEKLERI: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

export function WidgetGridAltBar({ parcaSayisi, duzen, onParcaSayisi, onDuzen }: WidgetGridAltBarProps) {
  return (
    <div className="ap-olusturucu-alt-bar">
      <div className="ap-olusturucu-alt-grup">
        <span className="ap-olusturucu-alt-etiket">Kaç parça?</span>
        <div className="ap-olusturucu-segment">
          {PARCA_SECENEKLERI.map((n) => (
            <button
              key={n}
              type="button"
              className={`ap-olusturucu-segment-btn${parcaSayisi === n ? ' aktif' : ''}`}
              onClick={() => onParcaSayisi(n)}
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
    </div>
  );
}
