export type DashboardDonem = 'bugun' | '7gun' | '30gun';

const GUN_KISA = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'] as const;

export function gecerliDonem(deger: unknown): DashboardDonem {
  if (deger === '7gun' || deger === '30gun') return deger;
  return 'bugun';
}

export function donemBaslangic(donem: DashboardDonem): Date {
  const now = new Date();
  if (donem === 'bugun') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  const gun = donem === '7gun' ? 6 : 29;
  const baslangic = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  baslangic.setDate(baslangic.getDate() - gun);
  return baslangic;
}

export function formGonderimGrafik(
  tarihler: Date[],
  donem: DashboardDonem
): { etiket: string; deger: number }[] {
  if (donem === 'bugun') {
    const saatler = [0, 4, 8, 10, 12, 14, 16, 18, 20];
    const sayac = new Map(saatler.map((s) => [s, 0]));
    for (const t of tarihler) {
      const saat = t.getHours();
      const kova = saatler.reduce((yakin, s) =>
        Math.abs(saat - s) < Math.abs(saat - yakin) ? s : yakin
      );
      sayac.set(kova, (sayac.get(kova) ?? 0) + 1);
    }
    return saatler.map((s) => ({
      etiket: String(s).padStart(2, '0'),
      deger: sayac.get(s) ?? 0,
    }));
  }

  if (donem === '7gun') {
    const now = new Date();
    const gunler: { etiket: string; baslangic: Date; bitis: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const gun = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const bitis = new Date(gun);
      bitis.setDate(bitis.getDate() + 1);
      gunler.push({
        etiket: GUN_KISA[gun.getDay()],
        baslangic: gun,
        bitis,
      });
    }
    return gunler.map((g) => ({
      etiket: g.etiket,
      deger: tarihler.filter((t) => t >= g.baslangic && t < g.bitis).length,
    }));
  }

  const now = new Date();
  const haftalar: { etiket: string; baslangic: Date; bitis: Date }[] = [];
  for (let i = 3; i >= 0; i--) {
    const bitis = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 - i * 7);
    const baslangic = new Date(bitis);
    baslangic.setDate(baslangic.getDate() - 7);
    haftalar.push({
      etiket: `${4 - i}. Hf`,
      baslangic,
      bitis,
    });
  }
  return haftalar.map((h) => ({
    etiket: h.etiket,
    deger: tarihler.filter((t) => t >= h.baslangic && t < h.bitis).length,
  }));
}
