import { Link, Navigate } from 'react-router-dom';
import { useSiteAuth } from '@/contexts/SiteAuthContext';
import { HESAP_MENU } from '@/data/hesapMenu';
import { HesapIkon } from '@/components/hesap/HesapIkon';

export function HesapPanelSayfasi() {
  const { uye, yukleniyor, cikisYap } = useSiteAuth();

  if (yukleniyor) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!uye) return <Navigate to="/hesabim" replace />;

  return (
    <section className="py-10 sm:py-14">
      <div className="container-site">
        <div className="mb-8 text-center sm:text-left">
          <p className="text-sm text-primary font-semibold">Hoş geldiniz</p>
          <h1 className="section-title mt-1 text-2xl sm:text-3xl">{uye.ad}</h1>
          <p className="section-subtitle mt-1">{uye.email}</p>
        </div>

        <div className="hesap-menu-grid">
          {HESAP_MENU.map((oge) => (
            <Link key={oge.id} to={oge.yol} className="hesap-menu-kart">
              <HesapIkon tip={oge.ikon} />
              <span className="mt-3 text-sm font-medium text-slate-800">{oge.baslik}</span>
            </Link>
          ))}
          <button type="button" onClick={cikisYap} className="hesap-menu-kart hesap-menu-cikis">
            <HesapIkon tip="logout" />
            <span className="mt-3 text-sm font-medium text-slate-800">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </section>
  );
}
