import type { AuthKullanici, AuthYanit } from '@/types/admin';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const TOKEN_KEY = 'gt_site_token';

export function siteTokenAl(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function siteTokenKaydet(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function siteTokenSil() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = siteTokenAl();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function siteKayitOl(
  ad: string,
  email: string,
  sifre: string,
  sifreTekrar: string
): Promise<AuthYanit> {
  const yanit = await fetch(`${API_URL}/auth/kayit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ad, email, sifre, sifreTekrar }),
  });
  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Kayıt başarısız');
  return veri;
}

export async function siteGirisYap(email: string, sifre: string): Promise<AuthYanit> {
  const yanit = await fetch(`${API_URL}/auth/giris`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, sifre }),
  });
  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Giriş başarısız');
  return veri;
}

export async function siteBenGetir(): Promise<AuthKullanici> {
  const yanit = await fetch(`${API_URL}/auth/ben`, { headers: authHeaders() });
  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Oturum geçersiz');
  return veri.kullanici;
}

export async function siteProfilGuncelle(ad: string, email: string): Promise<AuthKullanici> {
  const yanit = await fetch(`${API_URL}/auth/profil`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ ad, email }),
  });
  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Profil güncellenemedi');
  return veri.kullanici;
}

export async function siteSifreDegistir(
  mevcutSifre: string,
  yeniSifre: string,
  yeniSifreTekrar: string
): Promise<void> {
  const yanit = await fetch(`${API_URL}/auth/sifre`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ mevcutSifre, yeniSifre, yeniSifreTekrar }),
  });
  const veri = await yanit.json();
  if (!yanit.ok) throw new Error(veri.mesaj ?? 'Şifre değiştirilemedi');
}
