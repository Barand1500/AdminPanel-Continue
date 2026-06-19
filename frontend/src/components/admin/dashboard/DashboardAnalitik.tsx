import { useMemo, useState } from 'react';
import {
  ButonTiklamaGrafik,
  DonemSecici,
  KpiKart,
  VeriTablosu,
  ZiyaretGrafik,
} from '@/components/admin/dashboard/DashboardBilesenleri';
import { DashboardHizliErisim } from '@/components/admin/dashboard/DashboardHizliErisim';
import { dashboardAnalitikMock, type DashboardDonem } from '@/data/dashboardAnalitikMock';
import type { DashboardOzet } from '@/features/admin/dashboardApi';
import type { AdminModul } from '@/types/admin';

export function DashboardAnalitik({
  ozet,
  hizliModuller,
  onModulAc,
}: {
  ozet: DashboardOzet;
  hizliModuller: AdminModul[];
  onModulAc: (modulId: string) => void;
}) {
  const [donem, setDonem] = useState<DashboardDonem>('bugun');
  const analitik = useMemo(() => dashboardAnalitikMock(donem), [donem]);

  const formToplam = ozet.istatistikler.gonderimSayisi;
  const formYeni = ozet.istatistikler.okunmamisGonderim;

  return (
    <>
      <div className="ap-dash-header-actions">
        <DonemSecici aktif={donem} onDegistir={setDonem} />
      </div>

      <p className="ap-dash-ornek-not">
        Örnek analitik veriler gösteriliyor. Gerçek ziyaret ve tıklama takibi sonraki aşamada eklenecek.
      </p>

      <div className="ap-dash-kpi-grid" data-ap-kesif="dash-kpi">
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

      <DashboardHizliErisim moduller={hizliModuller} onModulAc={onModulAc} />
    </>
  );
}
