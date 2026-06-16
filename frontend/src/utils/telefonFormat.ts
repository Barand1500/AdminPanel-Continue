/** Rakamlari gruplar: 0 ile basliyorsa 0538 930 33 14, degilse 538 930 33 14 */
export function telefonFormatla(ham: string): string {
  const sifirla = ham.trimStart().startsWith('0');
  const rakamlar = ham.replace(/\D/g, '');
  if (!rakamlar) return '';

  if (sifirla) {
    const d = rakamlar.startsWith('0') ? rakamlar.slice(0, 11) : `0${rakamlar}`.slice(0, 11);
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
    if (d.length <= 9) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9)}`;
  }

  const d = rakamlar.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}`;
}

/** WhatsApp: uluslararasi format +90 538 930 33 14 */
export function whatsappFormatla(ham: string): string {
  let rakamlar = ham.replace(/\D/g, '');
  if (!rakamlar) return '';

  if (rakamlar.startsWith('90')) rakamlar = rakamlar.slice(2);
  if (rakamlar.startsWith('0')) rakamlar = rakamlar.slice(1);
  rakamlar = rakamlar.slice(0, 10);

  if (rakamlar.length <= 3) return `+90 ${rakamlar}`;
  if (rakamlar.length <= 6) return `+90 ${rakamlar.slice(0, 3)} ${rakamlar.slice(3)}`;
  if (rakamlar.length <= 8) {
    return `+90 ${rakamlar.slice(0, 3)} ${rakamlar.slice(3, 6)} ${rakamlar.slice(6)}`;
  }
  return `+90 ${rakamlar.slice(0, 3)} ${rakamlar.slice(3, 6)} ${rakamlar.slice(6, 8)} ${rakamlar.slice(8)}`;
}

export function whatsappKayitDegeri(formatli: string): string {
  const rakamlar = formatli.replace(/\D/g, '');
  if (!rakamlar) return '';
  if (rakamlar.startsWith('90')) return rakamlar;
  const ulusal = rakamlar.startsWith('0') ? rakamlar.slice(1) : rakamlar;
  return `90${ulusal}`;
}
