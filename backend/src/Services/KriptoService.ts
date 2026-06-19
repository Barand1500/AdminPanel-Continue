const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const CACHE_MS = 5 * 60 * 1000;

export interface KriptoPiyasaVeri {
  id: string;
  sembol: string;
  ad: string;
  fiyat: string;
  degisim: string;
  ikonUrl?: string;
}

let cache: { veri: KriptoPiyasaVeri[]; zaman: number; anahtar: string } | null = null;

export class KriptoService {
  async listele(limit = 10, symbols?: string[]): Promise<KriptoPiyasaVeri[]> {
    const semboller = symbols?.map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
    const anahtar = `${limit}|${semboller.join(',')}`;
    if (cache && cache.anahtar === anahtar && Date.now() - cache.zaman < CACHE_MS) {
      return cache.veri;
    }

    const url = new URL(COINGECKO_URL);
    url.searchParams.set('vs_currency', 'usd');
    url.searchParams.set('order', 'market_cap_desc');
    url.searchParams.set('per_page', String(Math.min(Math.max(limit, 1), 50)));
    url.searchParams.set('page', '1');
    url.searchParams.set('sparkline', 'false');
    url.searchParams.set('price_change_percentage', '24h');

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('Kripto verisi alinamadi');

    const json = (await res.json()) as {
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      price_change_percentage_24h: number | null;
    }[];

    let liste: KriptoPiyasaVeri[] = json.map((k) => ({
      id: k.id,
      sembol: k.symbol.toUpperCase(),
      ad: k.name,
      fiyat: `$${k.current_price >= 1 ? Math.round(k.current_price) : k.current_price.toFixed(2)}`,
      degisim: `${(k.price_change_percentage_24h ?? 0).toFixed(2)}%`,
      ikonUrl: k.image,
    }));

    if (semboller.length > 0) {
      liste = liste.filter((k) => semboller.includes(k.sembol.toLowerCase()));
      if (liste.length === 0) {
        liste = json
          .filter((k) => semboller.includes(k.symbol.toLowerCase()))
          .map((k) => ({
            id: k.id,
            sembol: k.symbol.toUpperCase(),
            ad: k.name,
            fiyat: `$${k.current_price >= 1 ? Math.round(k.current_price) : k.current_price.toFixed(2)}`,
            degisim: `${(k.price_change_percentage_24h ?? 0).toFixed(2)}%`,
            ikonUrl: k.image,
          }));
      }
    }

    cache = { veri: liste, zaman: Date.now(), anahtar };
    return liste;
  }
}
