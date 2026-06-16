import type { UrunYonetimiSekmeId } from '@/types/urunYonetimi';

export const URUN_YONETIMI_SEKMELER: { id: UrunYonetimiSekmeId; ad: string }[] = [
  { id: 'kategoriler', ad: 'Kategoriler' },
  { id: 'markalar', ad: 'Markalar' },
  { id: 'rozetler', ad: 'Rozetler' },
  { id: 'ozellikler', ad: 'Özellikler' },
  { id: 'firsatlar', ad: 'Fırsat Yönetimi' },
  { id: 'urun-listesi', ad: 'Ürün Listesi' },
  { id: 'toplu-gorsel', ad: 'Toplu Görsel Yükle' },
  { id: 'yorumlar', ad: 'Yorumlar' },
];

interface UrunSekmeCubuguProps {
  aktif: UrunYonetimiSekmeId;
  onDegistir: (id: UrunYonetimiSekmeId) => void;
}

export function UrunSekmeCubugu({ aktif, onDegistir }: UrunSekmeCubuguProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-[var(--ap-border)] pb-2">
      {URUN_YONETIMI_SEKMELER.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onDegistir(s.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            aktif === s.id
              ? 'bg-[var(--ap-accent)] text-white'
              : 'text-[var(--ap-muted)] hover:bg-[var(--ap-hover)]'
          }`}
        >
          {s.ad}
        </button>
      ))}
    </div>
  );
}
