import { useState, type KeyboardEvent } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { formInputSinifi } from '@/components/form/FormAlani';
import type { YetkiKodu, YetkiTanimi } from '@/features/admin/rolApi';

interface RolEkleSatiriProps {
  yetkiler: YetkiTanimi[];
  onKapat: () => void;
  onEkle: (deger: { baslik: string; aciklama: string; yetkiler: YetkiKodu[] }) => void;
}

/** Yetki matrisinin sonuna eklenen, yeni rol için düzenlenebilir tablo satırı. */
export function RolEkleSatiri({ yetkiler, onKapat, onEkle }: RolEkleSatiriProps) {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [seciliYetkiler, setSeciliYetkiler] = useState<YetkiKodu[]>(['goruntuleme']);
  const [hata, setHata] = useState('');

  function ekle() {
    if (!baslik.trim()) {
      setHata('Rol adı zorunludur.');
      return;
    }
    onEkle({ baslik: baslik.trim(), aciklama: aciklama.trim(), yetkiler: seciliYetkiler });
    onKapat();
  }

  function tuslaEkle(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      ekle();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onKapat();
    }
  }

  return (
    <tr className="border-t border-[var(--ap-accent)] bg-[color-mix(in_srgb,var(--ap-accent)_8%,var(--ap-surface-2))] align-top">
      <td className="px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--ap-accent)]">Yeni rol</span>
          <button
            type="button"
            onClick={onKapat}
            className="inline-flex h-6 w-6 items-center justify-center rounded border border-[var(--ap-border)] ap-muted hover:bg-[var(--ap-hover)]"
            aria-label="Yeni rolü iptal et"
            title="İptal"
          >
            <IconX size={14} stroke={2} />
          </button>
        </div>
        <input
          className={`${formInputSinifi} mb-2 py-2 text-sm`}
          placeholder="Rol adı"
          value={baslik}
          onChange={(event) => {
            setBaslik(event.target.value);
            setHata('');
          }}
          onKeyDown={tuslaEkle}
          autoFocus
        />
        <input
          className={`${formInputSinifi} py-2 text-xs`}
          placeholder="Kısa açıklama (isteğe bağlı)"
          value={aciklama}
          onChange={(event) => setAciklama(event.target.value)}
          onKeyDown={tuslaEkle}
        />
        <p className="mt-2 text-[10px] ap-muted">Rol adını yazın — kod otomatik oluşur.</p>
        {hata && <p className="mt-1 text-[11px] text-red-400">{hata}</p>}
        <button
          type="button"
          onClick={ekle}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--ap-accent)] px-3 py-2 text-xs font-semibold text-white hover:brightness-110"
        >
          <IconPlus size={14} stroke={2.2} /> Rolü ekle
        </button>
      </td>
      {yetkiler.map((yetki) => {
        const secili = seciliYetkiler.includes(yetki.kod);
        return (
          <td key={yetki.kod} className="px-3 py-3 text-center">
            <button
              type="button"
              onClick={() => setSeciliYetkiler((onceki) => (
                onceki.includes(yetki.kod)
                  ? onceki.filter((kod) => kod !== yetki.kod)
                  : [...onceki, yetki.kod]
              ))}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                secili
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)] text-white'
                  : 'border-[var(--ap-border)] text-[var(--ap-muted)] hover:bg-[var(--ap-hover)]'
              }`}
              title={secili ? `${yetki.etiket} yetkisini kaldır` : `${yetki.etiket} yetkisini ver`}
              aria-pressed={secili}
            >
              {secili ? '✓' : '—'}
            </button>
          </td>
        );
      })}
    </tr>
  );
}
