import { useEffect, useState } from 'react';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';
import { adminSayfalariGetir } from '@/features/admin/sayfaApi';
import { formInputSinifi, formSelectSinifi } from './FormAlani';

interface LinkYoluAlaniProps {
  deger: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function LinkYoluAlani({
  deger,
  onChange,
  placeholder = '/hakkimizda veya https://...',
}: LinkYoluAlaniProps) {
  const [sayfalar, setSayfalar] = useState<{ baslik: string; slug: string }[]>([]);

  useEffect(() => {
    void adminSayfalariGetir()
      .then((liste) =>
        setSayfalar(
          liste
            .filter((s) => s.yayinda)
            .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'))
            .map((s) => ({ baslik: s.baslik, slug: s.slug }))
        )
      )
      .catch(() => setSayfalar([]));
  }, []);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        className={`${formInputSinifi} min-w-0 flex-1`}
        value={deger}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <select
        className={`${formSelectSinifi} sm:max-w-[11rem]`}
        value=""
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
      >
        <option value="">Sayfa seç…</option>
        <option value="/">Ana Sayfa</option>
        {sayfalar.map((s) => (
          <option key={s.slug} value={sayfaYolunuBul(s.slug)}>
            {s.baslik}
          </option>
        ))}
      </select>
    </div>
  );
}
