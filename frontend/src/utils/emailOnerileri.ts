const DOMAINLER = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'yandex.com',
  'proton.me',
  'live.com',
];

export function emailOnerileri(deger: string): string[] {
  const at = deger.indexOf('@');
  if (at === -1) {
    if (!deger.trim()) return [];
    return DOMAINLER.map((d) => `${deger.trim()}@${d}`);
  }

  const kullanici = deger.slice(0, at);
  const domainParca = deger.slice(at + 1).toLowerCase();
  if (!kullanici) return [];

  return DOMAINLER.filter((d) => d.startsWith(domainParca) && d !== domainParca).map(
    (d) => `${kullanici}@${d}`
  );
}
