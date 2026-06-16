import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthKullanici } from '@/types/admin';
import {
  siteBenGetir,
  siteGirisYap,
  siteKayitOl,
  siteProfilGuncelle,
  siteSifreDegistir,
  siteTokenAl,
  siteTokenKaydet,
  siteTokenSil,
} from '@/features/auth/siteAuthApi';

interface SiteAuthContextDeger {
  uye: AuthKullanici | null;
  yukleniyor: boolean;
  girisYap: (email: string, sifre: string) => Promise<void>;
  kayitOl: (ad: string, email: string, sifre: string, sifreTekrar: string) => Promise<void>;
  cikisYap: () => void;
  profilGuncelle: (ad: string, email: string) => Promise<void>;
  sifreDegistir: (mevcut: string, yeni: string, yeniTekrar: string) => Promise<void>;
}

const SiteAuthContext = createContext<SiteAuthContextDeger | null>(null);

export function SiteAuthProvider({ children }: { children: ReactNode }) {
  const [uye, setUye] = useState<AuthKullanici | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const token = siteTokenAl();
    if (!token) {
      setYukleniyor(false);
      return;
    }

    siteBenGetir()
      .then(setUye)
      .catch(() => siteTokenSil())
      .finally(() => setYukleniyor(false));
  }, []);

  async function giris(email: string, sifre: string) {
    const sonuc = await siteGirisYap(email, sifre);
    siteTokenKaydet(sonuc.token);
    setUye(sonuc.kullanici);
  }

  async function kayit(ad: string, email: string, sifre: string, sifreTekrar: string) {
    const sonuc = await siteKayitOl(ad, email, sifre, sifreTekrar);
    siteTokenKaydet(sonuc.token);
    setUye(sonuc.kullanici);
  }

  function cikis() {
    siteTokenSil();
    setUye(null);
  }

  async function profilGuncelle(ad: string, email: string) {
    const guncel = await siteProfilGuncelle(ad, email);
    setUye(guncel);
  }

  async function sifreDegistir(mevcut: string, yeni: string, yeniTekrar: string) {
    await siteSifreDegistir(mevcut, yeni, yeniTekrar);
  }

  return (
    <SiteAuthContext.Provider
      value={{ uye, yukleniyor, girisYap: giris, kayitOl: kayit, cikisYap: cikis, profilGuncelle, sifreDegistir }}
    >
      {children}
    </SiteAuthContext.Provider>
  );
}

export function useSiteAuth() {
  const ctx = useContext(SiteAuthContext);
  if (!ctx) throw new Error('useSiteAuth SiteAuthProvider icinde kullanilmali');
  return ctx;
}
