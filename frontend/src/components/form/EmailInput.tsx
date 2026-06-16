import { useMemo, useRef, useState } from 'react';
import { FormAlani, formInputSinifi } from './FormAlani';
import { emailOnerileri } from '@/utils/emailOnerileri';

interface EmailInputProps {
  etiket?: string;
  aciklama?: string;
  deger: string;
  onChange: (deger: string) => void;
}

export function EmailInput({
  etiket = 'E-posta',
  aciklama = 'Yazarken gmail, hotmail gibi oneriler cikar',
  deger,
  onChange,
}: EmailInputProps) {
  const [odak, setOdak] = useState(false);
  const [vurgu, setVurgu] = useState(0);
  const kapsayiciRef = useRef<HTMLDivElement>(null);

  const oneriler = useMemo(() => emailOnerileri(deger), [deger]);
  const goster = odak && oneriler.length > 0;

  const oneriSec = (oneri: string) => {
    onChange(oneri);
    setOdak(false);
    setVurgu(0);
  };

  const klavye = (e: React.KeyboardEvent) => {
    if (!goster) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setVurgu((v) => Math.min(v + 1, oneriler.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setVurgu((v) => Math.max(v - 1, 0));
    } else if (e.key === 'Enter' && oneriler[vurgu]) {
      e.preventDefault();
      oneriSec(oneriler[vurgu]);
    } else if (e.key === 'Escape') {
      setOdak(false);
    }
  };

  return (
    <FormAlani etiket={etiket} aciklama={aciklama}>
      <div ref={kapsayiciRef} className="relative">
        <span className="ap-input-ikon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
        </span>
        <input
          type="email"
          autoComplete="email"
          value={deger}
          onChange={(e) => {
            onChange(e.target.value);
            setVurgu(0);
          }}
          onFocus={() => setOdak(true)}
          onBlur={() => setTimeout(() => setOdak(false), 150)}
          onKeyDown={klavye}
          className={`${formInputSinifi} ap-input-ikonlu ${odak ? 'ap-input-odak' : ''}`}
          placeholder="ornek@gmail.com"
        />
        {goster && (
          <ul className="ap-email-oneriler">
            {oneriler.slice(0, 6).map((oneri, i) => (
              <li key={oneri}>
                <button
                  type="button"
                  className={`ap-email-oneri ${i === vurgu ? 'ap-email-oneri-vurgu' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    oneriSec(oneri);
                  }}
                >
                  <span className="text-[var(--ap-text-muted)]">{oneri.split('@')[0]}@</span>
                  <span className="font-medium">{oneri.split('@')[1]}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormAlani>
  );
}
