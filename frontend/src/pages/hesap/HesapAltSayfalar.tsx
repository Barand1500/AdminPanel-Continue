import { FormEvent, useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSiteAuth } from '@/contexts/SiteAuthContext';

export function HesapProfilSayfasi() {
  const { uye, yukleniyor, profilGuncelle } = useSiteAuth();
  const [ad, setAd] = useState('');
  const [email, setEmail] = useState('');
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);

  useEffect(() => {
    if (uye) {
      setAd(uye.ad);
      setEmail(uye.email);
    }
  }, [uye]);

  if (yukleniyor) return null;
  if (!uye) return <Navigate to="/hesabim" replace />;

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setHata('');
    setBasari('');
    setKaydediliyor(true);
    try {
      await profilGuncelle(ad, email);
      setBasari('Profiliniz güncellendi.');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Güncelleme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <HesapAltSayfa baslik="Profil" geri="/hesabim/panel">
      <form onSubmit={kaydet} className="hesap-form-kart max-w-lg">
        <div>
          <label className="hesap-label">Ad Soyad</label>
          <input className="hesap-input" value={ad} onChange={(e) => setAd(e.target.value)} required />
        </div>
        <div>
          <label className="hesap-label">E-posta</label>
          <input type="email" className="hesap-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {hata && <p className="text-sm text-red-600">{hata}</p>}
        {basari && <p className="text-sm text-green-600">{basari}</p>}
        <button type="submit" disabled={kaydediliyor} className="btn-primary">
          {kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </HesapAltSayfa>
  );
}

export function HesapSifreSayfasi() {
  const { uye, yukleniyor, sifreDegistir } = useSiteAuth();
  const [mevcut, setMevcut] = useState('');
  const [yeni, setYeni] = useState('');
  const [yeniTekrar, setYeniTekrar] = useState('');
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);

  if (yukleniyor) return null;
  if (!uye) return <Navigate to="/hesabim" replace />;

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setHata('');
    setBasari('');
    if (yeni !== yeniTekrar) {
      setHata('Yeni şifreler eşleşmiyor');
      return;
    }
    setKaydediliyor(true);
    try {
      await sifreDegistir(mevcut, yeni, yeniTekrar);
      setBasari('Şifreniz başarıyla değiştirildi.');
      setMevcut('');
      setYeni('');
      setYeniTekrar('');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Şifre değiştirilemedi');
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <HesapAltSayfa baslik="Şifre Değiştir" geri="/hesabim/panel">
      <form onSubmit={kaydet} className="hesap-form-kart max-w-lg">
        <div>
          <label className="hesap-label">Mevcut Şifre</label>
          <input type="password" className="hesap-input" value={mevcut} onChange={(e) => setMevcut(e.target.value)} required />
        </div>
        <div>
          <label className="hesap-label">Yeni Şifre</label>
          <input type="password" className="hesap-input" value={yeni} onChange={(e) => setYeni(e.target.value)} required minLength={6} />
        </div>
        <div>
          <label className="hesap-label">Yeni Şifre Tekrar</label>
          <input type="password" className="hesap-input" value={yeniTekrar} onChange={(e) => setYeniTekrar(e.target.value)} required minLength={6} />
        </div>
        {hata && <p className="text-sm text-red-600">{hata}</p>}
        {basari && <p className="text-sm text-green-600">{basari}</p>}
        <button type="submit" disabled={kaydediliyor} className="btn-primary">
          {kaydediliyor ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
        </button>
      </form>
    </HesapAltSayfa>
  );
}

function HesapAltSayfa({
  baslik,
  geri,
  children,
}: {
  baslik: string;
  geri: string;
  children: ReactNode;
}) {
  return (
    <section className="py-10 sm:py-14">
      <div className="container-site">
        <Link to={geri} className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          ← Hesabım
        </Link>
        <h1 className="section-title text-2xl">{baslik}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
