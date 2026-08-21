import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js/min';
import { telefonFormatla } from '@/utils/telefonFormat';
import { ulkeBayrakGorselUrl } from '@/utils/dilBayrak';

interface TelefonUlkesi {
  kod: CountryCode;
  ad: string;
  aramaKodu: string;
}

interface UlkeKodluNumaraInputProps {
  deger: string;
  onChange: (deger: string) => void;
  placeholder?: string;
  otomatikDoldur?: 'tel' | 'tel-national';
}

const ONCELIKLI_ULKELER: CountryCode[] = ['TR', 'US', 'CA', 'PR', 'KZ', 'RU'];

const ULKE_ADI_OZELLIKLERI: Partial<Record<CountryCode, string>> = {
  TR: 'Türkiye',
  US: 'ABD',
  CA: 'Kanada',
  PR: 'Porto Riko',
  KZ: 'Kazakistan',
  RU: 'Rusya',
};

const ulkeAdlandirici = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['tr'], { type: 'region' })
  : null;

function ulkeAdiniAl(kod: CountryCode): string {
  return ULKE_ADI_OZELLIKLERI[kod] ?? ulkeAdlandirici?.of(kod) ?? kod;
}

const TELEFON_ULKELERI: TelefonUlkesi[] = getCountries()
  .map((kod) => ({
    kod,
    ad: ulkeAdiniAl(kod),
    aramaKodu: getCountryCallingCode(kod),
  }))
  .sort((sol, sag) => {
    const solOncelik = ONCELIKLI_ULKELER.indexOf(sol.kod);
    const sagOncelik = ONCELIKLI_ULKELER.indexOf(sag.kod);
    if (solOncelik !== -1 || sagOncelik !== -1) {
      return (solOncelik === -1 ? Number.MAX_SAFE_INTEGER : solOncelik)
        - (sagOncelik === -1 ? Number.MAX_SAFE_INTEGER : sagOncelik);
    }
    return sol.ad.localeCompare(sag.ad, 'tr');
  });

const TURKIYE = TELEFON_ULKELERI.find((ulke) => ulke.kod === 'TR')!;

function sadeceRakam(deger: string): string {
  return deger.replace(/\D/g, '').slice(0, 15);
}

function uluslararasiGirisMi(deger: string): boolean {
  const kirpilmis = deger.trimStart();
  const rakamlar = sadeceRakam(deger);
  return (
    kirpilmis.startsWith('+')
    || kirpilmis.startsWith('00')
    || (rakamlar.startsWith('90') && rakamlar.length > 10)
  );
}

function ulkeKodundanTahminEt(rakamlar: string): TelefonUlkesi | undefined {
  return TELEFON_ULKELERI
    .filter((ulke) => rakamlar.startsWith(ulke.aramaKodu))
    .sort((sol, sag) => {
      const kodFarki = sag.aramaKodu.length - sol.aramaKodu.length;
      if (kodFarki !== 0) return kodFarki;
      return TELEFON_ULKELERI.indexOf(sol) - TELEFON_ULKELERI.indexOf(sag);
    })[0];
}

function turkiyeKisaKodMu(rakamlar: string): boolean {
  return /^(404|444|445)/.test(rakamlar.replace(/^0/, ''));
}

function ulusalNumarayiFormatla(deger: string, ulke: TelefonUlkesi): string {
  const rakamlar = sadeceRakam(deger).slice(0, 15 - ulke.aramaKodu.length);
  if (!rakamlar) return '';

  // Türkiye için mevcut 0532 / 0850 / 444 1 234 gösterimini koruyoruz.
  if (ulke.kod === 'TR') return telefonFormatla(rakamlar);

  return new AsYouType(ulke.kod).input(rakamlar);
}

function degerdenUlkeVeUlusalNumara(deger: string): { ulke: TelefonUlkesi; ulusal: string } {
  const rakamlar = sadeceRakam(deger);
  if (!rakamlar) return { ulke: TURKIYE, ulusal: '' };

  if (!uluslararasiGirisMi(deger)) {
    return { ulke: TURKIYE, ulusal: ulusalNumarayiFormatla(deger, TURKIYE) };
  }

  const yazarken = new AsYouType();
  yazarken.input(`+${rakamlar}`);
  const cozulmusUlkeKodu = yazarken.getCountry();
  const ulke = cozulmusUlkeKodu
    ? TELEFON_ULKELERI.find((oge) => oge.kod === cozulmusUlkeKodu)
    : ulkeKodundanTahminEt(rakamlar);
  const seciliUlke = ulke ?? TURKIYE;
  const ulusalRakamlar = yazarken.getNumber()?.nationalNumber
    || rakamlar.slice(seciliUlke.aramaKodu.length);

  return {
    ulke: seciliUlke,
    ulusal: ulusalNumarayiFormatla(ulusalRakamlar, seciliUlke),
  };
}

