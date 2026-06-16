import { tokenAl } from '@/features/auth/authApi';
import { adminHeaders, adminJsonFetch } from './adminFetch';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface AdminLogKayit {
  id: string;
  siteId: string;
  kullaniciId?: string | null;
  kullaniciAd: string;
  kullaniciEmail: string;
  islem: string;
  modulId?: string | null;
  aksiyonId?: string | null;
  olusturma: string;
}

export interface LogKaydetPayload {
  islem: string;
  modulId?: string;
  aksiyonId?: string;
}

export interface YedekKaydi {
  id: string;
  siteId: string;
  kullaniciId: string | null;
  kullaniciAd: string;
  kullaniciEmail: string;
  dosyaAdi: string;
  tip: string;
  olusturma: string;
}

export const adminLogApi = {
  async listele(): Promise<AdminLogKayit[]> {
    const veri = await adminJsonFetch<{ loglar: AdminLogKayit[] }>('/loglar', {
      headers: adminHeaders(),
    });
    return veri.loglar;
  },

  async kaydet(payload: LogKaydetPayload): Promise<void> {
    await adminJsonFetch('/loglar', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
  },

  async temizle(): Promise<void> {
    await adminJsonFetch('/loglar/temizle', {
      method: 'DELETE',
      headers: adminHeaders(),
    });
  },
};

export const adminYedekApi = {
  varsayilanDosyaAdi: () =>
    adminJsonFetch<{ dosyaAdi: string }>('/yedek/varsayilan-dosya-adi', {
      headers: adminHeaders(),
    }),

  gecmis: () =>
    adminJsonFetch<{ kayitlar: YedekKaydi[]; sonKayit: YedekKaydi | null }>('/yedek/gecmis', {
      headers: adminHeaders(),
    }),

  async indir(dosyaAdi?: string): Promise<void> {
    const token = tokenAl();
    if (!token) throw new Error('Oturum bulunamadi');

    const yanit = await fetch(`${API_URL}/admin/yedek/indir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dosyaAdi ? { dosyaAdi } : {}),
    });

    if (!yanit.ok) {
      const veri = await yanit.json().catch(() => ({}));
      throw new Error((veri as { mesaj?: string }).mesaj ?? 'Yedek indirilemedi');
    }

    const blob = await yanit.blob();
    const disposition = yanit.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename="(.+)"/);
    const ad = match?.[1] ?? dosyaAdi ?? `yedek-admin-${new Date().toISOString().slice(0, 10)}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ad;
    a.click();
    URL.revokeObjectURL(url);
  },

  async geriYukle(dosya: File, dosyaAdi?: string): Promise<void> {
    const token = tokenAl();
    if (!token) throw new Error('Oturum bulunamadi');

    const form = new FormData();
    form.append('dosya', dosya);
    if (dosyaAdi) form.append('dosyaAdi', dosyaAdi);

    const yanit = await fetch(`${API_URL}/admin/yedek/geri-yukle`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (!yanit.ok) {
      const veri = await yanit.json().catch(() => ({}));
      throw new Error((veri as { mesaj?: string }).mesaj ?? 'Geri yukleme basarisiz');
    }
  },
};
