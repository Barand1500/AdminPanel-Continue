const API_URL = import.meta.env.VITE_API_URL ?? '/api';

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

export interface HavaDurumuYanit {
  sehir: string;
  ilce: string;
  anlik: HavaAnlikVeri;
  gunler: HavaGunVeri[];
}

export async function havaDurumuGetir(sehir: string, ilce?: string): Promise<HavaDurumuYanit> {
  const params = new URLSearchParams({ sehir });
  if (ilce?.trim()) params.set('ilce', ilce.trim());
  const res = await fetch(`${API_URL}/hava?${params}`);
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { mesaj?: string };
    throw new Error(err.mesaj ?? 'Hava verisi alınamadı');
  }
  return res.json() as Promise<HavaDurumuYanit>;
}
