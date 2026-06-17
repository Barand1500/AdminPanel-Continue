import { useEffect, useMemo, useRef, useState } from 'react';
import { formInputSinifi } from './FormAlani';
import {
  IKON_PAKETLERI,
  SOSYAL_PLATFORMLAR,
  SosyalIkonSvg,
  platformAra,
  platformUrlTanima,
  sosyalKayittanOgeler,
  sosyalOgelerdenKayit,
  varsayilanPlatformUrl,
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
  const gosterilecekPlatform = platform?.id ?? oge.platformId;

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
      <div className="ap-sosyal-kart-baslik flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="ap-sosyal-kart-onizleme shrink-0" style={{ color: renk }}>
            {oge.ozelLogoUrl ? (
              <img src={oge.ozelLogoUrl} alt="" className="h-9 w-9 rounded-lg object-contain" />
            ) : platform ? (
              <SosyalIkonSvg platform={platform.id} varyant={seciliVaryant ?? 'brand'} className="h-9 w-9" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-[var(--ap-border)] text-sm font-bold">
                {oge.ad.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="ap-heading truncate text-sm font-semibold">{ad}</p>
            <p className="ap-muted text-xs">{platform ? 'Hazır platform' : 'Özel sosyal medya'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSil}
          className="shrink-0 rounded-lg border border-red-500/30 px-2.5 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
        >
          Kaldır
        </button>
      </div>

      {!platform && (
        <div className="mt-3">
          <label className="ap-muted mb-1 block text-xs">Görünen ad</label>
          <input
            className={formInputSinifi}
            value={oge.ad}
            onChange={(e) => onGuncelle({ ...oge, ad: e.target.value })}
          />
        </div>
      )}

      <div className="ap-sosyal-ikon-secim mt-3">
        <p className="ap-muted mb-2 text-xs font-medium uppercase tracking-wide">İkon paketi</p>
        <div className="flex flex-wrap gap-2">
          {IKON_PAKETLERI.map((paket) => (
            <button
              key={paket.id}
              type="button"
              onClick={() => onGuncelle({ ...oge, ikonVaryant: paket.id, ozelLogoUrl: undefined })}
              className={`ap-sosyal-ikon-btn ${seciliVaryant === paket.id ? 'ap-sosyal-ikon-btn-secili' : ''}`}
              title={paket.aciklama}
            >
              {platform ? (
                <SosyalIkonSvg platform={gosterilecekPlatform} varyant={paket.id} className="h-7 w-7" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center text-xs font-bold">{paket.ad.charAt(0)}</span>
              )}
              <span className="text-[10px] text-[var(--ap-text-muted)]">{paket.ad}</span>
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
            if (taninan && oge.platformId === 'ozel') {
              onGuncelle({
                ...oge,
                id: taninan.id,
                platformId: taninan.id,
                ad: taninan.ad,
                url,
                ikonVaryant: 'brand',
              });
              return;
            }
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

function PlatformEkleKutusu({
  mevcutPlatformIdleri,
  onPlatformEkle,
  onOzelEkle,
}: {
  mevcutPlatformIdleri: string[];
  onPlatformEkle: (platform: SosyalPlatformBilgi) => void;
  onOzelEkle: (ad: string) => void;
}) {
  const [metin, setMetin] = useState('');
  const [ozelMod, setOzelMod] = useState(false);
  const [odakta, setOdakta] = useState(false);
  const kutuRef = useRef<HTMLDivElement>(null);

  const sonuclar = useMemo(() => platformAra(metin, mevcutPlatformIdleri), [metin, mevcutPlatformIdleri]);

  useEffect(() => {
    const disariTikla = (e: MouseEvent) => {
      if (kutuRef.current && !kutuRef.current.contains(e.target as Node)) {
        setOdakta(false);
      }
    };
    document.addEventListener('mousedown', disariTikla);
    return () => document.removeEventListener('mousedown', disariTikla);
  }, []);

  const ozelKaydet = () => {
    const ad = metin.trim();
    if (!ad) return;
    onOzelEkle(ad);
    setMetin('');
    setOzelMod(false);
    setOdakta(false);
  };

  return (
    <div ref={kutuRef} className="ap-sosyal-kart ap-sosyal-ekle-kutu">
      <div className="ap-sosyal-kart-baslik flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="ap-heading text-sm font-semibold">
            {ozelMod ? 'Yeni özel sosyal medya' : 'Platform ekle'}
          </p>
          <p className="ap-muted text-xs">
            {ozelMod
              ? 'Görünen adı yazın ve Enter ile ekleyin'
              : 'TikTok, LinkedIn gibi yazın — listeden seçin'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOzelMod((v) => !v);
            setMetin('');
            setOdakta(true);
          }}
          className="ap-link-btn rounded-lg px-3 py-1.5 text-sm"
        >
          {ozelMod ? 'Hazır platform ara' : '+ Yeni sosyal medya'}
        </button>
      </div>

      <div className="relative mt-3">
        <input
          type="text"
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          onFocus={() => setOdakta(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (ozelMod) {
                ozelKaydet();
              } else if (sonuclar[0]) {
                onPlatformEkle(sonuclar[0]);
                setMetin('');
                setOdakta(false);
              }
            }
          }}
          className={formInputSinifi}
          placeholder={ozelMod ? 'Örn. Pinterest İş Hesabı' : 'Platform ara: tiktok, instagram, linkedin...'}
        />

        {odakta && !ozelMod && metin.trim() && sonuclar.length > 0 && (
          <div className="ap-sosyal-arama-listesi">
            {sonuclar.slice(0, 8).map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => {
                  onPlatformEkle(platform);
                  setMetin('');
                  setOdakta(false);
                }}
                className="ap-sosyal-arama-oge"
              >
                <SosyalIkonSvg platform={platform.id} varyant="brand" className="h-8 w-8 shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="ap-heading truncate text-sm font-medium">{platform.ad}</p>
                  <p className="ap-muted truncate text-xs">{varsayilanPlatformUrl(platform)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {odakta && !ozelMod && metin.trim() && sonuclar.length === 0 && (
          <div className="ap-sosyal-arama-listesi p-3">
            <p className="ap-muted text-xs">Sonuç bulunamadı. Özel eklemek için &quot;Yeni sosyal medya&quot; kullanın.</p>
          </div>
        )}
      </div>

      {ozelMod && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={ozelKaydet} className="ap-btn ap-btn-birincil text-sm" disabled={!metin.trim()}>
            Ekle
          </button>
        </div>
      )}
    </div>
  );
}

export function SosyalMedyaAlani({ sosyal, onGuncelle }: SosyalMedyaAlaniProps) {
  const ogeler = useMemo(() => sosyalKayittanOgeler(sosyal), [sosyal]);

  const guncelleOgeler = (liste: SosyalMedyaOgesi[]) => {
    onGuncelle(sosyalOgelerdenKayit(liste));
  };

  const eklePlatform = (platform: SosyalPlatformBilgi) => {
    if (ogeler.some((o) => o.platformId === platform.id)) return;
    const yeni: SosyalMedyaOgesi = {
      id: platform.id,
      platformId: platform.id,
      ad: platform.ad,
      url: varsayilanPlatformUrl(platform),
      ikonVaryant: 'brand',
    };
    guncelleOgeler([...ogeler, yeni]);
  };

  const ozelEkle = (ad: string) => {
    const id = `ozel-${Date.now()}`;
    const yeni: SosyalMedyaOgesi = {
      id,
      platformId: 'ozel',
      ad,
      url: '',
      ikonVaryant: 'minimal',
    };
    guncelleOgeler([...ogeler, yeni]);
  };

  return (
    <div className="space-y-4">
      <PlatformEkleKutusu
        mevcutPlatformIdleri={ogeler.filter((o) => o.platformId !== 'ozel').map((o) => o.platformId)}
        onPlatformEkle={eklePlatform}
        onOzelEkle={ozelEkle}
      />

      {ogeler.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--ap-border)] px-4 py-8 text-center">
          <p className="ap-muted text-sm">Henüz sosyal medya eklenmedi.</p>
          <p className="ap-muted mt-1 text-xs">Yukarıdan platform arayıp ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
                  if (guncel.platformId !== 'ozel' && guncel.id !== oge.id) {
                    const filtreli = ogeler.filter((x) => x.id !== oge.id);
                    guncelleOgeler([...filtreli, guncel]);
                    return;
                  }
                  guncelleOgeler(liste);
                }}
                onSil={() => guncelleOgeler(ogeler.filter((x) => x.id !== oge.id))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
