import { adminHeaders, adminJsonFetch } from './adminFetch';
import type { DashboardDonem } from '@/types/dashboard';

export interface DashboardIstatistik {
  sayfaSayisi: number;
  blogSayisi: number;
  formSayisi: number;
  widgetSayisi: number;
  medyaSayisi: number;
  gonderimSayisi: number;
  okunmamisGonderim: number;
  yayindaSayfa: number;
  yayindaBlog: number;
}

export interface DashboardAnalitik {
  donem: DashboardDonem;
  donemGonderimSayisi: number;
  formGrafik: { etiket: string; deger: number }[];
  sayfalar: { ad: string; widgetSayisi: number }[];
  widgetDagilimi: { tip: string; adet: number }[];
}

export interface DashboardOzet {
  istatistikler: DashboardIstatistik;
  sonBloglar: { id: string; baslik: string; yayinda: boolean; olusturma: string }[];
  sonGonderimler: { id: string; formAd: string; okundu: boolean; olusturma: string }[];
  analitik?: DashboardAnalitik;
}

export async function dashboardOzetGetir(donem?: DashboardDonem): Promise<DashboardOzet> {
  const yol = donem ? `/dashboard?donem=${encodeURIComponent(donem)}` : '/dashboard';
  return adminJsonFetch<DashboardOzet>(yol, { headers: adminHeaders() });
}
