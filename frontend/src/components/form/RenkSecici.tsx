import { FormAlani, formInputSinifi } from './FormAlani';

interface RenkSeciciProps {
  etiket: string;
  deger: string;
  onChange: (deger: string) => void;
  varsayilan?: string;
}

function gecerliHex(deger: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(deger);
}

export function RenkSecici({ etiket, deger, onChange, varsayilan = '#7c3aed' }: RenkSeciciProps) {
  const pickerDeger = gecerliHex(deger) ? deger : varsayilan;

  return (
    <FormAlani etiket={etiket}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={pickerDeger}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-[var(--ap-border)] bg-transparent p-0.5"
          title="Renk sec"
        />
        <input
          type="text"
          value={deger}
          onChange={(e) => onChange(e.target.value)}
          className={formInputSinifi}
          placeholder={varsayilan}
        />
      </div>
    </FormAlani>
  );
}
