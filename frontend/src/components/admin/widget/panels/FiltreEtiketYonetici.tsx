import { useState } from 'react';
import { formInputSinifi } from '@/components/form/FormAlani';

interface FiltreEtiketYoneticiProps {
  filtreler: string[];
  onChange: (filtreler: string[]) => void;
}

export function FiltreEtiketYonetici({ filtreler, onChange }: FiltreEtiketYoneticiProps) {
  const [yeniMetin, setYeniMetin] = useState('');

  function ekle() {
    const metin = yeniMetin.trim();
    if (!metin || filtreler.some((f) => f.toLowerCase() === metin.toLowerCase())) return;
    onChange([...filtreler, metin]);
    setYeniMetin('');
  }

  function guncelle(index: number, metin: string) {
    const kopya = [...filtreler];
    kopya[index] = metin;
    onChange(kopya);
  }

  function sil(index: number) {
    onChange(filtreler.filter((_, i) => i !== index));
  }

  function tasi(index: number, yon: -1 | 1) {
    const hedef = index + yon;
    if (hedef < 0 || hedef >= filtreler.length) return;
    const kopya = [...filtreler];
    [kopya[index], kopya[hedef]] = [kopya[hedef], kopya[index]];
    onChange(kopya);
  }

  return (
    <div className="filtre-etiket-yonetici">
      <p className="ap-muted mb-3 text-xs leading-relaxed">
        Kategori listesi oluşturun. <strong className="text-[var(--ap-heading)]">İlk sıradaki</strong> seçenek
        sitede varsayılan &quot;tümünü göster&quot; filtresi olur; diğerleri alt kategorilerdir.
      </p>

      {filtreler.length === 0 ? (
        <p className="ap-muted mb-2 text-sm">Henüz kategori eklenmedi.</p>
      ) : (
        <ul className="filtre-etiket-liste mb-3">
          {filtreler.map((f, i) => (
            <li key={`${i}-${f}`} className="filtre-etiket-satir">
              <div className="filtre-etiket-sira">
                {i === 0 ? (
                  <span className="filtre-etiket-varsayilan" title="Varsayılan — tümünü gösterir">★</span>
                ) : (
                  <span className="ap-muted text-xs">{i}</span>
                )}
              </div>
              <input
                className={formInputSinifi}
                value={f}
                onChange={(e) => guncelle(i, e.target.value)}
                placeholder={i === 0 ? 'Örn: Tümü' : 'Kategori adı'}
              />
              <div className="filtre-etiket-aksiyonlar">
                <button type="button" className="filtre-etiket-tus" onClick={() => tasi(i, -1)} disabled={i === 0} title="Yukarı">
                  ▲
                </button>
                <button type="button" className="filtre-etiket-tus" onClick={() => tasi(i, 1)} disabled={i === filtreler.length - 1} title="Aşağı">
                  ▼
                </button>
                <button type="button" className="filtre-etiket-tus filtre-etiket-tus-sil" onClick={() => sil(i)} title="Sil">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="filtre-etiket-ekle">
        <input
          className={formInputSinifi}
          value={yeniMetin}
          onChange={(e) => setYeniMetin(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              ekle();
            }
          }}
          placeholder="Yeni kategori adı yazın..."
        />
        <button type="button" className="filtre-etiket-ekle-tus" onClick={ekle} disabled={!yeniMetin.trim()}>
          Ekle
        </button>
      </div>

      {filtreler.length === 0 && (
        <button
          type="button"
          className="filtre-etiket-varsayilan-tus mt-2"
          onClick={() => onChange(['Tümü'])}
        >
          + Varsayılan &quot;Tümü&quot; ekle
        </button>
      )}
    </div>
  );
}
