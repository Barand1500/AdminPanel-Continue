import { useMemo, useState } from 'react';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { tekEmojiAl } from '@/components/admin/footer/EmojiIkonSecici';
import { SAYFA_IKON_KATEGORILERI } from '@/data/sayfaIkonlari';

interface SayfaIkonSeciciProps {
  ikon: string;
  baslikOnizleme?: string;
  onChange: (ikon: string) => void;
}

export function SayfaIkonSecici({ ikon, baslikOnizleme = 'Sayfa adı', onChange }: SayfaIkonSeciciProps) {
  const [kategori, setKategori] = useState(SAYFA_IKON_KATEGORILERI[0]?.id ?? 'kurumsal');
  const [ozelGirdi, setOzelGirdi] = useState('');

  const aktifKategori = useMemo(
    () => SAYFA_IKON_KATEGORILERI.find((k) => k.id === kategori) ?? SAYFA_IKON_KATEGORILERI[0],
    [kategori]
  );

  return (
    <div className="ap-sayfa-ikon-secici">
      <div className="ap-sayfa-ikon-onizleme">
        <div className="ap-sayfa-ikon-onizleme-buyuk" aria-hidden>
          {ikon || '📄'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="ap-muted text-xs font-medium uppercase tracking-wide">Önizleme</p>
          <p className="ap-heading mt-1 truncate text-lg font-semibold">
            {ikon ? (
              <>
                <span className="mr-1.5">{ikon}</span>
                {baslikOnizleme}
              </>
            ) : (
              baslikOnizleme
            )}
          </p>
          <p className="ap-muted mt-1 text-xs">İkon opsiyoneldir; yalnızca ikon da seçebilirsiniz.</p>
        </div>
        {ikon && (
          <button type="button" className="ap-sayfa-ikon-temizle" onClick={() => onChange('')}>
            Kaldır
          </button>
        )}
      </div>

      <div className="ap-sayfa-ikon-kategori-sekmeler">
        {SAYFA_IKON_KATEGORILERI.map((k) => (
          <button
            key={k.id}
            type="button"
            className={kategori === k.id ? 'ap-sayfa-ikon-kategori-aktif' : ''}
            onClick={() => setKategori(k.id)}
          >
            {k.ad}
          </button>
        ))}
      </div>

      <div className="ap-sayfa-ikon-grid">
        {aktifKategori.ikonlar.map((emoji) => (
          <button
            key={emoji}
            type="button"
            title={emoji}
            className={ikon === emoji ? 'ap-sayfa-ikon-oge-secili' : 'ap-sayfa-ikon-oge'}
            onClick={() => onChange(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      <FormAlani etiket="Özel ikon" aciklama="Emoji yapıştırın veya klavyeden girin">
        <div className="flex gap-2">
          <input
            type="text"
            className={formInputSinifi}
            value={ozelGirdi}
            placeholder="Örn. 🧑‍💼"
            onChange={(e) => {
              setOzelGirdi(e.target.value);
              const secilen = tekEmojiAl(e.target.value);
              if (secilen) onChange(secilen);
            }}
            onPaste={(e) => {
              e.preventDefault();
              const secilen = tekEmojiAl(e.clipboardData.getData('text'));
              if (secilen) {
                onChange(secilen);
                setOzelGirdi(secilen);
              }
            }}
          />
          <button
            type="button"
            className="ap-btn shrink-0 px-3 text-sm"
            disabled={!ozelGirdi.trim()}
            onClick={() => {
              const secilen = tekEmojiAl(ozelGirdi);
              if (secilen) onChange(secilen);
            }}
          >
            Uygula
          </button>
        </div>
      </FormAlani>
    </div>
  );
}
