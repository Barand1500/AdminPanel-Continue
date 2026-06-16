import { formInputSinifi } from '@/components/form/FormAlani';

interface ListeSiralayiciProps<T> {
  ogeler: T[];
  onDegistir: (ogeler: T[]) => void;
  renderOge: (oge: T, index: number) => React.ReactNode;
  bosMesaj?: string;
  yeniEkle?: () => T;
}

export function ListeSiralayici<T extends { id: string }>({
  ogeler,
  onDegistir,
  renderOge,
  bosMesaj = 'Henüz öğe yok',
  yeniEkle,
}: ListeSiralayiciProps<T>) {
  function tasi(index: number, yon: -1 | 1) {
    const hedef = index + yon;
    if (hedef < 0 || hedef >= ogeler.length) return;
    const kopya = [...ogeler];
    [kopya[index], kopya[hedef]] = [kopya[hedef], kopya[index]];
    onDegistir(kopya);
  }

  return (
    <div className="space-y-2">
      {ogeler.length === 0 ? (
        <p className="ap-muted text-sm">{bosMesaj}</p>
      ) : (
        ogeler.map((oge, i) => (
          <div key={oge.id} className="flex gap-2 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-2">
            <div className="flex flex-col gap-1">
              <button type="button" className="text-xs text-[var(--ap-text-muted)] hover:text-white" onClick={() => tasi(i, -1)} disabled={i === 0}>▲</button>
              <button type="button" className="text-xs text-[var(--ap-text-muted)] hover:text-white" onClick={() => tasi(i, 1)} disabled={i === ogeler.length - 1}>▼</button>
            </div>
            <div className="min-w-0 flex-1">{renderOge(oge, i)}</div>
            <button
              type="button"
              className="self-start text-xs text-red-400 hover:text-red-300"
              onClick={() => onDegistir(ogeler.filter((_, j) => j !== i))}
            >
              Sil
            </button>
          </div>
        ))
      )}
      {yeniEkle && (
        <button
          type="button"
          className={`${formInputSinifi} border-dashed text-center text-sm text-[var(--ap-accent)]`}
          onClick={() => onDegistir([...ogeler, yeniEkle()])}
        >
          + Yeni öğe ekle
        </button>
      )}
    </div>
  );
}

export function SecimAlani({
  etiket,
  deger,
  secenekler,
  onChange,
}: {
  etiket: string;
  deger: string;
  secenekler: { id: string; etiket: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-[var(--ap-text-muted)]">{etiket}</label>
      <div className="flex flex-wrap gap-2">
        {secenekler.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              deger === s.id
                ? 'border-[var(--ap-accent)] bg-[color-mix(in_srgb,var(--ap-accent)_15%,transparent)] text-white'
                : 'border-[var(--ap-border)] text-[var(--ap-text-muted)]'
            }`}
          >
            {s.etiket}
          </button>
        ))}
      </div>
    </div>
  );
}
