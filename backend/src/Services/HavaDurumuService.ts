const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_MS = 15 * 60 * 1000;

export interface HavaAnlikVeri {
  sicaklik: string;
  durum: string;
  hissedilen: string;
  nem: string;
  ruzgar: string;
}

export interface HavaGunVeri {
  id: string;
  gun: string;
  durum: string;
  ikon: string;
  max: string;
  min: string;
}

export interface HavaDurumuSonuc {
  sehir: string;
  ilce: string;
  anlik: HavaAnlikVeri;
  gunler: HavaGunVeri[];
}

const cache = new Map<string, { veri: HavaDurumuSonuc; zaman: number }>();

const HAVA_KODLARI: Record<number, { metin: string; ikon: string }> = {
  0: { metin: 'Açık', ikon: '☀️' },
  1: { metin: 'Az Bulutlu', ikon: '🌤️' },
  2: { metin: 'Parçalı Bulutlu', ikon: '⛅' },
  3: { metin: 'Kapalı', ikon: '☁️' },
  45: { metin: 'Sisli', ikon: '🌫️' },
  48: { metin: 'Sisli', ikon: '🌫️' },
  51: { metin: 'Çisenti', ikon: '🌦️' },
  53: { metin: 'Çisenti', ikon: '🌦️' },
  55: { metin: 'Çisenti', ikon: '🌦️' },
  61: { metin: 'Yağmurlu', ikon: '🌧️' },
  63: { metin: 'Yağmurlu', ikon: '🌧️' },
  65: { metin: 'Yağmurlu', ikon: '🌧️' },
  71: { metin: 'Karlı', ikon: '❄️' },
  80: { metin: 'Sağanak', ikon: '🌧️' },
  95: { metin: 'Fırtına', ikon: '⛈️' },
};

function havaMetni(kod: number) {
  return HAVA_KODLARI[kod] ?? { metin: 'Değişken', ikon: '🌡️' };
}

function gunAdi(iso: string) {
  const tarih = new Date(iso);
  return tarih.toLocaleDateString('tr-TR', { weekday: 'long' });
}

function sehirEslestir(a: string, b: string) {
  const norm = (s: string) =>
    s
      .trim()
      .toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i');
  return norm(a) === norm(b) || norm(a).includes(norm(b)) || norm(b).includes(norm(a));
}

async function konumAra(
  ad: string,
  count = 5
): Promise<{ latitude: number; longitude: number; name: string; admin1?: string }[]> {
  const geoUrl = `${GEO_URL}?name=${encodeURIComponent(ad)}&count=${count}&language=tr&countryCode=TR`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) return [];
  const geoJson = (await geoRes.json()) as {
    results?: { latitude: number; longitude: number; name: string; admin1?: string }[];
  };
  return geoJson.results ?? [];
}

async function konumBul(sehir: string, ilce?: string) {
  const temizSehir = sehir.trim();
  const temizIlce = ilce?.trim() ?? '';

  if (temizIlce) {
    const ilceSonuclari = await konumAra(temizIlce, 10);
    const ilceEslesen = ilceSonuclari.find((k) => sehirEslestir(k.admin1 ?? '', temizSehir));
    if (ilceEslesen) return ilceEslesen;

    const birlesik = await konumAra(`${temizIlce}, ${temizSehir}`, 3);
    if (birlesik[0]) return birlesik[0];
  }

  const sehirSonuclari = await konumAra(temizSehir, 3);
  if (sehirSonuclari[0]) return sehirSonuclari[0];

  throw new Error('Konum bulunamadi');
}

export class HavaDurumuService {
  async getir(sehir: string, ilce?: string): Promise<HavaDurumuSonuc> {
    const temizSehir = sehir.trim();
    const temizIlce = ilce?.trim() ?? '';
    if (!temizSehir) throw new Error('Sehir gerekli');

    const anahtar = `${temizSehir}|${temizIlce}`.toLowerCase();
    const cached = cache.get(anahtar);
    if (cached && Date.now() - cached.zaman < CACHE_MS) return cached.veri;

    const konum = await konumBul(temizSehir, temizIlce);

    const forecastUrl = new URL(FORECAST_URL);
    forecastUrl.searchParams.set('latitude', String(konum.latitude));
    forecastUrl.searchParams.set('longitude', String(konum.longitude));
    forecastUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code');
    forecastUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
    forecastUrl.searchParams.set('timezone', 'auto');
    forecastUrl.searchParams.set('forecast_days', '5');

    const forecastRes = await fetch(forecastUrl.toString());
    if (!forecastRes.ok) throw new Error('Hava verisi alinamadi');

    const f = (await forecastRes.json()) as {
      current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        weather_code: number;
      };
      daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
      };
    };

    const anlikKod = havaMetni(f.current.weather_code);
    const anlik: HavaAnlikVeri = {
      sicaklik: `${Math.round(f.current.temperature_2m)}°`,
      durum: anlikKod.metin,
      hissedilen: `${Math.round(f.current.apparent_temperature)}°`,
      nem: `%${f.current.relative_humidity_2m}`,
      ruzgar: `${f.current.wind_speed_10m.toFixed(1)} m/s`,
    };

    const gunler: HavaGunVeri[] = f.daily.time.slice(0, 5).map((t, i) => {
      const kod = havaMetni(f.daily.weather_code[i] ?? 0);
      return {
        id: t,
        gun: gunAdi(t),
        durum: kod.metin,
        ikon: kod.ikon,
        max: `${Math.round(f.daily.temperature_2m_max[i] ?? 0)}°`,
        min: `${Math.round(f.daily.temperature_2m_min[i] ?? 0)}°`,
      };
    });

    const veri: HavaDurumuSonuc = {
      sehir: temizSehir,
      ilce: temizIlce || konum.name,
      anlik,
      gunler,
    };

    cache.set(anahtar, { veri, zaman: Date.now() });
    return veri;
  }
}
