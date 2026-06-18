import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminSiteOnizleLink } from '@/components/admin/AdminHeader';
import { HizliErisimAyarlariModal } from '@/components/admin/ortak/HizliErisimAyarlariModal';
import { YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import {
  ButonTiklamaGrafik,
  DonemSecici,
  KpiKart,
  VeriTablosu,
  ZiyaretGrafik,
} from '@/components/admin/dashboard/DashboardBilesenleri';
import { dashboardAnalitikMock, type DashboardDonem } from '@/data/dashboardAnalitikMock';
import { dashboardOzetGetir } from '@/features/admin/dashboardApi';
import { hizliErisimModulleri } from '@/utils/dashboardTercihleri';

interface DashboardSayfasiProps {
  onModulAc: (modulId: string) => void;
}

export function DashboardSayfasi({ onModulAc }: DashboardSayfasiProps) {
  const { kullanici } = useAuth();
  const [donem, setDonem] = useState<DashboardDonem>('bugun');
  const [formYeni, setFormYeni] = useState(0);
  const [formToplam, setFormToplam] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [hizliErisimAcik, setHizliErisimAcik] = useState(false);

  const analitik = useMemo(() => dashboardAnalitikMock(donem), [donem]);

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
        const ozet = await dashboardOzetGetir();
        setFormToplam(ozet.istatistikler.gonderimSayisi);
        setFormYeni(ozet.istatistikler.okunmamisGonderim);
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Dashboard yüklenemedi');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  if (yukleniyor) {
    return <YukleniyorDurumu mesaj="Dashboard yükleniyor..." />;
  }

  return (
    <div className="ap-dash">
      <header className="ap-dash-header">
        <div>
          <p className="ap-muted text-sm">Anasayfa</p>
          <h1 className="ap-heading mt-0.5 text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DonemSecici aktif={donem} onDegistir={setDonem} />
          <AdminSiteOnizleLink />
        </div>
      </header>

      <p className="ap-dash-ornek-not">
        Örnek analitik veriler gösteriliyor. Gerçek ziyaret ve tıklama takibi sonraki aşamada eklenecek.
      </p>

      {hata && <p className="ap-dash-hata mb-4 text-sm">{hata}</p>}

      <div className="ap-dash-kpi-grid">
        <KpiKart etiket="Ziyaretçi" deger={analitik.ziyaret.toLocaleString('tr-TR')} />
        <KpiKart etiket="Sayfa Görüntüleme" deger={analitik.sayfaGoruntulenme.toLocaleString('tr-TR')} />
        <KpiKart
          etiket="Form Gönderimi"
          deger={formToplam.toLocaleString('tr-TR')}
          alt={formYeni > 0 ? `${formYeni} yeni` : 'Tümü okundu'}
        />
      </div>

      <div className="ap-dash-analitik-grid">
        <div className="ap-dash-panel ap-dash-panel-genis">
          <h3 className="ap-dash-panel-baslik">Ziyaret Grafiği</h3>
          <ZiyaretGrafik veriler={analitik.ziyaretGrafik} />
        </div>

        <VeriTablosu
          baslik="Ülkelere Göre Ziyaret"
          sutunlar={['Ülke', 'Ziyaret']}
          satirlar={analitik.ulkeler.map((u) => ({ birincil: u.ulke, ikincil: u.ziyaret }))}
        />
      </div>

      <div className="ap-dash-analitik-grid">
        <VeriTablosu
          baslik="En Çok Okunan Bloglar"
          sutunlar={['Yazı', 'Okuma']}
          satirlar={analitik.bloglar.map((b) => ({ birincil: b.baslik, ikincil: b.okuma }))}
        />
        <VeriTablosu
          baslik="En Çok Görüntülenen Sayfalar"
          sutunlar={['Sayfa', 'Görüntüleme']}
          satirlar={analitik.sayfalar.map((s) => ({ birincil: s.ad, ikincil: s.goruntulenme }))}
        />
      </div>

      <div className="ap-dash-analitik-grid">
        <ButonTiklamaGrafik veriler={analitik.butonlar} />
      </div>

      <section className="ap-dash-hizli-bolum">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="ap-dash-bolum-baslik mb-0">Hızlı Erişim</h2>
          <button
            type="button"
            onClick={() => setHizliErisimAcik(true)}
            className="ap-dash-ayar-btn"
            title="Hızlı erişimi düzenle"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Düzenle</span>
          </button>
        </div>
        <div className="ap-dash-hizli-grid">
          {hizliModuller.map((modul) => (
            <button key={modul.id} type="button" onClick={() => onModulAc(modul.id)} className="ap-dash-hizli-oge">
              <span className="ap-dash-hizli-ikon">{modul.ikon}</span>
              <span className="ap-dash-hizli-baslik">{modul.baslik}</span>
            </button>
          ))}
        </div>
      </section>

      <HizliErisimAyarlariModal acik={hizliErisimAcik} onKapat={() => setHizliErisimAcik(false)} />
    </div>
  );
}
