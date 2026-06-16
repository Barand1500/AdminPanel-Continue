export function sayisalId(id: string | number): number {
  if (typeof id === 'number') {
    if (!Number.isInteger(id) || id < 1) throw new Error('Gecersiz kayit id');
    return id;
  }
  const deger = Number.parseInt(id, 10);
  if (!Number.isFinite(deger) || deger < 1) throw new Error('Gecersiz kayit id');
  return deger;
}

export function idToApi(id: number): string {
  return String(id);
}

export function opsiyonelSayisalId(id: string | number | null | undefined): number | null {
  if (id === null || id === undefined || id === '') return null;
  return sayisalId(id);
}
