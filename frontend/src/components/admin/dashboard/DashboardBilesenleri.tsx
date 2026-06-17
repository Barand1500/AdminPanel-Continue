import type { DashboardDonem } from '@/data/dashboardAnalitikMock';
import { DONEM_ETIKETLERI } from '@/data/dashboardAnalitikMock';

export function DonemSecici({
  aktif,
  onDegistir,
}: {
  aktif: DashboardDonem;
  onDegistir: (d: DashboardDonem) => void;
}) {
  return (
    <div className="ap-dash-donem" role="tablist" aria-label="Zaman aralığı">
      {DONEM_ETIKETLERI.map((d) => (
        <button
          key={d.id}
          type="button"
          role="tab"
          aria-selected={aktif === d.id}
          className={aktif === d.id ? 'ap-dash-donem-aktif' : ''}
          onClick={() => onDegistir(d.id)}
        >
          {d.etiket}
        </button>
      ))}
    </div>
  );
}

export function KpiKart({ etiket, deger, alt }: { etiket: string; deger: string | number; alt?: string }) {
  return (
    <div className="ap-dash-kpi">
      <p className="ap-dash-kpi-etiket">{etiket}</p>
      <p className="ap-dash-kpi-deger">{deger}</p>
      {alt && <p className="ap-dash-kpi-alt">{alt}</p>}
    </div>
  );
}

export function ZiyaretGrafik({ veriler }: { veriler: { etiket: string; deger: number }[] }) {
  const max = Math.max(...veriler.map((v) => v.deger), 1);

  return (
    <div className="ap-dash-grafik">
      <div className="ap-dash-grafik-cubuklar">
        {veriler.map((v) => (
          <div key={v.etiket} className="ap-dash-grafik-sutun">
            <span className="ap-dash-grafik-deger">{v.deger}</span>
            <div className="ap-dash-grafik-track">
              <div
                className="ap-dash-grafik-dolgu"
                style={{ height: `${Math.max(6, (v.deger / max) * 100)}%` }}
              />
            </div>
            <span className="ap-dash-grafik-etiket">{v.etiket}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VeriTablosu({
  baslik,
  sutunlar,
  satirlar,
  bosMesaj = 'Veri yok',
}: {
  baslik: string;
  sutunlar: [string, string];
  satirlar: { birincil: string; ikincil: number }[];
  bosMesaj?: string;
}) {
  const max = Math.max(...satirlar.map((s) => s.ikincil), 1);

  return (
    <div className="ap-dash-panel">
      <h3 className="ap-dash-panel-baslik">{baslik}</h3>
      {satirlar.length === 0 ? (
        <p className="ap-dash-panel-bos">{bosMesaj}</p>
      ) : (
        <table className="ap-dash-tablo">
          <thead>
            <tr>
              <th>{sutunlar[0]}</th>
              <th className="ap-dash-tablo-sayisal">{sutunlar[1]}</th>
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => (
              <tr key={s.birincil}>
                <td>
                  <span className="ap-dash-tablo-metin">{s.birincil}</span>
                  <span className="ap-dash-tablo-cubuk">
                    <span style={{ width: `${(s.ikincil / max) * 100}%` }} />
                  </span>
                </td>
                <td className="ap-dash-tablo-sayisal">{s.ikincil.toLocaleString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function ButonTiklamaGrafik({ veriler }: { veriler: { ad: string; tiklama: number }[] }) {
  const max = Math.max(...veriler.map((v) => v.tiklama), 1);

  return (
    <div className="ap-dash-panel">
      <h3 className="ap-dash-panel-baslik">Buton Tıklamaları</h3>
      <div className="ap-dash-buton-liste">
        {veriler.map((v) => (
          <div key={v.ad} className="ap-dash-buton-satir">
            <div className="ap-dash-buton-ust">
              <span className="ap-dash-buton-ad">{v.ad}</span>
              <span className="ap-dash-buton-sayi">{v.tiklama}</span>
            </div>
            <div className="ap-dash-buton-track">
              <div className="ap-dash-buton-dolgu" style={{ width: `${(v.tiklama / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
