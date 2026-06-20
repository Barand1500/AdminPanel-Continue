import type { LogoBoyutu } from '@/types/logo';
import { LOGO_BOYUT_ETIKET } from '@/types/logo';

const BOYUTLAR: LogoBoyutu[] = ['kucuk', 'orta', 'buyuk', 'cok_buyuk', 'mega_buyuk'];

interface LogoBoyutSeciciProps {
  etiket?: string;
  aciklama?: string;
  deger: LogoBoyutu;
  onChange: (boyut: LogoBoyutu) => void;
}

export function LogoBoyutSecici({
  etiket = 'Logo boyutu',
  aciklama,
  deger,
  onChange,
}: LogoBoyutSeciciProps) {
  return (
    <div>
      <p className="ap-heading mb-1 text-sm font-medium">{etiket}</p>
      {aciklama && <p className="ap-muted mb-2 text-xs">{aciklama}</p>}
      <div className="flex flex-wrap gap-2">
        {BOYUTLAR.map((boyut) => (
          <button
            key={boyut}
            type="button"
            onClick={() => onChange(boyut)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              deger === boyut
                ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/10 text-[var(--ap-accent)] ring-1 ring-[var(--ap-accent)]'
                : 'border-[var(--ap-border)] text-[var(--ap-muted)] hover:border-[var(--ap-accent)]/50'
            }`}
          >
            {LOGO_BOYUT_ETIKET[boyut]}
          </button>
        ))}
      </div>
    </div>
  );
}
