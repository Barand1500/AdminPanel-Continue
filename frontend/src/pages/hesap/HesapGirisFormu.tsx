import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSiteAuth } from '@/contexts/SiteAuthContext';

type Mod = 'giris' | 'kayit';

export function HesapGirisFormu() {
  const { uye, yukleniyor, girisYap, kayitOl } = useSiteAuth();
  const [mod, setMod] = useState<Mod>('giris');
  const [ad, setAd] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [hata, setHata] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  if (yukleniyor) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (uye) return <Navigate to="/hesabim/panel" replace />;

  async function formGonder(e: FormEvent) {
    e.preventDefault();
    setHata('');
    setGonderiliyor(true);
    try {
      if (mod === 'giris') {
        await girisYap(email, sifre);
      } else {
        await kayitOl(ad, email, sifre, sifreTekrar);
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'İşlem başarısız');
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <section className="py-12">
      <div className="container-site max-w-md">
        <div className="hesap-auth-kart">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl">
            👤
          </div>
          <h1 className="section-title mt-4 text-center">
            {mod === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h1>
          <p className="section-subtitle mt-2 text-center">
            {mod === 'giris'
              ? 'Hesabınıza giriş yapın ve siparişlerinizi takip edin.'
              : 'Yeni hesap oluşturun ve alışverişe başlayın.'}
          </p>

          <div className="mt-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setMod('giris'); setHata(''); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mod === 'giris' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => { setMod('kayit'); setHata(''); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mod === 'kayit' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={formGonder} className="mt-6 space-y-4">
            {mod === 'kayit' && (
              <div>
                <label className="hesap-label">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="hesap-input"
                />
              </div>
            )}
            <div>
              <label className="hesap-label">E-posta</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="hesap-input"
              />
            </div>
            <div>
              <label className="hesap-label">Şifre</label>
              <input
                type="password"
                required
                minLength={6}
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="En az 6 karakter"
                className="hesap-input"
              />
            </div>
            {mod === 'kayit' && (
              <div>
                <label className="hesap-label">Şifre Tekrar</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={sifreTekrar}
                  onChange={(e) => setSifreTekrar(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="hesap-input"
                />
              </div>
            )}

            {hata && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{hata}</p>
            )}

            <button type="submit" disabled={gonderiliyor} className="btn-primary w-full py-3">
              {gonderiliyor ? 'İşleniyor...' : mod === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
