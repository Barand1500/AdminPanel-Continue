import type { CSSProperties } from 'react';
import type { BlokHucre, BlokOlusturucuConfig, BlokTipi, WidgetBlok } from '@/types/blokOlusturucu';
import {
  VARSAYILAN_GORSEL_YUKSEKLIK,
  blokOnizlemeMedyaStili,
  bosOlusturucu,
  olusturucuOku,
} from '@/types/blokOlusturucu';
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

function gorselDefaults(): Pick<WidgetBlok, 'gorselYukseklikPx' | 'gorselGenislik'> {
  return { gorselYukseklikPx: VARSAYILAN_GORSEL_YUKSEKLIK, gorselGenislik: 'tam' };
}

export function varsayilanBlok(tip: BlokTipi): WidgetBlok {
  const id = uid();
  switch (tip) {
    case 'baslik':
      return { id, tip, metin: 'Başlık metni' };
    case 'metin':
      return { id, tip, metin: 'Paragraf metni buraya yazılır.' };
    case 'gorsel':
      return { id, tip, gorselUrl: '', metin: 'Görsel', ...gorselDefaults() };
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
        ...gorselDefaults(),
      };
    case 'video':
      return {
        id,
        tip,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoKapakUrl: '',
        metin: 'Video başlığı',
        ...gorselDefaults(),
      };
    case 'sayac':
      return { id, tip, sayacDeger: 250, sayacSonEk: '+', sayacEtiket: 'Mutlu Müşteri' };
    case 'fiyat':
      return {
        id,
        tip,
        paketAd: 'Standart Paket',
        fiyatMetin: '₺999',
        ozellikler: ['Özellik 1', 'Özellik 2', 'Özellik 3'],
        butonMetni: 'Satın Al',
        butonLink: '#',
      };
    case 'yorum_tek':
      return {
        id,
        tip,
        yorumMetin: 'Harika bir deneyimdi, kesinlikle tavsiye ederim.',
        yorumAd: 'Ayşe Y.',
        yorumFirma: 'Müşteri',
        yildiz: 5,
      };
    case 'link_satir':
      return { id, tip, linkIkon: '🔗', linkMetin: 'Detaylı bilgi', linkUrl: '#' };
    case 'badge':
      return { id, tip, badgeMetin: 'Yeni' };
    case 'ayirici':
      return { id, tip };
    case 'ayirici_dikey':
      return { id, tip };
    case 'liste':
      return {
        id,
        tip,
        listeSatirlari: ['Madde bir', 'Madde iki', 'Madde üç'],
      };
    case 'cta_serit':
      return {
        id,
        tip,
        ctaMetin: 'Hemen başlayın, farkı görün.',
        butonMetni: 'İletişime Geç',
        butonLink: '#',
      };
    default:
      return { id, tip: 'metin', metin: '' };
  }
}

export function gorselBlokStili(blok: WidgetBlok): CSSProperties {
  return blokOnizlemeMedyaStili(blok) as CSSProperties;
}
