import { AsYouType } from 'libphonenumber-js/min';

/** Örnek (sahte) numaralar — placeholder ve yardım metinlerinde kullanılır */
export const ORNEK_TELEFON_SIFIRLI = '0532 100 20 30';
export const ORNEK_TELEFON_SIFIRSIZ = '532 100 20 30';
export const ORNEK_TELEFON_KISA = '404 6 334';
export const ORNEK_TELEFON_0850 = '0850 100 20 30';
export const ORNEK_WHATSAPP = '+90 532 100 20 30';

function grupla4_3_2_2(d: string): string {
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  if (d.length <= 9) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
}

function grupla3_3_2_2(d: string): string {
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

/** 404 / 444 / 445 kısa kodlar: 404 6 334 */
function gruplaKisaKod(d: string): string {
  const rakamlar = d.slice(0, 10);
  if (rakamlar.length <= 3) return rakamlar;
  if (rakamlar.length === 4) return `${rakamlar.slice(0, 3)} ${rakamlar.slice(3)}`;
  if (rakamlar.length <= 7) {
    return `${rakamlar.slice(0, 3)} ${rakamlar.slice(3, 4)} ${rakamlar.slice(4)}`.trim();
  }
  if (rakamlar.length <= 10) {
    return `${rakamlar.slice(0, 3)} ${rakamlar.slice(3, 6)} ${rakamlar.slice(6)}`;
  }
  return rakamlar;
}

function kisaKodMu(rakamlar: string): boolean {
  return /^(404|444|445)/.test(rakamlar);
}

/**
 * Uluslararası telefon girişlerini korur. Özellikle mevcut kayıtlardan gelen
 * `+90` değerinin yerel telefon formatı tarafından bozulmasını engeller.
 */
function uluslararasiTelefonFormatla(ham: string): string | null {
  const kirpilmis = ham.trimStart();
  const basindaArti = kirpilmis.startsWith('+');
  const basindaCiftSifir = kirpilmis.startsWith('00');
  let rakamlar = ham.replace(/\D/g, '');

  if (basindaCiftSifir) rakamlar = rakamlar.slice(2);
  if (!rakamlar) return basindaArti || basindaCiftSifir ? '+' : null;

  // Eski panel sürümünün '+' işaretini sildiği 90... kayıtlarını da düzelt.
  const turkiyeUluslararasi =
    rakamlar.startsWith('90') && (basindaArti || basindaCiftSifir || rakamlar.length > 10);

  if (turkiyeUluslararasi) {
    const ulusal = rakamlar.slice(2, 12);
    return `+90${ulusal ? ` ${grupla3_3_2_2(ulusal)}` : ''}`;
  }

  // Diğer ülke kodlarında numarayı o ülkenin kendi yazım kuralıyla biçimle.
  if (basindaArti || basindaCiftSifir) {
    const e164 = `+${rakamlar.slice(0, 15)}`;
    return new AsYouType().input(e164) || e164;
  }

  return null;
}

/**
 * Telefon görünüm formatı.
 * - 0 ile başlıyorsa: 0532 100 20 30 / 0850 100 20 30 (4-3-2-2)
 * - 0 olmadan mobil: 532 100 20 30 (3-3-2-2)
 * - Kısa kod: 404 6 334 (3-1-3)
 * - Uluslararası Türkiye numarası: +90 532 100 20 30
 */
export function telefonFormatla(ham: string): string {
  const uluslararasi = uluslararasiTelefonFormatla(ham);
  if (uluslararasi !== null) return uluslararasi;

  const basindaSifir = ham.trimStart().startsWith('0');
  let rakamlar = ham.replace(/\D/g, '');
  if (!rakamlar) return '';

  if (basindaSifir && !rakamlar.startsWith('0')) {
    rakamlar = `0${rakamlar}`;
  }

  if (rakamlar.startsWith('0')) {
    const d = rakamlar.slice(0, 11);
    if (d.startsWith('05') || d.startsWith('08')) {
      return grupla4_3_2_2(d);
    }
    if (kisaKodMu(d.slice(1))) {
      return gruplaKisaKod(d.slice(1));
    }
    if (d.length >= 7) return grupla4_3_2_2(d);
    return grupla4_3_2_2(d);
  }

  if (kisaKodMu(rakamlar)) {
    return gruplaKisaKod(rakamlar);
  }

  if (rakamlar.startsWith('5')) {
    return grupla3_3_2_2(rakamlar.slice(0, 10));
  }

  if (rakamlar.startsWith('85') || rakamlar.startsWith('80')) {
    return grupla3_3_2_2(rakamlar.slice(0, 10));
  }

  if (rakamlar.length <= 7) {
    return gruplaKisaKod(rakamlar);
  }

  return grupla3_3_2_2(rakamlar.slice(0, 10));
}

/** WhatsApp görünüm formatı: +90 532 100 20 30 (ülke kodu serbest). */
export function whatsappFormatla(ham: string): string {
  const uluslararasi = uluslararasiTelefonFormatla(ham);
  if (uluslararasi !== null) return uluslararasi;

  const artıYazildi = ham.trimStart().startsWith('+');
  let rakamlar = ham.replace(/\D/g, '');
  if (rakamlar.startsWith('00')) rakamlar = rakamlar.slice(2);
  rakamlar = rakamlar.slice(0, 15);
  if (!rakamlar) return artıYazildi ? '+' : '';

  if (rakamlar.startsWith('90')) {
    const ulusal = rakamlar.slice(2, 12);
    return `+90${ulusal ? ` ${grupla3_3_2_2(ulusal)}` : ''}`;
  }

  if (rakamlar.startsWith('0')) {
    const yerel = grupla4_3_2_2(rakamlar.slice(0, 11));
    return artıYazildi ? `+${yerel}` : yerel;
  }

  const govde = grupla3_3_2_2(rakamlar.slice(0, 10));
  const fazla = rakamlar.length > 10 ? ` ${rakamlar.slice(10)}` : '';
  return `${artıYazildi ? '+' : ''}${govde}${fazla}`;
}

export function whatsappKayitDegeri(formatli: string): string {
  const basindaArti = formatli.trimStart().startsWith('+');
  const rakamlar = formatli.replace(/\D/g, '').slice(0, 15);
  if (!rakamlar) return basindaArti ? '+' : '';
  return `${basindaArti ? '+' : ''}${rakamlar}`;
}
