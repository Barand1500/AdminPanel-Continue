import { useCallback, useRef, useState } from 'react';
import { FormAlani, formInputSinifi } from './FormAlani';
import { adminMedyaYukle, medyaTamUrl } from '@/features/admin/medyaApi';

interface GorselAlanProps {
  etiket: string;
  aciklama?: string;
  deger: string;
  onChange: (url: string) => void;
  kabul?: string;
  onizlemeSinifi?: string;
}

function YukleIkon({ sinif }: { sinif?: string }) {
  return (
    <svg className={sinif ?? 'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
    </svg>
  );
}

export function GorselAlan({
  etiket,
  aciklama,
  deger,
  onChange,
  kabul = 'image/*,.svg',
  onizlemeSinifi = 'h-16 w-16 rounded-lg object-contain bg-[var(--ap-input-bg)] border border-[var(--ap-border)]',
}: GorselAlanProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const dosyaYukle = useCallback(
    async (dosya: File) => {
      setYukleniyor(true);
      setHata('');
      try {
        const medya = await adminMedyaYukle(dosya, dosya.name);
        onChange(medyaTamUrl(medya.url));
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Yukleme basarisiz');
      } finally {
        setYukleniyor(false);
      }
    },
    [onChange]
  );

  const onDosyaSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (dosya) void dosyaYukle(dosya);
    e.target.value = '';
  };

  const onizlemeUrl = deger ? (deger.startsWith('http') || deger.startsWith('data:') ? deger : medyaTamUrl(deger)) : '';

  return (
    <FormAlani etiket={etiket} aciklama={aciklama}>
      <div className="ap-gorsel-alan">
        <div className="ap-gorsel-onizleme">
          {onizlemeUrl ? (
            <img src={onizlemeUrl} alt="" className={onizlemeSinifi} />
          ) : (
            <div className={`${onizlemeSinifi} flex items-center justify-center text-[var(--ap-text-muted)]`}>
              <svg className="h-8 w-8 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>

        <div className="ap-gorsel-girdi">
          <div className="ap-gorsel-input-kutu">
            <input
              type="url"
              value={deger}
              onChange={(e) => onChange(e.target.value)}
              className={`${formInputSinifi} ap-gorsel-url-input`}
              placeholder="https://... veya yukleyin"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={yukleniyor}
              className="ap-gorsel-yukle-btn"
              title="Bilgisayardan yukle"
            >
              {yukleniyor ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--ap-accent)] border-t-transparent" />
              ) : (
                <YukleIkon />
              )}
            </button>
            <input ref={inputRef} type="file" accept={kabul} className="hidden" onChange={onDosyaSec} />
          </div>
          {hata && <p className="mt-1.5 text-xs text-red-400">{hata}</p>}
        </div>
      </div>
    </FormAlani>
  );
}
