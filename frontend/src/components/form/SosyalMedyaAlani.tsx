import { useMemo, useRef, useState } from 'react';
import { formInputSinifi } from './FormAlani';
import {
  IKON_VARYANTLARI,
  SOSYAL_PLATFORMLAR,
  SosyalIkonSvg,
  platformUrlTanima,
  sosyalKayittanOgeler,
  sosyalOgelerdenKayit,
  type SosyalIkonVaryant,
  type SosyalMedyaOgesi,
  type SosyalPlatformBilgi,
} from '@/data/sosyalMedyaIkonlari';
import { adminMedyaYukle, medyaTamUrl } from '@/features/admin/medyaApi';

interface SosyalMedyaAlaniProps {
  sosyal: Record<string, string>;
  onGuncelle: (sosyal: Record<string, string>) => void;
}

function PlatformKarti({
  oge,
  platform,
  onGuncelle,
  onSil,
}: {
  oge: SosyalMedyaOgesi;
  platform: SosyalPlatformBilgi | null;
  onGuncelle: (guncel: SosyalMedyaOgesi) => void;
  onSil: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const ad = platform?.ad ?? oge.ad;
  const renk = platform?.renk ?? '#64748b';
  const seciliVaryant = oge.ozelLogoUrl ? null : (oge.ikonVaryant as SosyalIkonVaryant);

  const ozelYukle = async (dosya: File) => {
    setYukleniyor(true);
    try {
      const medya = await adminMedyaYukle(dosya, `${oge.id}-ikon`);
      onGuncelle({ ...oge, ozelLogoUrl: medyaTamUrl(medya.url), ikonVaryant: 'ozel' });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="ap-sosyal-kart">
      <div className="ap-sosyal-kart-baslik flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="ap-sosyal-kart-onizleme" style={{ color: renk }}>
            {oge.ozelLogoUrl ? (
              <img src={oge.ozelLogoUrl} alt="" className="h-9 w-9 rounded-lg object-contain" />
            ) : platform ? (
              <SosyalIkonSvg platform={platform.id} varyant={seciliVaryant ?? 'solid'} className="h-9 w-9" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-[var(--ap-border)] text-xs">?</span>
            )}
          </div>
          <div>
            <p className="ap-heading text-sm font-semibold">{ad}</p>
            <p className="ap-muted text-xs">{platform ? 'Hazır platform' : 'Özel sosyal medya'}</p>
          </div>
        </div>
        <button type="button" onClick={onSil} className="text-xs text-red-400 hover:underline">
          Kaldır
        </button>
      </div>

      {!platform && (
        <div className="mt-2">
          <label className="ap-muted mb-1 block text-xs">Görünen ad</label>
          <input
            className={formInputSinifi}
            value={oge.ad}
            onChange={(e) => onGuncelle({ ...oge, ad: e.target.value })}
          />
        </div>
      )}

      <div className="ap-sosyal-ikon-secim mt-3">
        <p className="ap-muted mb-2 text-xs font-medium uppercase tracking-wide">İkon stili</p>
        <div className="flex flex-wrap gap-2">
          {IKON_VARYANTLARI.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onGuncelle({ ...oge, ikonVaryant: v.id, ozelLogoUrl: undefined })}
              className={`ap-sosyal-ikon-btn ${seciliVaryant === v.id ? 'ap-sosyal-ikon-btn-secili' : ''}`}
              title={v.ad}
            >
              {platform && <SosyalIkonSvg platform={platform.id} varyant={v.id} className="h-7 w-7" />}
              <span className="text-[10px] text-[var(--ap-text-muted)]">{v.ad}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={yukleniyor}
            className={`ap-sosyal-ikon-btn ${oge.ozelLogoUrl ? 'ap-sosyal-ikon-btn-secili' : ''}`}
          >
            {yukleniyor ? '...' : 'Özel'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.svg"
            className="hidden"
            onChange={(e) => {
              const dosya = e.target.files?.[0];
              if (dosya) void ozelYukle(dosya);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="ap-muted mb-1.5 block text-xs font-medium">Profil linki</label>
        <input
          type="url"
          value={oge.url}
          onChange={(e) => {
            const url = e.target.value;
            const taninan = platformUrlTanima(url);
            onGuncelle({
              ...oge,
              url,
              platformId: taninan?.id ?? oge.platformId,
              ad: taninan?.ad ?? oge.ad,
            });
          }}
          className={formInputSinifi}
          placeholder={platform?.placeholder ?? 'https://...'}
        />
      </div>
    </div>
  );
}

export function SosyalMedyaAlani({ sosyal, onGuncelle }: SosyalMedyaAlaniProps) {
  const [arama, setArama] = useState('');
  const ogeler = useMemo(() => sosyalKayittanOgeler(sosyal), [sosyal]);

  const eklePlatform = (platform: SosyalPlatformBilgi) => {
    if (ogeler.some((o) => o.platformId === platform.id)) return;
    const yeni: SosyalMedyaOgesi = {
      id: platform.id,
      platformId: platform.id,
      ad: platform.ad,
      url: '',
      ikonVaryant: 'solid',
    };
    onGuncelle(sosyalOgelerdenKayit([...ogeler, yeni]));
    setArama('');
  };

  const ozelEkle = () => {
    const id = `ozel-${Date.now()}`;
    const yeni: SosyalMedyaOgesi = {
      id,
      platformId: 'ozel',
      ad: 'Özel Platform',
      url: '',
      ikonVaryant: 'minimal',
    };
    onGuncelle(sosyalOgelerdenKayit([...ogeler, yeni]));
  };

  const filtreli = SOSYAL_PLATFORMLAR.filter(
    (p) =>
      !ogeler.some((o) => o.platformId === p.id) &&
      (arama ? p.ad.toLowerCase().includes(arama.toLowerCase()) : true)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="Platform ara (LinkedIn, TikTok...)"
          className={`${formInputSinifi} max-w-xs`}
        />
        <button type="button" onClick={ozelEkle} className="ap-link-btn rounded-lg px-3 py-1.5 text-sm">
          + Yeni sosyal medya
        </button>
      </div>

      {arama && filtreli.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-[var(--ap-border)] p-2">
          {filtreli.slice(0, 8).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => eklePlatform(p)}
              className="rounded-lg border border-[var(--ap-border)] px-3 py-1 text-xs hover:bg-[var(--ap-hover)]"
            >
              {p.ad}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {ogeler.map((oge) => {
          const platform =
            oge.platformId !== 'ozel'
              ? SOSYAL_PLATFORMLAR.find((p) => p.id === oge.platformId) ?? null
              : null;
          return (
            <PlatformKarti
              key={oge.id}
              oge={oge}
              platform={platform}
              onGuncelle={(guncel) => {
                const liste = ogeler.map((x) => (x.id === oge.id ? guncel : x));
                onGuncelle(sosyalOgelerdenKayit(liste));
              }}
              onSil={() => onGuncelle(sosyalOgelerdenKayit(ogeler.filter((x) => x.id !== oge.id)))}
            />
          );
        })}
      </div>
    </div>
  );
}