function kayitDegeriniOlustur(ulke: TelefonUlkesi, ulusal: string): string {
  const rakamlar = sadeceRakam(ulusal).slice(0, 15 - ulke.aramaKodu.length);
  if (!rakamlar) return '';

  // Kısa kodlar ülke kodu eklenmeden, önceki davranışla kaydedilir.
  if (ulke.kod === 'TR' && turkiyeKisaKodMu(rakamlar)) {
    return telefonFormatla(rakamlar);
  }

  const yazarken = new AsYouType(ulke.kod);
  yazarken.input(rakamlar);
  const e164 = yazarken.getNumberValue() ?? `+${ulke.aramaKodu}${rakamlar}`;
  return telefonFormatla(e164);
}

function AsagiOkIkonu() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AramaIkonu() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.5" />
      <path d="m12 12 4 4" strokeLinecap="round" />
    </svg>
  );
}

function UlkeBayragi({ kod, tembelYukle = false }: { kod: CountryCode; tembelYukle?: boolean }) {
  const [yuklenemedi, setYuklenemedi] = useState(false);
  const url = ulkeBayrakGorselUrl(kod);
  const yuksekCozunurlukluUrl = ulkeBayrakGorselUrl(kod, 80);

  useEffect(() => setYuklenemedi(false), [kod]);

  if (!url || yuklenemedi) {
    return (
      <span className="inline-flex h-3.5 w-5 items-center justify-center rounded-[2px] bg-[var(--ap-hover)] text-[9px] font-bold text-[var(--ap-text-muted)]" aria-hidden="true">
        {kod}
      </span>
    );
  }

  return (
    <img
      src={url}
      srcSet={yuksekCozunurlukluUrl ? `${yuksekCozunurlukluUrl} 2x` : undefined}
      width="20"
      height="15"
      loading={tembelYukle ? 'lazy' : undefined}
      alt=""
      aria-hidden="true"
      onError={() => setYuklenemedi(true)}
      className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-sm"
    />
  );
}

