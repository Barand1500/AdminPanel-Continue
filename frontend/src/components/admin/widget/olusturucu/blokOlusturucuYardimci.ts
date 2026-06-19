import type { BlokHucre, BlokOlusturucuConfig, BlokTipi, WidgetBlok } from '@/types/blokOlusturucu';
import { bosOlusturucu, olusturucuOku } from '@/types/blokOlusturucu';
import { uid } from '@/types/widget';

export { bosOlusturucu, olusturucuOku };

export function hucreleriOlustur(parcaSayisi: number, mevcut: BlokHucre[] = []): BlokHucre[] {
  const sayi = Math.min(4, Math.max(0, parcaSayisi));
  return Array.from({ length: sayi }, (_, i) => mevcut[i] ?? { id: uid(), bloklar: [] });
}

export function hucreDoluMu(hucre: BlokHucre) {
  return hucre.bloklar.length > 0;
}

export function olusturucuDoluMu(olusturucu?: BlokOlusturucuConfig | null) {
  if (!olusturucu?.parcaSayisi) return false;
  return olusturucu.hucreler.some(hucreDoluMu);
}

export function varsayilanBlok(tip: BlokTipi): WidgetBlok {
  const id = uid();
  switch (tip) {
    case 'baslik':
      return { id, tip, metin: 'Başlık metni' };
    case 'metin':
      return { id, tip, metin: 'Paragraf metni buraya yazılır.' };
    case 'gorsel':
      return { id, tip, gorselUrl: '', metin: 'Görsel' };
    case 'tarih':
      return { id, tip, tarih: new Date().toISOString().slice(0, 10) };
    case 'buton':
      return { id, tip, butonMetni: 'Detay', butonLink: '#' };
    case 'bosluk':
      return { id, tip, boslukPx: 16 };
    case 'yildiz':
      return { id, tip, yildiz: 5 };
    case 'ikon_grup':
      return {
        id,
        tip,
        ikonlar: [
          { id: uid(), ikon: '⚡', etiket: 'Hızlı' },
          { id: uid(), ikon: '🔒', etiket: 'Güvenli' },
          { id: uid(), ikon: '💡', etiket: 'Akıllı' },
        ],
      };
    case 'combobox':
      return {
        id,
        tip,
        comboboxEtiket: 'Seçim yapın',
        secenekler: ['Seçenek 1', 'Seçenek 2', 'Seçenek 3'],
        seciliSecenek: 'Seçenek 1',
      };
    case 'toggle':
      return { id, tip, toggleEtiket: 'Bildirimleri aç', toggleAcik: true };
    case 'kart':
      return {
        id,
        tip,
        kartBaslik: 'Kart başlığı',
        kartMetin: 'Kısa açıklama metni buraya gelir.',
        kartGorselUrl: '',
        kartLink: '#',
      };
    default:
      return { id, tip: 'metin', metin: '' };
  }
}
