import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminSiteOnizleLink } from '@/components/admin/AdminHeader';
import { YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import { DashboardAnalitik } from '@/components/admin/dashboard/DashboardAnalitik';
import { DashboardGorunumSecici } from '@/components/admin/dashboard/DashboardGorunumSecici';
import { DashboardSade } from '@/components/admin/dashboard/DashboardSade';
import { dashboardOzetGetir, type DashboardOzet } from '@/features/admin/dashboardApi';
import { hizliErisimModulleri } from '@/utils/dashboardTercihleri';
import {
  dashboardGorunumKaydet,
  dashboardGorunumOku,
  type DashboardGorunum,
} from '@/utils/dashboardGorunum';

interface DashboardSayfasiProps {
  onModulAc: (modulId: string) => void;
}

export function DashboardSayfasi({ onModulAc }: DashboardSayfasiProps) {
  const { kullanici } = useAuth();
  const [gorunum, setGorunum] = useState<DashboardGorunum>(() => dashboardGorunumOku());
  const [ozet, setOzet] = useState<DashboardOzet | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  const hizliModuller = useMemo(
    () => hizliErisimModulleri(kullanici?.tercihler?.dashboardHizliErisim),
    [kullanici?.tercihler?.dashboardHizliErisim]
  );

  useModulAksiyonlari(
    { onizle: () => window.open('/', '_blank') },
    { onizle: true }
  );

  useEffect(() => {
    void (async () => {
      try {
        const veri = await dashboardOzetGetir();
        setOzet(veri);
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Dashboard yüklenemedi');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  function gorunumDegistir(yeni: DashboardGorunum) {
    setGorunum(yeni);
    dashboardGorunumKaydet(yeni);
  }

  if (yukleniyor) {
    return <YukleniyorDurumu mesaj="Dashboard yükleniyor..." />;
  }

  if (!ozet) {
    return <p className="ap-dash-hata text-sm">{hata || 'Dashboard verisi alınamadı.'}</p>;
  }

  return (
    <div className={`ap-dash ${gorunum === 'sade' ? 'ap-dash-mod-sade' : ''}`}>
      <header className="ap-dash-header">
        <div>
          <p className="ap-muted text-sm">Anasayfa</p>
          <h1 className="ap-heading mt-0.5 text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DashboardGorunumSecici aktif={gorunum} onDegistir={gorunumDegistir} />
          <AdminSiteOnizleLink />
        </div>
      </header>

      {hata && <p className="ap-dash-hata mb-4 text-sm">{hata}</p>}

      {gorunum === 'sade' ? (
        <DashboardSade
          kullaniciAd={kullanici?.ad ?? 'Kullanıcı'}
          ozet={ozet}
          hizliModuller={hizliModuller}
          onModulAc={onModulAc}
        />
      ) : (
        <DashboardAnalitik ozet={ozet} hizliModuller={hizliModuller} onModulAc={onModulAc} />
      )}
    </div>
  );
}
