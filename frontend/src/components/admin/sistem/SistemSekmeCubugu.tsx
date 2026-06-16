import type { SistemSekmeId } from '@/types/sistemAyarlari';
import { SISTEM_SEKMELER } from '@/types/sistemAyarlari';

interface SistemSekmeCubuguProps {
  aktif: SistemSekmeId;
  onDegistir: (id: SistemSekmeId) => void;
}

export function SistemSekmeCubugu({ aktif, onDegistir }: SistemSekmeCubuguProps) {
  return (
    <div className="ap-sistem-sekmeler">
      {SISTEM_SEKMELER.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onDegistir(s.id)}
          className={`ap-sistem-sekme ${aktif === s.id ? 'ap-sistem-sekme-aktif' : ''}`}
        >
          <span className="ap-sistem-sekme-ikon" aria-hidden>
            {s.ikon}
          </span>
          {s.ad}
        </button>
      ))}
    </div>
  );
}

export function DurumAnahtari({
  etiket,
  aciklama,
  acik,
  onChange,
  renk = 'yesil',
  ikon,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  onChange: (v: boolean) => void;
  renk?: 'yesil' | 'turuncu' | 'mavi' | 'kirmizi';
  ikon?: string;
}) {
  return (
    <label className={`ap-sistem-toggle ap-sistem-toggle-${renk} ${acik ? 'ap-sistem-toggle-aktif' : ''}`}>
      <div className="flex items-start gap-3">
        {ikon && <span className="ap-sistem-toggle-ikon">{ikon}</span>}
        <div>
          <span className="ap-heading block text-sm font-semibold">{etiket}</span>
          {aciklama && <span className="ap-muted mt-0.5 block text-xs leading-relaxed">{aciklama}</span>}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onChange(!acik)}
        className={`ap-toggle ${acik ? 'ap-toggle-on' : ''} ${renk === 'turuncu' ? 'ap-toggle-turuncu' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </label>
  );
}
