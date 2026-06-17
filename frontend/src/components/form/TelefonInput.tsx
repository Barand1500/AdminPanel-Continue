import { useState } from 'react';
import { FormAlani, formInputSinifi } from './FormAlani';
import {
  ORNEK_TELEFON_0850,
  ORNEK_TELEFON_KISA,
  ORNEK_TELEFON_SIFIRLI,
  ORNEK_TELEFON_SIFIRSIZ,
  telefonFormatla,
} from '@/utils/telefonFormat';

interface TelefonInputProps {
  etiket?: string;
  aciklama?: string;
  deger: string;
  onChange: (deger: string) => void;
  placeholder?: string;
}

export function TelefonInput({
  etiket = 'Telefon',
  aciklama = `${ORNEK_TELEFON_SIFIRLI} · ${ORNEK_TELEFON_0850} · ${ORNEK_TELEFON_SIFIRSIZ} · ${ORNEK_TELEFON_KISA}`,
  deger,
  onChange,
  placeholder = ORNEK_TELEFON_0850,
}: TelefonInputProps) {
  const [odak, setOdak] = useState(false);

  return (
    <FormAlani etiket={etiket} aciklama={aciklama}>
      <div className="relative">
        <span className="ap-input-ikon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={deger}
          onChange={(e) => onChange(telefonFormatla(e.target.value))}
          onFocus={() => setOdak(true)}
          onBlur={() => setOdak(false)}
          className={`${formInputSinifi} ap-input-ikonlu ${odak ? 'ap-input-odak' : ''}`}
          placeholder={placeholder}
        />
      </div>
    </FormAlani>
  );
}
