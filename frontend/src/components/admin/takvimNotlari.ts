export interface TakvimNotu { metin: string; olusturma: string; guncelleme: string; }
const STORAGE_KEY = 'ap-takvim-notlari';

export function tarihAnahtari(yil: number, ay: number, gun: number) {
  return `${yil}-${String(ay + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;
}
export function takvimNotlariOku(): Record<string, TakvimNotu> {
  try { const ham = localStorage.getItem(STORAGE_KEY); return ham ? JSON.parse(ham) as Record<string, TakvimNotu> : {}; } catch { return {}; }
}
export function takvimNotuKaydet(tarih: string, metin: string) {
  const notlar = takvimNotlariOku(); const simdi = new Date().toISOString();
  notlar[tarih] = { metin: metin.trim(), olusturma: notlar[tarih]?.olusturma ?? simdi, guncelleme: simdi };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notlar));
}
export function takvimNotuSil(tarih: string) { const notlar = takvimNotlariOku(); delete notlar[tarih]; localStorage.setItem(STORAGE_KEY, JSON.stringify(notlar)); }
export function tarihEtiketi(tarih: string) { const [y,m,g] = tarih.split('-').map(Number); return new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(y, m - 1, g)); }
