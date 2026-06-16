import { adminHeaders, adminJsonFetch } from './adminFetch';

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

export interface DashboardOzet {
  istatistikler: DashboardIstatistik;
  sonBloglar: { id: string; baslik: string; yayinda: boolean; olusturma: string }[];
  sonGonderimler: { id: string; formAd: string; okundu: boolean; olusturma: string }[];
}

export async function dashboardOzetGetir(): Promise<DashboardOzet> {
  return adminJsonFetch<DashboardOzet>('/dashboard', { headers: adminHeaders() });
}
