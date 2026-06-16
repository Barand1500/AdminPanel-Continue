import type { HeaderAyarlari } from '@/types/header';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { IkonSecici } from './IkonSecici';

type AramaStil = NonNullable<HeaderAyarlari['arama']>['stil'];

interface AramaStilSeciciProps {
  arama: NonNullable<HeaderAyarlari['arama']>;
  onChange: (arama: NonNullable<HeaderAyarlari['arama']>) => void;
}

const STILLER: { id: AramaStil; ad: string; sinif: string }[] = [
  { id: 'yuvarlak', ad: 'Yuvarlak', sinif: 'rounded-full border border-slate-200 py-2 pl-9 pr-3' },
  { id: 'kare', ad: 'Kare', sinif: 'rounded-lg border border-slate-200 py-2 pl-9 pr-3' },
  { id: 'minimal', ad: 'Minimal', sinif: 'border-0 border-b border-slate-300 rounded-none py-2 pl-9 pr-3 bg-transparent' },
];

export function AramaStilSecici({ arama, onChange }: AramaStilSeciciProps) {
  return (
    <div className="space-y-4">
      <FormAlani etiket="Arama placeholder">
        <input
          type="text"
          className={formInputSinifi}
          value={arama.placeholder}
          onChange={(e) => onChange({ ...arama, placeholder: e.target.value })}
          placeholder="Ürün Ara..."
        />
      </FormAlani>

      <div>
        <p className="ap-muted mb-2 text-xs font-medium uppercase tracking-wide">Input stili</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {STILLER.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ ...arama, stil: s.id })}
              className={`rounded-lg border p-3 text-left transition ${
                arama.stil === s.id
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-hover)]'
                  : 'border-[var(--ap-border)] hover:border-[var(--ap-accent)]'
              }`}
            >
              <p className="ap-heading mb-2 text-xs font-semibold">{s.ad}</p>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <div className={`w-full text-xs text-slate-400 ${s.sinif}`}>Örnek</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <IkonSecici
        etiket="Arama ikonu"
        grup="arama"
        deger={arama.ikon}
        onChange={(ikon) => onChange({ ...arama, ikon })}
      />
    </div>
  );
}
