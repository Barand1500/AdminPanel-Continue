import { useEffect, useState } from 'react';
import {
  CubukGrafik,
  DonemSecici,
  KpiKart,
  VeriTablosu,
} from '@/components/admin/dashboard/DashboardBilesenleri';
import { DashboardHizliErisim } from '@/components/admin/dashboard/DashboardHizliErisim';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import { dashboardOzetGetir, type DashboardOzet } from '@/features/admin/dashboardApi';
import type { AdminModul } from '@/types/admin';
import type { DashboardDonem } from '@/types/dashboard';

function tarihKisa(iso: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

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
  const [analitikOzet, setAnalitikOzet] = useState<DashboardOzet>(ozet);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    let iptal = false;
    void (async () => {
      setYukleniyor(true);
      try {
        const veri = await dashboardOzetGetir(donem);
        if (!iptal) setAnalitikOzet(veri);
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    })();
    return () => {
      iptal = true;
    };
  }, [donem]);

  const s = analitikOzet.istatistikler;
  const analitik = analitikOzet.analitik;
  const formDonem = analitik?.donemGonderimSayisi ?? 0;

  return (
    <>
      <div className="ap-dash-header-actions">
        <DonemSecici aktif={donem} onDegistir={setDonem} />
      </div>

      <div className="ap-dash-kpi-grid" data-ap-kesif="dash-kpi">
        <KpiKart
          etiket="Form Gönderimi"
          deger={formDonem.toLocaleString('tr-TR')}
          alt={`${s.gonderimSayisi.toLocaleString('tr-TR')} toplam`}
        />
        <KpiKart
          etiket="Yayında Sayfa"
          deger={s.yayindaSayfa.toLocaleString('tr-TR')}
          alt={s.sayfaSayisi > s.yayindaSayfa ? `${s.sayfaSayisi} toplam` : undefined}
        />
        <KpiKart
          etiket="Yayında Blog"
          deger={s.yayindaBlog.toLocaleString('tr-TR')}
          alt={s.blogSayisi > s.yayindaBlog ? `${s.blogSayisi} toplam` : undefined}
        />
        <KpiKart etiket="Widget" deger={s.widgetSayisi.toLocaleString('tr-TR')} />
      </div>

      <div className="ap-dash-analitik-grid">
        <div className="ap-dash-panel ap-dash-panel-genis">
          <h3 className="ap-dash-panel-baslik">Form Gönderimleri</h3>
          {yukleniyor ? (
            <p className="ap-dash-panel-bos">Güncelleniyor…</p>
          ) : (
            <CubukGrafik veriler={analitik?.formGrafik ?? []} />
          )}
        </div>

        <VeriTablosu
          baslik="Sayfalar"
          sutunlar={['Sayfa', 'Widget']}
          satirlar={(analitik?.sayfalar ?? []).map((sayfa) => ({
            birincil: sayfa.ad,
            ikincil: sayfa.widgetSayisi,
          }))}
          bosMesaj="Henüz sayfa yok"
        />
      </div>

      <div className="ap-dash-analitik-grid">
        <VeriTablosu
          baslik="Aktif Widget Tipleri"
          sutunlar={['Tip', 'Adet']}
          satirlar={(analitik?.widgetDagilimi ?? []).map((w) => ({
            birincil: tipEtiketi(w.tip),
            ikincil: w.adet,
          }))}
          bosMesaj="Henüz widget yok"
        />

        <div className="ap-dash-panel">
          <h3 className="ap-dash-panel-baslik">Son Blog Yazıları</h3>
          {analitikOzet.sonBloglar.length === 0 ? (
            <p className="ap-dash-panel-bos">Henüz blog yazısı yok.</p>
          ) : (
            <ul className="ap-dash-sade-liste">
              {analitikOzet.sonBloglar.map((blog) => (
                <li key={blog.id} className="ap-dash-sade-liste-oge">
                  <span className="ap-dash-sade-liste-baslik">{blog.baslik}</span>
                  <span className="ap-dash-sade-liste-meta">
                    {blog.yayinda ? 'Yayında' : 'Taslak'} · {tarihKisa(blog.olusturma)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="ap-dash-analitik-grid">
        <div className="ap-dash-panel ap-dash-panel-genis">
          <h3 className="ap-dash-panel-baslik">Son Form Gönderimleri</h3>
          {analitikOzet.sonGonderimler.length === 0 ? (
            <p className="ap-dash-panel-bos">Henüz form gönderimi yok.</p>
          ) : (
            <ul className="ap-dash-sade-liste">
              {analitikOzet.sonGonderimler.map((g) => (
                <li key={g.id} className="ap-dash-sade-liste-oge">
                  <span className="ap-dash-sade-liste-baslik">{g.formAd}</span>
                  <span className="ap-dash-sade-liste-meta">
                    {!g.okundu && <span className="ap-dash-sade-rozet">Yeni</span>}
                    {g.okundu ? 'Okundu' : 'Bekliyor'} · {tarihKisa(g.olusturma)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DashboardHizliErisim moduller={hizliModuller} onModulAc={onModulAc} />
    </>
  );
}