/** Bayrak/kod seçimiyle telefon numarasını ülkeye göre yazarken biçimlendirir. */
export function UlkeKodluNumaraInput({
  deger,
  onChange,
  placeholder = 'XXX XXX XX XX',
  otomatikDoldur = 'tel',
}: UlkeKodluNumaraInputProps) {
  const [baslangic] = useState(() => degerdenUlkeVeUlusalNumara(deger));
  const [seciliUlke, setSeciliUlke] = useState<TelefonUlkesi>(baslangic.ulke);
  const [ulusalDeger, setUlusalDeger] = useState(baslangic.ulusal);
  const [acik, setAcik] = useState(false);
  const [arama, setArama] = useState('');
  const [odak, setOdak] = useState(false);
  const acilirPencereId = useId();
  const kapsayiciRef = useRef<HTMLDivElement>(null);
  const tetikleyiciRef = useRef<HTMLButtonElement>(null);
  const aramaRef = useRef<HTMLInputElement>(null);
  const sonYayinlananDegerRef = useRef<string | null>(null);

  useEffect(() => {
    // Kullanıcının yeni yazdığı kısmi bir numarayı, üst bileşen biçimlendirse
    // bile geri alıp imleç deneyimini bozmuyoruz.
    if (deger === sonYayinlananDegerRef.current) return;
    const sonraki = degerdenUlkeVeUlusalNumara(deger);
    setSeciliUlke(sonraki.ulke);
    setUlusalDeger(sonraki.ulusal);
  }, [deger]);

  useEffect(() => {
    if (!acik) return;

    aramaRef.current?.focus();
    const disariTiklama = (olay: MouseEvent) => {
      if (!kapsayiciRef.current?.contains(olay.target as Node)) setAcik(false);
    };
    const escapeIleKapat = (olay: KeyboardEvent) => {
      if (olay.key !== 'Escape') return;
      setAcik(false);
      tetikleyiciRef.current?.focus();
    };

    document.addEventListener('mousedown', disariTiklama);
    document.addEventListener('keydown', escapeIleKapat);
    return () => {
      document.removeEventListener('mousedown', disariTiklama);
      document.removeEventListener('keydown', escapeIleKapat);
    };
  }, [acik]);

  const gorunenUlkeler = useMemo(() => {
    const sorgu = arama.trim().toLocaleLowerCase('tr-TR');
    if (!sorgu) return TELEFON_ULKELERI;
    return TELEFON_ULKELERI.filter((ulke) => (
      ulke.ad.toLocaleLowerCase('tr-TR').includes(sorgu)
      || ulke.kod.toLocaleLowerCase('tr-TR').includes(sorgu)
      || `+${ulke.aramaKodu}`.includes(sorgu.replace(/\s/g, ''))
    ));
  }, [arama]);

  const degisiklikYayinla = (ulke: TelefonUlkesi, ulusal: string) => {
    const kayitDegeri = kayitDegeriniOlustur(ulke, ulusal);
    sonYayinlananDegerRef.current = kayitDegeri;
    onChange(kayitDegeri);
  };

  const ulkeSec = (ulke: TelefonUlkesi) => {
    const formatli = ulusalNumarayiFormatla(ulusalDeger, ulke);
    setSeciliUlke(ulke);
    setUlusalDeger(formatli);
    setAcik(false);
    setArama('');
    degisiklikYayinla(ulke, formatli);
  };

  return (
    <div ref={kapsayiciRef} className={`relative ${acik ? 'z-50' : ''}`}>
      <div
        className={`ap-input flex min-h-[42px] w-full items-center rounded-lg border transition ${
          odak ? 'border-[var(--ap-accent)] ring-1 ring-[var(--ap-accent)]' : ''
        }`}
      >
        <button
          ref={tetikleyiciRef}
          type="button"
          className="flex h-[40px] shrink-0 items-center gap-1.5 rounded-l-lg px-3 text-left text-sm font-semibold text-[var(--ap-text)] transition hover:bg-[var(--ap-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-accent)]"
          onClick={() => setAcik((onceki) => !onceki)}
          aria-haspopup="dialog"
          aria-expanded={acik}
          aria-controls={acik ? acilirPencereId : undefined}
          aria-label={`Ülke kodu: ${seciliUlke.ad}, +${seciliUlke.aramaKodu}`}
        >
          <UlkeBayragi kod={seciliUlke.kod} />
          <span>+{seciliUlke.aramaKodu}</span>
          <span className={`text-[var(--ap-text-muted)] transition-transform ${acik ? 'rotate-180' : ''}`}>
            <AsagiOkIkonu />
          </span>
        </button>
        <span className="h-5 w-px shrink-0 bg-[var(--ap-border)]" aria-hidden="true" />
        <input
          type="tel"
          inputMode="tel"
          autoComplete={otomatikDoldur}
          value={ulusalDeger}
          onChange={(olay) => {
            // Kullanıcı tam uluslararası numarayı yapıştırırsa seçili ülkeyi
            // otomatik çözüp numarayı prefix alanından ayırıyoruz.
            if (uluslararasiGirisMi(olay.target.value)) {
              const sonraki = degerdenUlkeVeUlusalNumara(olay.target.value);
              setSeciliUlke(sonraki.ulke);
              setUlusalDeger(sonraki.ulusal);
              degisiklikYayinla(sonraki.ulke, sonraki.ulusal);
              return;
            }
            const formatli = ulusalNumarayiFormatla(olay.target.value, seciliUlke);
            setUlusalDeger(formatli);
            degisiklikYayinla(seciliUlke, formatli);
          }}
          onFocus={() => setOdak(true)}
          onBlur={() => setOdak(false)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--ap-text)] outline-none placeholder:text-[var(--ap-text-muted)]"
          placeholder={placeholder}
          aria-label={`${seciliUlke.ad} telefon numarası`}
        />
      </div>

      {acik && (
        <div
          id={acilirPencereId}
          role="dialog"
          aria-label="Ülke kodu seç"
          className="absolute bottom-[calc(100%+0.35rem)] left-0 z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface)] p-1.5 shadow-xl"
        >
          <div className="relative mb-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[var(--ap-text-muted)]">
              <AramaIkonu />
            </span>
            <input
              ref={aramaRef}
              type="search"
              value={arama}
              onChange={(olay) => setArama(olay.target.value)}
              className="ap-input h-9 w-full rounded-md border py-1.5 pl-8 pr-2.5 text-sm outline-none focus:border-[var(--ap-accent)] focus:ring-1 focus:ring-[var(--ap-accent)]"
              placeholder="Ülke veya kod ara..."
              aria-label="Ülke veya telefon kodu ara"
            />
          </div>

          <div className="ap-scroll max-h-64 overflow-y-auto">
            {gorunenUlkeler.length > 0 ? (
              gorunenUlkeler.map((ulke) => {
                const secili = ulke.kod === seciliUlke.kod;
                return (
                  <button
                    key={ulke.kod}
                    type="button"
                    aria-current={secili ? 'true' : undefined}
                    onClick={() => ulkeSec(ulke)}
                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition ${
                      secili
                        ? 'bg-[var(--ap-hover)] font-semibold text-[var(--ap-heading)]'
                        : 'text-[var(--ap-text)] hover:bg-[var(--ap-hover)]'
                    }`}
                  >
                    <UlkeBayragi kod={ulke.kod} tembelYukle />
                    <span className="min-w-0 flex-1 truncate">{ulke.ad}</span>
                    <span className="font-semibold text-[var(--ap-text-muted)]">+{ulke.aramaKodu}</span>
                  </button>
                );
              })
            ) : (
              <p className="px-2.5 py-3 text-sm text-[var(--ap-text-muted)]">Sonuç bulunamadı.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
