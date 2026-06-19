const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface KriptoPiyasaVeri {
  id: string;
  sembol: string;
  ad: string;
  fiyat: string;
  degisim: string;
  ikonUrl?: string;
}

export async function kriptoListesiGetir(limit = 10, symbols?: string[]): Promise<KriptoPiyasaVeri[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (symbols?.length) params.set('symbols', symbols.join(','));
  const res = await fetch(`${API_URL}/kripto?${params}`);
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { mesaj?: string };
    throw new Error(err.mesaj ?? 'Kripto verisi alınamadı');
  }
  const json = (await res.json()) as { liste: KriptoPiyasaVeri[] };
  return json.liste;
}
