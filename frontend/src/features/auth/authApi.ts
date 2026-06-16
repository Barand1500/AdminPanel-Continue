import type { AuthKullanici, AuthYanit, KullaniciTercihleri } from '@/types/admin';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const TOKEN_KEY = 'gt_admin_token';

export interface ProfilGuncelleForm {
  ad: string;
  email: string;
  mevcutSifre?: string;
  yeniSifre?: string;
}

function authHeaders() {
  const token = tokenAl();
  if (!token) throw new Error('Oturum bulunamadı');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export function tokenAl(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function tokenKaydet(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function tokenSil() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function girisYap(email: string, sifre: string): Promise<AuthYanit> {
  const yanit = await fetch(`${API_URL}/admin/auth/giris`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, sifre }),
  });

  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Giris basarisiz');
  return veri;
}

export async function benGetir(): Promise<AuthKullanici> {
  const token = tokenAl();
  if (!token) throw new Error('Token yok');

  const yanit = await fetch(`${API_URL}/admin/auth/ben`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Oturum gecersiz');
  return veri.kullanici;
}

export async function profilGuncelle(form: ProfilGuncelleForm): Promise<AuthKullanici> {
  const payload: Record<string, string> = {
    ad: form.ad.trim(),
    email: form.email.trim(),
  };
  if (form.yeniSifre?.trim()) {
    payload.yeniSifre = form.yeniSifre.trim();
    payload.mevcutSifre = form.mevcutSifre?.trim() ?? '';
  }

  const yanit = await fetch(`${API_URL}/admin/auth/profil`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Profil güncellenemedi');
  return veri.kullanici;
}

export async function tercihlerKaydet(tercihler: KullaniciTercihleri): Promise<AuthKullanici> {
  const yanit = await fetch(`${API_URL}/admin/auth/tercihler`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(tercihler),
  });

  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Tercihler kaydedilemedi');
  return veri.kullanici;
}
