export type DashboardGorunum = 'analitik' | 'sade';

const ANAHTAR = 'gt-admin-dashboard-gorunum';

export function dashboardGorunumOku(): DashboardGorunum {
  try {
    const kayit = localStorage.getItem(ANAHTAR);
    return kayit === 'sade' ? 'sade' : 'analitik';
  } catch {
    return 'analitik';
  }
}

export function dashboardGorunumKaydet(gorunum: DashboardGorunum) {
  try {
    localStorage.setItem(ANAHTAR, gorunum);
  } catch {
    /* depolama kapalı olabilir */
  }
}

export const DASHBOARD_GORUNUM_ETIKETLERI: { id: DashboardGorunum; etiket: string; aciklama: string }[] = [
  { id: 'analitik', etiket: 'Analitik', aciklama: 'Grafikler ve istatistikler' },
  { id: 'sade', etiket: 'Sade', aciklama: 'Göz yormayan özet görünüm' },
];
